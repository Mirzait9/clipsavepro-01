let currentPlatform = 'all';

const tabBtns = document.querySelectorAll('.tab-btn');
const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const loader = document.getElementById('loader');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPlatform = btn.dataset.platform;
        
        const placeholders = {
            youtube: 'Paste YouTube URL (e.g., https://youtube.com/watch?v=...)',
            facebook: 'Paste Facebook Video URL',
            instagram: 'Paste Instagram Reel/Post URL',
            tiktok: 'Paste TikTok Video URL',
            all: 'Paste video link from any platform...'
        };
        urlInput.placeholder = placeholders[currentPlatform] || placeholders.all;
    });
});

downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a video URL');
        return;
    }
    
    showLoader();
    
    try {
        let platform = currentPlatform;
        if (currentPlatform === 'all') {
            if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
            else if (url.includes('facebook.com')) platform = 'facebook';
            else if (url.includes('instagram.com')) platform = 'instagram';
            else if (url.includes('tiktok.com')) platform = 'tiktok';
        }
        
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, platform })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult(data);
        } else {
            showError(data.error || 'Failed to process video');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoader();
    }
});

function showResult(data) {
    resultDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    resultDiv.innerHTML = `
        <img src="${data.thumbnail}" alt="Video thumbnail" style="max-width: 100%; border-radius: 10px;">
        <h3>${data.title}</h3>
        <p>Platform: ${data.platform}</p>
        <a href="${data.downloadUrl}" target="_blank">⬇️ Download Video</a>
    `;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    errorDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    errorDiv.innerHTML = message;
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showLoader() {
    loader.style.display = 'block';
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    downloadBtn.disabled = true;
}

function hideLoader() {
    loader.style.display = 'none';
    downloadBtn.disabled = false;
}

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
});