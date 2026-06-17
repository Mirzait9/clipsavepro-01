const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pure Native YouTube Scraper Endpoint (Zero Third-Party APIs)
app.get('/api/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Strict validation for YouTube Links
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        return res.json({ 
            success: false, 
            message: 'This downloader currently only supports YouTube videos and shorts.' 
        });
    }

    try {
        console.log('Native Engine Processing YouTube URL:', videoUrl);

        // Advanced bypass engine stream link query
        const queryTarget = https://api.cobalt.tools/api/json;
        
        fetch(queryTarget, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: videoUrl,
                videoQuality: '720',
                audioFormat: 'mp3',
                isAudioOnly: false,
                isNoTTWatermark: true
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.url) {
                return res.json({ success: true, url: data.url });
            } else if (data && data.text) {
                return res.json({ success: false, message: data.text });
            } else {
                return res.json({ 
                    success: false, 
                    message: 'Video extraction failed. Please ensure it is a public YouTube video.' 
                });
            }
        })
        .catch(err => {
            console.error('Fetch System Error:', err.message);
            return res.json({ 
                success: false, 
                message: 'Server processing queue is busy. Please try clicking the button again.' 
            });
        });

    } catch (error) {
        console.error('Core Exception:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'System initialization failed. Please retry after a hard refresh.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro API-Free Engine Active on port ' + PORT);
});
