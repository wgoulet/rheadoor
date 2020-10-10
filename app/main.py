from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
import sqlite3
import datetime
import uuid
import pprint

app = FastAPI()

connection = sqlite3.connect("rasp.db")
cursor = connection.cursor()

cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='work'")

if cursor.fetchone()[0]!=1:
    print("Creating table")
    cursor.execute("CREATE TABLE work (name TEXT, value TEXT, \
        workid TEXT, workstatus TEXT, workcreated DATE, workdone DATE)")
    connection.commit()

class Item(BaseModel):
    name: str
    value: str
    workid: Optional[str] = None
    workstatus: Optional[str] = None
    workcreated: Optional[str] = None
    workdone: Optional[str] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: str):
    connection = sqlite3.connect("rasp.db")
    cursor = connection.cursor()
    row = cursor.execute("SELECT * FROM work WHERE workid = ?",[item_id]).fetchone()
    item = Item(name=row[0],value=row[1])
    item.workid = row[2]
    item.workstatus = row[3]
    item.workcreated = row[4]
    item.workdone = row[5]
    return item

@app.get("/items")
def read_items():
    connection = sqlite3.connect("rasp.db")
    cursor = connection.cursor()
    rows = cursor.execute("SELECT name,value,workid,workstatus,workcreated, \
        workdone FROM work").fetchall()
    connection.commit()
    items = []
    for row in rows:
        rec = {}
        rec['name'] = row[0]
        rec['value'] = row[1]
        rec['id'] = row[2]
        rec['status'] = row[3]
        rec['created'] = row[4]
        rec['done'] = row[5]
        items.append(rec)
    return items

@app.post("/items")
def create_item(item: Item):
    connection = sqlite3.connect("rasp.db")
    cursor = connection.cursor()
    id = str(uuid.uuid4())
    created = datetime.datetime.now()
    status = "PENDING"
    item.workid = id
    item.workstatus = status
    item.workcreated = created
    item.workdone = ""
    record = (item.name,item.value,item.workid,item.workstatus,item.workcreated,item.workdone)
    cursor.execute("INSERT INTO work VALUES (?,?,?,?,?,?)",record)
    connection.commit()
    return item
