# AI-VIRALCLIPS Frontend

A modern, beautiful web interface for downloading YouTube videos with real-time progress tracking.

## Features

✨ **Modern UI/UX**
- Dark theme with vibrant gradients
- Smooth animations and micro-interactions
- Responsive design
- Glassmorphism effects

🎥 **Video Preview**
- Fetch video metadata before downloading
- Display thumbnail, title, and duration
- Fast preview using optimized APIs

📊 **Real-Time Progress Tracking**
- Live download progress updates
- Visual progress bar with animations
- Job status monitoring
- Automatic polling every 1.5 seconds

🚀 **Seamless Flow**
- URL validation
- Preview confirmation
- Download initiation
- Progress tracking
- Video completion

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern design system with CSS variables
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - RESTful API communication

## File Structure

```
frontend/
├── index.html          # Home page (URL input & preview)
├── progress.html       # Progress tracking page
├── styles.css          # Design system & styles
├── app.js             # Home page logic
├── progress.js        # Progress page logic
└── README.md          # This file
```

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000/api/v1`

### Endpoints Used:

1. **GET /preview/** - Fetch video metadata
2. **POST /jobs/** - Create download job
3. **GET /jobs/{job_id}** - Poll job status

## Setup & Usage

### Prerequisites

- Backend server running on `http://localhost:8000`
- Redis server running
- Modern web browser

### Running the Frontend

#### Option 1: Python HTTP Server (Recommended)

```bash
cd frontend
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

#### Option 2: Using Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

#### Option 3: Direct File Access

Simply open `index.html` in your browser (CORS may need to be disabled)

### User Flow

1. **Enter YouTube URL**
   - Paste any valid YouTube video URL
   - Click "Get Preview"

2. **Review Preview**
   - See video thumbnail, title, and duration
   - Click "Start Download" to proceed

3. **Track Progress**
   - Automatic redirect to progress page
   - Real-time download status updates
   - Progress bar shows completion percentage

4. **Download Complete**
   - Video information displayed
   - File location shown
   - Option to return home

## Configuration

### API Base URL

To change the backend URL, edit both JavaScript files:

**app.js & progress.js**
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### Poll Interval

To adjust progress update frequency:

**progress.js**
```javascript
const POLL_INTERVAL = 1500; // milliseconds
```

## Design System

### Color Palette

- **Primary**: `#667eea` - Purple gradient
- **Success**: `#11998e` - Teal gradient
- **Danger**: `#eb3349` - Red gradient
- **Background**: `#0f0f23` - Dark navy

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800

### Animations

- Fade In / Slide Up on page load
- Floating logo animation
- Progress bar shimmer effect
- Button ripple effects
- Background pulse animation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Known Limitations

1. **Video Playback**: Currently shows file path instead of playing video in browser (backend needs file serving endpoint improvement)
2. **Job Cancellation**: No cancel/stop button implemented yet
3. **History**: No download history persistence

## Future Enhancements

- [ ] WebSocket support for real-time updates (eliminate polling)
- [ ] Video playback in browser
- [ ] Download history with local storage
- [ ] Bulk download support
- [ ] Quality selection before download
- [ ] Dark/Light theme toggle
- [ ] Mobile app (PWA)

## Troubleshooting

### CORS Errors

Make sure the backend has CORS middleware enabled:

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Failed

1. Verify backend is running: `http://localhost:8000`
2. Check Redis is running: `redis-cli ping`
3. Ensure no firewall blocking requests

### Preview Not Loading

1. Check URL is valid YouTube link
2. Verify internet connection
3. Check browser console for errors

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

## License

MIT License - Feel free to use for any purpose.

---

**Built with ❤️ for AI-VIRALCLIPS**
