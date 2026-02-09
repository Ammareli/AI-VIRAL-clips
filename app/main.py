# This is the main Gateway application file.
from fastapi import FastAPI
from app.api.routes import router as vedio_routerer
from app.api.jobs import router as jobs_router
app = FastAPI()


app.include_router(vedio_routerer, prefix="/api/v1",tags=["Video Processing"])
app.include_router(jobs_router, prefix="/api/v1", tags=["Job Management"])


@app.get("/")
async def root():
    return {"message": "Welcome to the AI-VIRALCLIPS API"}

