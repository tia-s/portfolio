from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA = Path(__file__).parent / "data"

def read_json(filename: str):
    with open(DATA / filename) as f:
        return json.load(f)


@app.get("/me")
def get_owner():
    return read_json("me.json")


@app.get("/projects")
def get_projects():
    return read_json("projects.json")


@app.get("/projects/{project_id}")
def get_project(project_id: int):
    projects = read_json("projects.json")
    match = next((p for p in projects if p["id"] == project_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Project not found")
    return match