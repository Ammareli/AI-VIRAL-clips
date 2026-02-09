# from app.worker.worker import youtube_worker
from fastapi import APIRouter, BackgroundTasks


router = APIRouter()

@router.post("/validate_url/")
async def validate_url(url: str, background_tasks: BackgroundTasks):
    from app.jobs.validator import is_yt_format
    from app.utils.logger import log_info, log_error
    # from app.worker.worker import youtube_worker

    if is_yt_format(url):
        log_info(f"Valid YouTube URL received: {url}")
        # background_tasks.add_task(youtube_worker, url)
        return {"message": "URL is valid and processing has started."}
    else:
        log_error(f"Invalid YouTube URL received: {url}")
        return {"message": "Invalid YouTube URL."}
    

@router.get("/preview/")
async def get_video_preview(url: str):
    from app.utils.logger import log_info, log_error
    from app.jobs.validator import get_video_preview

    try:
        log_info(f"Generating video preview for URL: {url}")
        preview_data = get_video_preview(url)
        return {"preview": preview_data}
    except Exception as e:
        log_error(f"Error generating video preview for URL: {url} - {str(e)}")
        return {"message": "Error generating video preview."}
    

@router.post("/download/")
async def download_video(url: str, background_tasks: BackgroundTasks):
    from app.utils.logger import log_info
    from app.worker.worker import download_worker

    log_info(f"Starting video download for URL: {url}")
    background_tasks.add_task(download_worker, "download_job", url)
    return {"message": "Video download started."}

