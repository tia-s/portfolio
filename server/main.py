from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import json
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://tiasalmon.com", "https://tiaportfolio-production.up.railway.app"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA = Path(__file__).parent / "data"

def read_json(filename: str):
    with open(DATA / filename) as f:
        return json.load(f)

@app.get("/me")
def get_owner():
    data = read_json("me.json")
    return JSONResponse(
        content=data,
        headers={"Cache-Control": "no-cache"}
    )

@app.get("/projects")
def get_projects():
    data = read_json("projects.json")
    return JSONResponse(
        content=data,
        headers={"Cache-Control": "no-cache"}
    )

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    projects = read_json("projects.json")
    match = next((p for p in projects if p["id"] == project_id), None)

    if not match:
        raise HTTPException(status_code=404, detail="Project not found")

    return JSONResponse(
        content=match,
        headers={"Cache-Control": "no-cache"}
    )