const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dedicated YouTube Video & Shorts Download Endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Strict validation to ensure only YouTube links are processed for now
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        return res.json({ 
            success: false, 
            message: 'This downloader currently only supports YouTube videos and shorts.' 
        });
    }

    try {
        console.log('Processing Dedicated YouTube URL:', videoUrl);
        
        // Fast, isolated open-source gateway specifically for YouTube structure
        const ytApiUrl = 'https://api.vkrhost.erias.io/api/download?url=' + encodeURIComponent(videoUrl);
        const apiResponse = await axios.get(ytApiUrl);
        const data = apiResponse.data;

        let downloadLink = "";

        if (data && data.data) {
            if (data.data.url) {
                downloadLink = data.data.url;
            } else if (data.data.downloads && data.data.downloads.length > 0) {
                downloadLink = data.data.downloads[0].url;
            } else if (data.data.medias && data.data.medias.length > 0) {
                downloadLink = data.data.medias[0].url;
            }
        } else if (data && data.url) {
            downloadLink = data.url;
        }

        if (downloadLink) {
            return res.json({ success: true, url: downloadLink });
        } else {
            return res.json({ 
                success: false, 
                message: 'Could not fetch download links for this YouTube video. Make sure it is public.' 
            });
        }

    } catch (error) {
        console.error('YouTube Engine Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Server is currently busy. Please click the download button again.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro YouTube Engine Running Perfectly on port ' + PORT);
});
