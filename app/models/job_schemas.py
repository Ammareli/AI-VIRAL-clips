from pydantic import BaseModel

class JobCreate(BaseModel):
    job_type: str  # e.g., "download", "transcribe", "summary"
    payload: dict  # e.g., {"url": "https://youtube.com/..."}