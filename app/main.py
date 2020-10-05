from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

app = FastAPI()

connection = sqlite3.connect("rasp.db")
cursor = connection.cursor()

cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='work'")

if cursor.fetchone()[0]!=1:
    cursor.execute("CREATE TABLE work (name TEXT, value TEXT)")
    connection.commit()

class Item(BaseModel):
    name: str
    value: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.get("/items")
def read_items():
    connection = sqlite3.connect("rasp.db")
    cursor = connection.cursor()
    rows = cursor.execute("SELECT name,value FROM work").fetchall()
    connection.commit()
    return rows

@app.post("/items")
def create_item(item: Item):
    connection = sqlite3.connect("rasp.db")
    cursor = connection.cursor()
    record = (item.name,item.value)
    cursor.execute("INSERT INTO work VALUES (?,?)",record)
    connection.commit()
    return item
