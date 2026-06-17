const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Standard Stable YouTube Download Endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Strict validation to allow ONLY YouTube links
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        return res.json({ 
            success: false, 
            message: 'This downloader currently only supports YouTube videos and shorts.' 
        });
    }

    try {
        console.log('Axios Processing YouTube URL:', videoUrl);
        
        // Using Cobalt premium high-speed open network via clean Axios POST
        const queryTarget = 'https://api.cobalt.tools/api/json';
        
        const apiResponse = await axios.post(queryTarget, {
            url: videoUrl,
            videoQuality: '720',
            isAudioOnly: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 12000 // 12 seconds timeout
        });

        const data = apiResponse.data;

        if (data && data.url) {
            return res.json({ success: true, url: data.url });
        } else if (data && data.text) {
            return res.json({ success: false, message: data.text });
        } else {
            return res.json({ 
                success: false, 
                message: 'Extraction failed. Please try clicking the button again with a valid video link.' 
            });
        }

    } catch (error) {
        console.error('Axios Engine Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Server stream is busy. Please try another YouTube video link.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro Pure Axios Engine Active on port ' + PORT);
});
