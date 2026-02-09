// ==========================================================================
// AI-VIRALCLIPS - Progress Page
// ==========================================================================

const API_BASE_URL = 'http://localhost:8000/api/v1';
const POLL_INTERVAL = 1500; // Poll every 1.5 seconds

// ==========================================================================
// DOM Elements
// ==========================================================================

const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const progressPercent = document.getElementById('progressPercent');
const etaText = document.getElementById('etaText');
const jobIdDisplay = document.getElementById('jobIdDisplay');
const statusValue = document.getElementById('statusValue');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const videoInfo = document.getElementById('videoInfo');
const errorSection = document.getElementById('errorSection');
const errorMessageEl = document.getElementById('errorMessage');
const backToHomeBtn = document.getElementById('backToHomeBtn');

let pollInterval = null;
let currentJobData = null;

// ==========================================================================
// Utility Functions
// ==========================================================================

function formatProgress(progress) {
    // Handle different progress formats
    if (typeof progress === 'string') {
        // Already a percentage string like "45.2%"
        return progress;
    } else if (typeof progress === 'number') {
        // Convert number to percentage
        return `${progress}%`;
    }
    return '0%';
}

function parseProgress(progress) {
    // Extract numeric value from progress
    if (typeof progress === 'string') {
        return parseFloat(progress.replace('%', '')) || 0;
    } else if (typeof progress === 'number') {
        return progress;
    }
    return 0;
}

function getStatusColor(status) {
    const statusColors = {
        'queued': '#667eea',
        'in_progress': '#667eea',
        'downloading': '#11998e',
        'processing_video': '#f093fb',
        'completed': '#38ef7d',
        'failed': '#eb3349'
    };
    return statusColors[status] || '#667eea';
}

function getStatusMessage(status) {
    const statusMessages = {
        'queued': 'Job queued, waiting to start...',
        'in_progress': 'Processing your request...',
        'downloading': 'Downloading video...',
        'processing_video': 'Processing video file...',
        'completed': 'Download completed successfully!',
        'failed': 'Download failed'
    };
    return statusMessages[status] || 'Processing...';
}

// ==========================================================================
// API Functions
// ==========================================================================

async function getJobStatus(jobId) {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch job status');
    }

    return await response.json();
}

// ==========================================================================
// UI Update Functions
// ==========================================================================

function updateProgressUI(jobStatus) {
    const status = jobStatus.status;
    const progress = jobStatus.progress;

    // Update status badge
    statusText.textContent = getStatusMessage(status);
    const statusColor = getStatusColor(status);
    statusBadge.style.borderColor = statusColor;
    statusBadge.querySelector('.pulse-dot').style.background = statusColor;

    // Update progress bar
    const progressValue = parseProgress(progress);
    progressBarFill.style.width = `${progressValue}%`;
    progressPercent.textContent = formatProgress(progress);

    // Update status value
    statusValue.textContent = status.replace('_', ' ').toUpperCase();

    // Update ETA if available
    if (jobStatus.eta) {
        etaText.textContent = `ETA: ${jobStatus.eta}s`;
    } else {
        etaText.textContent = '';
    }
}

function showVideoPlayer(jobStatus) {
    // Stop polling
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }

    // Hide status badge pulse
    statusBadge.querySelector('.pulse-dot').style.animation = 'none';

    // Update final UI
    updateProgressUI(jobStatus);

    // Show video section
    videoSection.classList.remove('hidden');

    // Get file path and construct video URL
    const filePath = jobStatus.file_path || jobStatus.result;

    console.log('File path from API:', filePath); // Debug log

    if (filePath) {
        // Extract filename from path (e.g., "downloads/job_id_title.mp4" -> "job_id_title.mp4")
        const fileName = filePath.split('/').pop();

        console.log('Extracted filename:', fileName); // Debug log

        // Construct video URL - backend serves downloads at /downloads/
        const videoUrl = `${API_BASE_URL.replace('/api/v1', '')}/downloads/${encodeURIComponent(fileName)}`;

        console.log('Video URL:', videoUrl); // Debug log

        // Set video source and show player
        videoPlayer.src = videoUrl;
        videoPlayer.style.display = 'block';

        // Add play button functionality
        const playButton = document.getElementById('playButton');
        const videoOverlay = document.getElementById('videoOverlay');
        const videoContainer = document.getElementById('videoContainer');

        if (playButton && videoOverlay) {
            // Play video when play button is clicked
            playButton.addEventListener('click', () => {
                videoPlayer.play();
                videoOverlay.classList.add('hidden-overlay');
                videoPlayer.setAttribute('controls', 'controls'); // Show native controls when playing
            });

            // Also allow clicking anywhere on the overlay to play
            videoOverlay.addEventListener('click', (e) => {
                if (e.target === videoOverlay) {
                    videoPlayer.play();
                    videoOverlay.classList.add('hidden-overlay');
                    videoPlayer.setAttribute('controls', 'controls');
                }
            });

            // Show overlay again when video is paused
            videoPlayer.addEventListener('pause', () => {
                if (!videoPlayer.ended) {
                    videoOverlay.classList.remove('hidden-overlay');
                }
            });

            // Hide overlay when video is playing
            videoPlayer.addEventListener('play', () => {
                videoOverlay.classList.add('hidden-overlay');
            });

            // Show message when video ends
            videoPlayer.addEventListener('ended', () => {
                videoOverlay.classList.remove('hidden-overlay');
            });
        }

        // Update video info
        videoInfo.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Video Title:</span>
                <span class="detail-value">${currentJobData?.videoTitle || 'Downloaded Video'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">File Name:</span>
                <span class="detail-value">${fileName}</span>
            </div>
            <p style="margin-top: 1rem; color: var(--success-color); font-size: 0.9rem; text-align: center;">
                ✅ Download completed! Watch above or download the file.
            </p>
        `;

        // Add download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = videoUrl;
        downloadBtn.download = fileName;
        downloadBtn.className = 'btn btn-success';
        downloadBtn.style.marginTop = '1rem';
        downloadBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Download Video File</span>
        `;
        videoInfo.appendChild(downloadBtn);
    } else {
        videoPlayer.style.display = 'none';
        videoInfo.innerHTML = `
            <p style="color: var(--text-secondary); text-align: center;">
                Download completed! Check your server's downloads directory.
            </p>
        `;
    }
}

function showError(errorMsg) {
    // Stop polling
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }

    // Hide status badge pulse
    statusBadge.querySelector('.pulse-dot').style.animation = 'none';

    // Show error section
    errorSection.classList.remove('hidden');
    errorMessageEl.textContent = errorMsg || 'An unknown error occurred during download.';

    // Update status badge
    statusBadge.style.borderColor = '#eb3349';
    statusBadge.querySelector('.pulse-dot').style.background = '#eb3349';
    statusText.textContent = 'Download Failed';
}

// ==========================================================================
// Polling Function
// ==========================================================================

async function pollJobStatus() {
    if (!currentJobData || !currentJobData.jobId) {
        showError('No job ID found. Please start a new download.');
        return;
    }

    try {
        const jobStatus = await getJobStatus(currentJobData.jobId);

        console.log('Job status:', jobStatus); // Debug log

        // Update UI with current status
        updateProgressUI(jobStatus);

        // Check job status
        if (jobStatus.status === 'completed') {
            showVideoPlayer(jobStatus);
        } else if (jobStatus.status === 'failed') {
            showError(jobStatus.error);
        }
        // Otherwise, continue polling

    } catch (error) {
        console.error('Error polling job status:', error);
        showError('Failed to fetch job status. The server may be unavailable.');
    }
}

// ==========================================================================
// Event Handlers
// ==========================================================================

backToHomeBtn.addEventListener('click', () => {
    // Clear polling
    if (pollInterval) {
        clearInterval(pollInterval);
    }

    // Clear session storage
    sessionStorage.removeItem('currentJob');

    // Redirect to home
    window.location.href = 'index.html';
});

// ==========================================================================
// Initialize
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
    // Get job data from sessionStorage
    const jobDataStr = sessionStorage.getItem('currentJob');

    if (!jobDataStr) {
        showError('No job data found. Please start a new download.');
        return;
    }

    try {
        currentJobData = JSON.parse(jobDataStr);

        // Display job ID
        jobIdDisplay.textContent = currentJobData.jobId;

        // Start polling
        pollJobStatus(); // Call immediately
        pollInterval = setInterval(pollJobStatus, POLL_INTERVAL);

    } catch (error) {
        console.error('Error parsing job data:', error);
        showError('Invalid job data. Please start a new download.');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
});
