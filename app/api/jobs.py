
from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.worker.worker import download_worker, JOB_DISPACHER
from app.jobs.jobs_manager import create_job, run_job
from app.models.job_schemas import JobCreate

router = APIRouter()

@router.post("/jobs/")
async def create_job_endpoint(job: JobCreate, background_tasks: BackgroundTasks):
    # 1. Look up the worker function
    worker_func = JOB_DISPACHER.get(job.job_type)
    
    # 2. Validation: What if the user sends "magic_trick" as job_type?
    if not worker_func:
        raise HTTPException(status_code=400, detail=f"Invalid job_type: {job.job_type}")

    # 3. Create the Job ID (Database/Redis entry)
    # We pass the full payload so it's saved for reference
    job_id = create_job(job.job_type, job.payload)

    # 4. Dispatch the Job
    # Notice we pass 'worker_func' (the function we found) and 'job.payload' (the dict)
    background_tasks.add_task(run_job, job_id, worker_func,job_id,job.payload)

    return {"job_id": job_id, "status": "queued"}

@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    from app.jobs.jobs_manager import get_job
    job = get_job(job_id)
    if job:
        return {
            "job_id": job_id,
            "status": job.get("status"),
            "progress": job.get("progress"),
            "result": job.get("result"),
            "error": job.get("error"),
            "created_at": job.get("created_at"),
            "updated_at": job.get("updated_at"),
            "file_path": job.get("file_path"),  # ← THIS WAS MISSING!
        }
    else:
        return {"message": "Job not found."}