import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import connectors, datasets, ingest

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Connector Ingestion Platform",
    description="Standalone data connector and ingestion system",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],   # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ───────────────────────────────────────────────────────────────────
app.include_router(connectors.router)
app.include_router(datasets.router)
app.include_router(ingest.router)


@app.get("/")
def root():
    return {
        "message": "Connector Ingestion Platform API",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "connector-platform"}
