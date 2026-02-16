# 🚀 Quick Start Guide - AI-VIRALCLIPS

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to project root
cd /home/ammar/Desktop/AI-VIRALCLIPS

# Activate virtual environment
source ENV/bin/activate

# Install/update dependencies
pip install -r requirements.txt
```

### 2. Start Redis

```bash
# Start Redis server
redis-server
```

### 3. Start Backend Server

```bash
# From project root
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:** `http://localhost:8000`

### 4. Start Frontend Server

```bash
# Open new terminal
cd /home/ammar/Desktop/AI-VIRALCLIPS/frontend

# Start HTTP server
python3 -m http.server 8080
```

**Frontend will be available at:** `http://localhost:8080`

---

## Testing the Application

### Step-by-Step Test

1. **Open Frontend**
   - Navigate to: `http://localhost:8080`
   - You should see a dark themed page with "AI-VIRALCLIPS" logo

2. **Enter Test URL**
   - Use this test URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Click "Get Preview"

3. **Check Preview**
   - Thumbnail should load
   - Video title displays
   - Duration badge visible
   - "Start Download" button appears

4. **Start Download**
   - Click "Start Download"
   - Automatically redirects to progress page

5. **Monitor Progress**
   - Job ID displays
   - Progress bar animates
   - Status updates in real-time
   - Watch for: Queued → Downloading → Processing → Completed

6. **Completion**
   - Progress reaches 100%
   - File location displayed
   - "Back to Home" button works

---

## Troubleshooting

### Backend Not Starting

```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Redis Not Running

```bash
# Check Redis status
redis-cli ping
# Should return: PONG

# If not running, start it:
redis-server
```

### CORS Errors

Verify CORS is enabled in `app/main.py`:
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

### API Connection Failed

1. Check backend is running: `curl http://localhost:8000`
2. Check frontend can reach backend (check browser console)
3. Verify firewall isn't blocking requests

---

## Project Structure

```
AI-VIRALCLIPS/
├── app/                    # Backend
│   ├── main.py            # FastAPI app (CORS enabled)
│   ├── api/               # API routes
│   ├── worker/            # yt-dlp worker
│   └── jobs/              # Job management
├── frontend/              # Frontend
│   ├── index.html         # Home page
│   ├── progress.html      # Progress page
│   ├── styles.css         # Design system
│   ├── app.js            # Main logic
│   └── progress.js       # Progress logic
├── downloads/             # Downloaded videos
└── requirements.txt       # Python dependencies
```

---

## Quick Commands Reference

```bash
# Backend
source ENV/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend && python3 -m http.server 8080

# Redis
redis-server
redis-cli ping

# Check logs
tail -f /var/log/redis/redis-server.log
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/v1/preview/?url={url}` | GET | Get video metadata |
| `POST /api/v1/jobs/` | POST | Create download job |
| `GET /api/v1/jobs/{job_id}` | GET | Get job status |

---

## Next Steps

- ✅ Backend analyzed and documented
- ✅ Frontend built with modern UI
- ✅ API integration complete
- ✅ Real-time progress tracking
- 🎯 Ready for testing!

**Enjoy your AI-VIRALCLIPS experience!** 🎥✨

## tesing upates.
