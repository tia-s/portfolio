# Portfolio

A simple, single-page portfolio site built with Vue 3 and FastAPI.

## Stack
- **Client** — Vue 3, TypeScript, SCSS, Vite
- **Server** — FastAPI, Python, Groq, RapidFuzz, JSON data files
## Structure
```
portfolio/
├── client/
│   ├── src/
│   │   ├── components/          # UI elements
│   │   │   ├── HeroSection.vue
│   │   │   ├── ProjectsSection.vue
│   │   │   ├── ProjectCard.vue
│   │   │   ├── ProjectModal.vue
│   │   │   └── ThemeToggle.vue
│   │   ├── composables/         # reusable logic
│   │   │   ├── usePortfolioApi.ts
│   │   │   └── useTheme.ts
│   │   ├── styles/
│   │   │   ├── _tokens.scss     # all CSS variables
│   │   │   ├── _base.scss       # reset and base element styles
│   │   │   ├── _mixins.scss     # reusable SCSS mixins
│   │   │   ├── main.scss        # global entry point
│   │   │   └── components/      # scoped styles
│   │   │       ├── _hero.scss
│   │   │       ├── _projects.scss
│   │   │       ├── _project-card.scss
│   │   │       └── _modal.scss
│   │   ├── App.vue              
│   │   └── main.ts              
│   ├── .env.example             
│   ├── index.html               
│   └── vite.config.ts           # build config and SCSS options
│
└── server/
    ├── data/                    
    │   ├── me.json              # hero section data
    │   └── projects.json        # project data
    ├── main.py                  # API routes
    └── requirements.txt
```

## Local Development

## Environment Variables (.env.examples)
Create a `.env` file inside the `client` folder (same level as `vite.config.ts`) following format in `.env.examples`. 

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the FastAPI server e.g. `http://localhost:8000` |

Create a `.env` file inside the `server` folder (same level as `requirements.txt`) following format in `.env.examples`. 

| Variable | Description |
|---|---|
| `CORS_ORIGINS` | Comma-separated list of allowed origins (e.g. `http://localhost:5173,http://127.0.0.1:5173`) |
| `GROQ_API_KEY`  | API key for accessing Groq's Llama models                                   |

### Client
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Server
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The FastAPI docs are available at `http://localhost:8000/docs` once the server is running.
