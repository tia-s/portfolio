from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import json
import os 

from pathlib import Path

import httpx
from pydantic import BaseModel 

from rapidfuzz import process, fuzz

from dotenv import load_dotenv
load_dotenv()

from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"

# Chat/Search Helper Functions:
class ChatRequest(BaseModel):
    message: str

def _load_persona() -> list:
    questions_path = DATA_DIR / "questions.json"
    with open(questions_path) as f:
        return json.load(f)
    
def _get_relevant_context(question: str, top_k: int = 3) -> str:
    qa_pairs = _load_persona()
    questions = [item["q"] for item in qa_pairs]

    results = process.extract(
        question,
        questions,
        scorer=fuzz.WRatio,
        limit=top_k
    )

    matched = [qa_pairs[questions.index(match[0])] for match in results]
    return "\n".join([f"Q: {item['q']}\nA: {item['a']}" for item in matched])

def _load_system_prompt() -> str:
    prompt_path = DATA_DIR / "prompt.md"
    with open(prompt_path) as f:
        return f.read() 

def read_json(filename: str):
    with open(DATA_DIR / filename) as f:
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

@app.post("/chat")
async def chat(request: ChatRequest):
    persona = _get_relevant_context(request.message)

    system_prompt = _load_system_prompt()
    full_prompt = f"{system_prompt}\n\nContext from conversations with Tianna:\n{persona}"

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": full_prompt},
                {"role": "user", "content": request.message}
            ]
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search(q: str):
    data_path = DATA_DIR / "projects.json"
    with open(data_path) as f:
        projects = json.load(f)

    q_lower = q.lower()

    results = [
        project for project in projects
        if q_lower in project["title"].lower()
        or q_lower in project["description"].lower()
        or q_lower in project["long_description"].lower()
        or any(q_lower in tech.lower() for tech in project["tech"])
    ]

    return results