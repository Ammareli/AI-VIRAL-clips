import re
import yt_dlp
from app.utils.logger import log_info, log_error


def is_yt_format(url:str) -> bool:
    """
    Validates if the provided URL is a valid YouTube video URL.
    
    Args:
        url (str): The URL to validate.
        """
    log_info(f"Validating YouTube URL: {url}")
    youtube_regex = r"^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$"

    return bool(re.match(youtube_regex, url))

def get_video_preview(url: str) -> dict:
    """
    Fetches minimal metadata using the Android Client API for speed.
    """
    
    ydl_opts = {
        'quiet': True,
        'skip_download': True, # We only want data
        'noplaylist': True,    # Ensure we only check one video
        'no_warnings': True,
        
        # --- SPEED OPTIMIZATIONS ---
        
        # 1. Use the Android Client (It uses a faster API, no heavy HTML parsing)
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web'], # Try Android first, fallback to Web
            }
        },

        # 2. Disable heavy manifest downloads (We don't need stream URLs)
        'youtube_include_dash_manifest': False,
        'youtube_include_hls_manifest': False,
        
        # 3. Request the 'worst' format. 
        # This sounds weird, but it stops yt-dlp from sorting/calculating 
        # the 'best' quality, which saves processing time.
        'format': 'worst',
    }
    
    log_info(f"Fetching video preview for URL: {url}")

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            # fetch the info
            info = ydl.extract_info(url, download=False)
            
            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "valid": True
            }
        except Exception as e:
            log_error(f"Error fetching preview: {e}")
            return None