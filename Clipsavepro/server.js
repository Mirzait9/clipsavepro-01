const express = require('express');
const cors = require('cors');
const path = require('path');
const instagramGetUrl = require('instagram-url-direct');
const fbDownloader = require('fb-downloader-scrapper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Core Self-Hosted Download Endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        console.log('Processing request for URL:', videoUrl);
        let downloadLink = "";

        // 1. Handling Instagram Links
        if (videoUrl.includes('instagram.com')) {
            const fbResult = await instagramGetUrl(videoUrl);
            if (fbResult && fbResult.url_list && fbResult.url_list.length > 0) {
                downloadLink = fbResult.url_list[0];
            }
        } 
        // 2. Handling Facebook Links
        else if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
            const fbData = await fbDownloader(videoUrl);
            if (fbData && fbData.hd) {
                downloadLink = fbData.hd;
            } else if (fbData && fbData.sd) {
                downloadLink = fbData.sd;
            }
        } 
        // 3. Fallback/Alternative directly from URL if it's already a clean media link
        else if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
            downloadLink = videoUrl;
        }

        // If our self-hosted engine successfully extracts the link
        if (downloadLink) {
            return res.json({ success: true, url: downloadLink });
        } else {
            // If the link is highly encrypted or private, we gracefully notify the user
            return res.json({ 
                success: false, 
                message: 'Could not extract media data. Please ensure it is a public video link.' 
            });
        }

    } catch (error) {
        console.error('Server Engine Error:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Server processed the request but encountered an extraction issue. Please try another link.' 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('ClipSavePro Self-Hosted Engine running on port ' + PORT);
});
