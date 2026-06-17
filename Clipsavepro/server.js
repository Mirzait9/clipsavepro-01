const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to extract YouTube Video ID from any long/short YouTube URL
function extractVideoId(url) {
    const regExp = /^.(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Post endpoint connecting with your RapidAPI
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.json({ success: false, error: 'URL is required' });
    }

    // Checking if it's a YouTube link
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.json({ 
            success: false, 
            error: 'This downloader currently only supports YouTube videos and shorts.' 
        });
    }

    // Extracting the clean 11-character video ID
    const videoId = extractVideoId(url);

    if (!videoId) {
        return res.json({ success: false, error: 'Invalid YouTube link structure. Could not find Video ID.' });
    }

    try {
        console.log('Fetching stream from RapidAPI for Video ID:', videoId);

        // Making the secure GET request to YTStream API exactly matching your screen specs
        const options = {
            method: 'GET',
            url: https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId},
            headers: {
                'X-RapidAPI-Key': 'bf2de57a0bmsh7f39bca2349bd1cp1597f8jsn35071c7455f5',
                'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
            }
        };

        const apiResponse = await axios.request(options);
        const data = apiResponse.data;

        let finalDownloadUrl = "";

        // Smart dynamic parsing for YTStream response object
        if (data) {
            if (data.link && data.link['360p']) {
                finalDownloadUrl = data.link['360p'][0]?.url || data.link['360p'].url;
            } else if (data.link && data.link['720p']) {
                finalDownloadUrl = data.link['720p'][0]?.url || data.link['720p'].url;
            } else if (data.formats && data.formats.length > 0) {
                // Fallback to formats array if direct quality object is different
                const secureFormat = data.formats.find(f => f.url);
                if (secureFormat) finalDownloadUrl = secureFormat.url;
            }
        }

        if (finalDownloadUrl) {
            return res.json({
                success: true,
                downloadUrl: finalDownloadUrl,
                title: data.title || 'YouTube Video'
            });
        } else {
            return res.json({
                success: false,
                error: 'Could not fetch download links from API. Ensure the video is public.'
            });
        }

    } catch (error) {
        console.error('RapidAPI Execution Failure:', error.message);
        return res.json({
            success: false,
            error: 'The API server did not respond. Please click the button again.'
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(ClipSavePro RapidAPI Engine running on port ${PORT});
});
