# This is the main Gateway application file.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import router as vedio_routerer
from app.api.jobs import router as jobs_router

app = FastAPI()

# CORS Configuration - Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve downloaded videos
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

app.include_router(vedio_routerer, prefix="/api/v1", tags=["Video Processing"])
app.include_router(jobs_router, prefix="/api/v1", tags=["Job Management"])


@app.get("/")
async def root():
    return {"message": "Welcome to the AI-VIRALCLIPS API"}

