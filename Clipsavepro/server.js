const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Premium YouTube Download Endpoint with Identity Headers
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
        console.log('Processing Request with Identity Headers:', videoUrl);
        
        const queryTarget = 'https://api.cobalt.tools/api/json';
        
        // Sending simulated browser headers to bypass server blockings
        const apiResponse = await axios.post(queryTarget, {
            url: videoUrl,
            videoQuality: '720',
            isAudioOnly: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Origin': 'https://cobalt.tools',
                'Referer': 'https://cobalt.tools/'
            },
            timeout: 15000 // 15 seconds timeout
        });

        const data = apiResponse.data;

        if (data && data.url) {
            return res.json({ success: true, url: data.url });
        } else if (data && data.text) {
            return res.json({ success: false, message: data.text });
        } else {
            return res.json({ 
                success: false, 
                message: 'Extraction failed. Please try again with a different YouTube link.' 
            });
        }

    } catch (error) {
        console.error('Axios Detailed Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'System is updating data stream. Please click the button again in a moment.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro Browser-Identity Engine Active on port ' + PORT);
});
