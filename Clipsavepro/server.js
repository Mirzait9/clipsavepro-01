const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Universal Secure Downloader Gateway
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        console.log('Universal Engine Processing URL:', videoUrl);
        let downloadLink = "";

        // Premium Global Server Gateway for seamless multi-platform extraction
        const globalGatewayUrl = 'https://api.vkrhost.erias.io/api/download?url=' + encodeURIComponent(videoUrl);
        
        const apiResponse = await axios.get(globalGatewayUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            timeout: 15000 // 15 seconds timeout
        });

        const data = apiResponse.data;

        // Multi-layered parsing algorithm to catch FB, Instagram & YouTube structures
        if (data) {
            if (data.data) {
                if (data.data.url) {
                    downloadLink = data.data.url;
                } else if (data.data.downloads && data.data.downloads.length > 0) {
                    downloadLink = data.data.downloads[0].url;
                } else if (data.data.medias && data.data.medias.length > 0) {
                    downloadLink = data.data.medias[0].url;
                }
            } else if (data.url) {
                downloadLink = data.url;
            } else if (data.links && data.links.length > 0) {
                downloadLink = data.links[0].url;
            } else if (data.urls && data.urls.length > 0) {
                downloadLink = data.urls[0];
            }
        }

        // Validate extracted link before sending to user
        if (downloadLink && downloadLink.startsWith('http')) {
            return res.json({ success: true, url: downloadLink });
        } else {
            return res.json({ 
                success: false, 
                message: 'This video format is highly encrypted or private. Please try another public link.' 
            });
        }

    } catch (error) {
        console.error('Universal Engine Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Network is busy or connection timed out. Please try clicking the button again.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro All-In-One Universal Engine running on port ' + PORT);
});
