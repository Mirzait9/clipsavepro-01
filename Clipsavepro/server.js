const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIXED: Using your exact RapidAPI Key directly with clean formatting
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'bf2de52a0bmsh7f39bca2349bd1cp1597f8jsn38011c7455f5';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to extract YouTube Video ID
function extractYouTubeId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Function to detect social media platform
function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return null;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================
// YOUTUBE DOWNLOADER
// =====================
async function downloadYouTube(videoId) {
    const options = {
        method: 'GET',
        url: https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId},
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const data = response.data;

    let downloadUrl = '';
    let title = data.title || 'YouTube Video';

    if (data && data.link) {
        const qualities = ['720p', '480p', '360p', '240p', '144p'];
        for (const q of qualities) {
            if (data.link[q]) {
                const entry = Array.isArray(data.link[q]) ? data.link[q][0] : data.link[q];
                downloadUrl = entry?.url || entry;
                if (downloadUrl) break;
            }
        }
    }

    if (!downloadUrl && data.formats && data.formats.length > 0) {
        const fmt = data.formats.find(f => f.url);
        if (fmt) downloadUrl = fmt.url;
    }

    return { downloadUrl, title };
}

// =====================
// INSTAGRAM DOWNLOADER
// =====================
async function downloadInstagram(url) {
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
        params: { url: url },
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const data = response.data;

    let downloadUrl = '';
    let title = 'Instagram Video';

    if (data && data.media) {
        downloadUrl = data.media;
    } else if (data && data.url) {
        downloadUrl = data.url;
    } else if (Array.isArray(data) && data[0]?.url) {
        downloadUrl = data[0].url;
    }

    return { downloadUrl, title };
}

// =====================
// TIKTOK DOWNLOADER
// =====================
async function downloadTikTok(url) {
    const options = {
        method: 'GET',
        url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index',
        params: { url: url },
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const data = response.data;

    let downloadUrl = '';
    let title = 'TikTok Video';

    if (data && data.video && data.video.length > 0) {
        downloadUrl = data.video[0];
    } else if (data && data.url) {
        downloadUrl = data.url;
    }

    return { downloadUrl, title };
}

// =====================
// FACEBOOK DOWNLOADER
// =====================
async function downloadFacebook(url) {
    const options = {
        method: 'GET',
        url: 'https://facebook-video-downloader6.p.rapidapi.com/fb',
        params: { url: url },
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'facebook-video-downloader6.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const data = response.data;

    let downloadUrl = '';
    let title = 'Facebook Video';

    if (data && data.hd) {
        downloadUrl = data.hd;
    } else if (data && data.sd) {
        downloadUrl = data.sd;
    } else if (data && data.url) {
        downloadUrl = data.url;
    }

    return { downloadUrl, title };
}

// =====================
// MAIN API ENDPOINT
// =====================
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.json({ success: false, error: 'URL is required' });
    }

    const platform = detectPlatform(url);

    if (!platform) {
        return res.json({
            success: false,
            error: 'Unsupported platform. Only YouTube, Instagram, TikTok, and Facebook are supported.'
        });
    }

    try {
        let result = { downloadUrl: '', title: '' };

        if (platform === 'youtube') {
            const videoId = extractYouTubeId(url);
            if (!videoId) {
                return res.json({ success: false, error: 'Invalid YouTube link!' });
            }
            result = await downloadYouTube(videoId);
        } else if (platform === 'instagram') {
            result = await downloadInstagram(url);
        } else if (platform === 'tiktok') {
            result = await downloadTikTok(url);
        } else if (platform === 'facebook') {
            result = await downloadFacebook(url);
        }

        if (result.downloadUrl) {
            return res.json({
                success: true,
                downloadUrl: result.downloadUrl,
                title: result.title,
                platform: platform
            });
        } else {
            return res.json({
                success: false,
                error: 'Download link not found. Please ensure the video is public.'
            });
        }

    } catch (error) {
        console.error([${platform.toUpperCase()}] Error:, error.message);

        if (error.response && error.response.status === 403) {
            return res.json({ success: false, error: 'API Key issue. Please verify credentials.' });
        }
        if (error.response && error.response.status === 429) {
            return res.json({ success: false, error: 'API rate limit reached. Try again later.' });
        }

        return res.json({ success: false, error: 'Internal server error. Please retry.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(✅ ClipSavePro is active on Port: ${PORT});
});
