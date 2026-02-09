// ==========================================================================
// AI-VIRALCLIPS - API Configuration
// ==========================================================================

const API_BASE_URL = 'http://localhost:8000/api/v1';

// ==========================================================================
// DOM Elements
// ==========================================================================

const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const previewBtn = document.getElementById('previewBtn');
const inputSection = document.getElementById('inputSection');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');

let currentVideoUrl = '';
let currentPreviewData = null;

// ==========================================================================
// Utility Functions
// ==========================================================================

function showLoading(message = 'Loading...') {
    loadingOverlay.querySelector('p').textContent = message;
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
}

// ==========================================================================
// API Functions
// ==========================================================================

async function validateUrl(url) {
    const response = await fetch(`${API_BASE_URL}/validate_url/?url=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to validate URL');
    }

    return await response.json();
}

async function getVideoPreview(url) {
    const response = await fetch(`${API_BASE_URL}/preview/?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
        throw new Error('Failed to fetch video preview');
    }

    const data = await response.json();

    if (!data.preview || !data.preview.valid) {
        throw new Error('Invalid video URL or video not found');
    }

    return data.preview;
}

async function createDownloadJob(url) {
    const response = await fetch(`${API_BASE_URL}/jobs/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            job_type: 'download_vedio',
            payload: {
                url: url
            }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create download job');
    }

    return await response.json();
}

// ==========================================================================
// UI Functions
// ==========================================================================

function showPreview(previewData) {
    const duration = formatDuration(previewData.duration);

    const previewHTML = `
        <div class="video-preview">
            <div class="thumbnail-container">
                <img src="${previewData.thumbnail}" alt="${previewData.title}">
                <span class="duration-badge">${duration}</span>
            </div>
            <div class="video-details">
                <h3>${previewData.title}</h3>
                <div class="video-meta">
                    <span>Duration: ${duration}</span>
                    <span>Ready to download</span>
                </div>
            </div>
        </div>
    `;

    previewContent.innerHTML = previewHTML;
    inputSection.classList.add('hidden');
    previewSection.classList.remove('hidden');
}

function hidePreview() {
    previewSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    urlInput.value = '';
    currentVideoUrl = '';
    currentPreviewData = null;
}

// ==========================================================================
// Event Handlers
// ==========================================================================

urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();

    // Client-side validation
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }

    if (!isValidYouTubeUrl(url)) {
        showError('Please enter a valid YouTube URL');
        return;
    }

    currentVideoUrl = url;

    try {
        showLoading('Fetching video preview...');

        // Get video preview
        const previewData = await getVideoPreview(url);
        currentPreviewData = previewData;

        hideLoading();
        showPreview(previewData);

    } catch (error) {
        hideLoading();
        showError(error.message || 'Failed to fetch video preview. Please check the URL and try again.');
        console.error('Error:', error);
    }
});

backBtn.addEventListener('click', () => {
    hidePreview();
});

downloadBtn.addEventListener('click', async () => {
    if (!currentVideoUrl) {
        showError('No video URL available');
        return;
    }

    try {
        showLoading('Starting download...');

        // Create download job
        const jobData = await createDownloadJob(currentVideoUrl);

        hideLoading();

        // Store job data in sessionStorage and redirect to progress page
        sessionStorage.setItem('currentJob', JSON.stringify({
            jobId: jobData.job_id,
            videoTitle: currentPreviewData?.title || 'Video',
            videoUrl: currentVideoUrl
        }));

        // Redirect to progress page
        window.location.href = 'progress.html';

    } catch (error) {
        hideLoading();
        showError(error.message || 'Failed to start download. Please try again.');
        console.error('Error:', error);
    }
});

// ==========================================================================
// Initialize
// ==========================================================================

// Focus on input field when page loads
window.addEventListener('DOMContentLoaded', () => {
    urlInput.focus();
});

// Handle Enter key in input field
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        urlForm.dispatchEvent(new Event('submit'));
    }
});
