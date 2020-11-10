from typing import Optional
from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import authlib
from starlette.applications import Starlette
from starlette_oauth2_api import AuthenticateMiddleware
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import HTMLResponse, RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
import pprint
import json
from fastapi.logger import logger
import logging
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import datetime
import uuid

class Item(BaseModel):
    name: str
    value: str
    workid: Optional[str] = None
    workstatus: Optional[str] = None
    workcreated: Optional[str] = None
    workdone: Optional[str] = None
    userRoles: str

connection = sqlite3.connect("server.db",detect_types=sqlite3.PARSE_DECLTYPES|sqlite3.PARSE_COLNAMES)
cursor = connection.cursor()

cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='work'")

if cursor.fetchone()[0]!=1:
    print("Creating table")
    cursor.execute("CREATE TABLE work (name TEXT, value TEXT, \
        workid TEXT, workstatus TEXT, workcreated TIMESTAMP, workdone TIMESTAMP)")
    connection.commit()

# This server is the backend server that will accept requests from Raspberry PI REST API clients
# that perform work as well as will act as the backend for the user facing web app that allows
# users to submit work requests to be performed by the Raspberry PI REST clients.

# Setup authentication for the API endpoints. API callers that will access the work queue must
# present a valid access token with the apicallers scope present.

app = FastAPI()
app.add_middleware(AuthenticateMiddleware,
    providers={
        'keycloak': {
            'keys': 'https://keycloak.wgoulet.com/auth/realms/master/protocol/openid-connect/certs',
            'issuer': 'https://keycloak.wgoulet.com/auth/realms/master',
            'audience': 'apicallers'
        }
    },
    # Paths that will be used by frontend app will not be protected by the AuthenticateMiddleware,
    # so exclude them. These paths will be protected by user authentication via OAuth
    public_paths={'/','/public','/user','/login','/auth'},
)

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.route("/list")
def read_root(request):
    return JSONResponse({"you are": "authenticated"})

@app.route("/public")
def read_root(request):
    return JSONResponse({"you are": "public"})

@app.post("/items")
def create_item(item: Item):
    connection = sqlite3.connect("server.db")
    cursor = connection.cursor()
    # Check if user is authorized, must have the role RheaUser
    roles = item.userRoles.split(':')
    authorized = False
    for role in roles:
        if(role == 'RheaUser'):
            authorized = True

    if(authorized):
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
    else:
        return JSONResponse({"Authorized":"False"},status_code=403)
        


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8000)