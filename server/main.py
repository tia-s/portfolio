from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import json
import logging
import os 
from typing import Literal

from pathlib import Path

import httpx
from pydantic import BaseModel 

from rapidfuzz import process, fuzz

from dotenv import load_dotenv
load_dotenv()

from groq import Groq

logger = logging.getLogger(__name__)

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
    language: Literal["en", "fr"] = "en"

def _load_persona(language: Literal["en", "fr"] = "en") -> list:
    filename = "questions.fr.json" if language == "fr" else "questions.json"
    questions_path = DATA_DIR / filename
    with open(questions_path, encoding="utf-8") as f:
        return json.load(f)
    
def _get_relevant_context(
    question: str,
    language: Literal["en", "fr"] = "en",
    top_k: int = 3,
) -> str:
    qa_pairs = _load_persona(language)
    questions = [item["q"] for item in qa_pairs]

    results = process.extract(
        question,
        questions,
        scorer=fuzz.WRatio,
        limit=top_k
    )

    matched = [qa_pairs[questions.index(match[0])] for match in results]
    return "\n".join([f"Q: {item['q']}\nA: {item['a']}" for item in matched])

def _load_system_prompt(language: Literal["en", "fr"] = "en") -> str:
    filename = "prompt.fr.md" if language == "fr" else "prompt.md"
    prompt_path = DATA_DIR / filename
    with open(prompt_path, encoding="utf-8") as f:
        return f.read() 

def read_json(filename: str):
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)

def read_language_data(filename: str, language: Literal["en", "fr"]):
    localized_filename = f"{Path(filename).stem}.fr{Path(filename).suffix}"
    return read_json(localized_filename if language == "fr" else filename)

@app.get("/me")
def get_owner(lang: Literal["en", "fr"] = "en"):
    data = read_language_data("me.json", lang)
    return JSONResponse(
        content=data,
        headers={"Cache-Control": "no-cache"}
    )

@app.get("/projects")
def get_projects(lang: Literal["en", "fr"] = "en"):
    data = read_language_data("projects.json", lang)
    return JSONResponse(
        content=data,
        headers={"Cache-Control": "no-cache"}
    )

@app.get("/projects/{project_id}")
def get_project(project_id: int, lang: Literal["en", "fr"] = "en"):
    projects = read_language_data("projects.json", lang)
    match = next((p for p in projects if p["id"] == project_id), None)

    if not match:
        raise HTTPException(status_code=404, detail="Project not found")

    return JSONResponse(
        content=match,
        headers={"Cache-Control": "no-cache"}
    )

@app.post("/chat")
async def chat(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL")
    if not api_key or not model:
        logger.warning("Chat is unavailable because its provider is not configured")
        raise HTTPException(status_code=503, detail="chat_unavailable")
    try:
        persona = _get_relevant_context(request.message, request.language)
        system_prompt = _load_system_prompt(request.language)
        full_prompt = f"{system_prompt}\n\nContext from conversations with Tianna:\n{persona}"
        response = Groq(api_key=api_key).chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": full_prompt},
                {"role": "user", "content": request.message}
            ]
        )

        content = response.choices[0].message.content
        if not content or not content.strip():
            raise RuntimeError("Chat provider returned an empty response")
        return {"response": content}

    except Exception:
        logger.exception("Chat completion failed")
        raise HTTPException(status_code=503, detail="chat_unavailable") from None

@app.get("/search")
async def search(q: str, lang: Literal["en", "fr"] = "en"):
    projects = read_language_data("projects.json", lang)
    search_projects = [projects]
    if lang == "fr":
        search_projects.append(read_json("projects.json"))
    q_lower = q.lower()

    matching_ids = {
        project["id"]
        for source in search_projects
        for project in source
        if q_lower in project["title"].lower()
        or q_lower in project["description"].lower()
        or q_lower in project["long_description"].lower()
        or any(q_lower in tech.lower() for tech in project["tech"])
    }

    return [project for project in projects if project["id"] in matching_ids]