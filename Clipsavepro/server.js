const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dedicated YouTube Download Endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        return res.json({ 
            success: false, 
            message: 'This downloader currently only supports YouTube videos and shorts.' 
        });
    }

    try {
        console.log('Processing YouTube URL:', videoUrl);
        
        // Alternative Stable YouTube API Gateway
        const ytApiUrl = 'https://api.vkrhost.erias.io/api/download?url=' + encodeURIComponent(videoUrl);
        
        const apiResponse = await axios.get(ytApiUrl, { timeout: 10000 });
        const data = apiResponse.data;

        let downloadLink = "";

        // Flexible parsing logic to extract video url
        if (data) {
            if (data.data && data.data.url) {
                downloadLink = data.data.url;
            } else if (data.data && data.data.downloads && data.data.downloads.length > 0) {
                downloadLink = data.data.downloads[0].url;
            } else if (data.url) {
                downloadLink = data.url;
            } else if (data.links && data.links.length > 0) {
                downloadLink = data.links[0].url;
            }
        }

        if (downloadLink && downloadLink.startsWith('http')) {
            return res.json({ success: true, url: downloadLink });
        } else {
            return res.json({ 
                success: false, 
                message: 'Could not fetch download links. Please ensure the video is public and try another link.' 
            });
        }

    } catch (error) {
        console.error('YouTube Engine Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Connection timed out. Please click the download button again.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro YouTube Engine Active on port ' + PORT);
});
