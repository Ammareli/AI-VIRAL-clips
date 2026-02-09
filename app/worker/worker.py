# this is the worker file for processing tasks in the background using Celery
from app.utils.logger import log_error, log_info
from app.core.config import settings
from app.config.redis import redis_client
import yt_dlp




# We pretend this is your heavy worker function
def download_worker(job_id: str, payload: dict):
    url = payload.get("url")
    log_info(f"[{job_id}] Starting download for: {url}")
    
    # 1. Define the Progress Hook
    def progress_hook(d):
        if d['status'] == 'downloading':
            percent = d.get('_percent_str', '0%').strip()
            redis_client.hset(f"job:{job_id}", mapping={
                "status": "downloading",
                "progress": percent,
                "eta": d.get('eta', 0) or 0
            })
            
        elif d['status'] == 'finished':
            redis_client.hset(f"job:{job_id}", mapping={
                "status": "processing_video",
                "progress": "100%"
            })

    # 2. Configure Options
    ydl_opts = {
        # --- CRITICAL FIX: Stop Playlist Downloads ---
        'noplaylist': True, 
        
        # --- Resolution Logic ---
        # "bv*[height<=1080]" = Best Video stream (no audio) with height <= 1080
        # "+ba" = Plus Best Audio
        # "/best" = Fallback if separate streams aren't found
        'format': f"bv*[height<={settings.resolution}]+ba/best",
        'merge_output_format': 'mp4',
        
        # Output template
        'outtmpl': f"downloads/{job_id}_%(title)s.%(ext)s",
        
        # Attach the hook
        'progress_hooks': [progress_hook],
        
        # Optimization: Use Android client for faster stream lookup
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web'],
            }
        },
        
        'quiet': True,
        'no_warnings': True,
        
        # Optional: Fail if the specific resolution isn't available?
        # usually best to leave this off so it just grabs the "next best" thing.
    }

    # 3. Run the Download
    try:
        # Safety Check: Strip the playlist part from the URL manually just in case
        if "&list=" in url:
            url = url.split("&list=")[0]

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
        redis_client.hset(f"job:{job_id}", mapping={"status": "completed"})
        log_info(f"[{job_id}] Finished successfully ✅")
        return {
            "status": "success", 
            "file_path": f"downloads/{job_id}.mp4"
        }
        
    except Exception as e:
        log_error(f"[{job_id}] Download failed ❌")
        # Log the actual error to Redis so you can debug it via API
        redis_client.hset(f"job:{job_id}", mapping={"status": "failed", "error": str(e)})

   

# JOB dispatcher settings

JOB_DISPACHER = {
    "download_vedio": download_worker,
}
    