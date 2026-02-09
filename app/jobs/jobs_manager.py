import uuid
import time
from app.config.redis import redis_client


def create_job(task_name, task_data):
    job_id = str(uuid.uuid4())
    now = int(time.time())
    redis_client.hset(
        f"job:{job_id}",
        mapping={
            "task_name": task_name,
            "task_data": str(task_data),
            "status": "queued",
            "progress": 0,
            "result": "",
            "error": "",
            "created_at": now,
            "updated_at": now,
            "file_path": "",
        })

    redis_client.expire(f"job:{job_id}", 86400)  # Set job data to expire after 1 hour
    return job_id

def update_job(job_id,**fields):
    fields["updated_at"] = int(time.time())
    redis_client.hset(f"job:{job_id}", mapping=fields)


def get_job(job_id):
    job = redis_client.hgetall(f"job:{job_id}")
    return job if job else None

def run_job(job_id, task_func, *args, **kwargs):
    try:
        update_job(job_id, status="in_progress", progress=0)
        result = task_func(*args, **kwargs)
        result_str = str(result["status"]) if isinstance(result, dict) else str(result)
        if "file_path" in result:
            update_job(job_id, status="completed", progress=100, result=result_str, file_path=str(result["file_path"]))
        update_job(job_id, status="completed", progress=100, result=result_str)
    except Exception as e:
        update_job(job_id, status="failed", error=str(e))

