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

class ConfigChange(BaseModel):
    updated: Optional[str] = None
    fullTurns: Optional[float] = None
    partialTurns: Optional[float] = None
    userRoles: Optional[str] = None

connection = sqlite3.connect("server.db",detect_types=sqlite3.PARSE_DECLTYPES|sqlite3.PARSE_COLNAMES)
cursor = connection.cursor()

cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='work'")

if cursor.fetchone()[0]!=1:
    print("Creating table")
    cursor.execute("CREATE TABLE work (name TEXT, value TEXT, \
        workid TEXT, workstatus TEXT, workcreated TIMESTAMP, workdone TIMESTAMP)")
    connection.commit()

cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='rhconfig'")

if cursor.fetchone()[0]!=1:
    print("Creating table")
    cursor.execute("CREATE TABLE rhconfig (fullTurns TEXT, partialTurns TEXT, \
        updated TIMESTAMP)")
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
            #'keys': 'http://keycloak.wgoulet.com/auth/realms/master/protocol/openid-connect/certs',
            # Use junk keys from dev server for local dev; in production will always fetch from prod https URLs
            'keys': [
                  {
                      "kid": "Mme6pGkvTUmf1ygM0pybz8vI-X_KGN6RzQnABM55zto",
                      "kty": "RSA",
                      "alg": "RS256",
                      "use": "sig",
                      "n": "gQanAViQWcEa66WZAENipE98Ergp8lUx4KPYv9-Vaq299kWVGX0fMOh5GHgq1YgIQS14rwypX2qopVisGYb3bo15dO7GXR2U0mWTwrTwyGP0GK_RC3etRByPPubzhDBieHEZ7W2riub5_sGoWkzkTJZRPruOP3UR74UQuHARfQePgwJKmGjpw_uAlCRXwO9jAimwexUf3OHOtXIRKkt4A3jKd8MEfUnMqNJcBJHZhSsis0n10ATcbnUnCJMYspQIsLMAQxQ78tQAtBskmNGy9DiBoVYXdRk7_CcwO_Hc7mqpfa6KfWHJR2lpK1bFC1_bibN2SRCU4diV6leINYVIuQ",
                      "e": "AQAB",
                      "x5c": [
                          "MIICmzCCAYMCBgF169MKRTANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjAxMTIxMTcxOTM3WhcNMzAxMTIxMTcyMTE3WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCBBqcBWJBZwRrrpZkAQ2KkT3wSuCnyVTHgo9i/35Vqrb32RZUZfR8w6HkYeCrViAhBLXivDKlfaqilWKwZhvdujXl07sZdHZTSZZPCtPDIY/QYr9ELd61EHI8+5vOEMGJ4cRntbauK5vn+wahaTORMllE+u44/dRHvhRC4cBF9B4+DAkqYaOnD+4CUJFfA72MCKbB7FR/c4c61chEqS3gDeMp3wwR9Scyo0lwEkdmFKyKzSfXQBNxudScIkxiylAiwswBDFDvy1AC0GySY0bL0OIGhVhd1GTv8JzA78dzuaql9rop9YclHaWkrVsULX9uJs3ZJEJTh2JXqV4g1hUi5AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAHY6VkB6hlgkMkZmAI+m7A9FzCm1G+hmrvVmhQOU0qEWMPiR/TLVcsPKoAMZdYMfTOUU5806Mr35i6Auyc8fS/H2WV2gV/qnQAG5oezB6djzmIBQEvUmz5HC5xemxMLAozkyQ28rxBRudw4+AW0TzGrdpiG325Ufg3JH/VMN2gRlUfKrY4dhGhEUCO8g/wQUV9dd3JKJzYhefJGiZoMdPtST3FtGMr43sUi8Kw8lP9LjVXqCJzvNAHvlgGzhW2rbu2rs2X00bZZ1v5mOimt4RIBVCY1Kev90m6kmoNCRbxNjqf5Z3/VhTy324NBYbAEc6gr767H9KArBnGaH8DNAInE="
                      ],
                      "x5t": "VoCiqdFABL0p_fPofv-Wqgvb54w",
                      "x5t#S256": "UxidL9Yge4eJWXGhn3TrxMlGJo2BKPM3NBYVwF70nJo"
                  },
            ],
            #'issuer': 'https://keycloak.wgoulet.com/auth/realms/master',
            'issuer': 'http://localhost:8080/auth/realms/master',
            'audience': 'apicallers'
        }
    },
    public_paths={'/public'},
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

@app.get("/config")
def get_config():
    connection = sqlite3.connect("server.db")
    cursor = connection.cursor()
    rows = cursor.execute("SELECT fullTurns,partialTurns,updated FROM rhconfig ORDER BY updated DESC LIMIT 1").fetchall()
    connection.commit()
    configs = []
    config = ConfigChange()
    pprint.pprint(rows)
    if(len(rows) > 0):
        pprint.pprint(rows[0])
        if(rows[0][0] != 'None'):
            config.fullTurns = float(rows[0][0])
        if(rows[0][1] != 'None'):
            config.partialTurns = float(rows[0][1])
        config.updated = rows[0][2]
    return config

@app.post("/config")
def create_config(config: ConfigChange):
    connection = sqlite3.connect("server.db")
    cursor = connection.cursor()
    pprint.pprint(config)
    # Check if user is authorized, must have the role RheaUser
    roles = config.userRoles.split(':')
    authorized = False
    for role in roles:
        if(role == 'RheaUser'):
            authorized = True

    if(authorized):
        config.updated = datetime.datetime.now()
        record = (str(config.fullTurns),str(config.partialTurns),config.updated)
        pprint.pprint(record)
        cursor.execute("INSERT INTO rhconfig VALUES (?,?,?)",record)
        connection.commit()
        return config
    else:
        return JSONResponse({"Authorized":"False"},status_code=403)

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