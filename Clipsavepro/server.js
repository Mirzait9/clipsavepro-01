const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve frontend static files from public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Main API Route for downloading videos
app.post('/api/download', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        // Fetching data from a free downloader API
        const apiResponse = await axios.get(https://api.allinone-downloader.com/v1/download?url=${encodeURIComponent(videoUrl)});
        
        if (apiResponse.data && apiResponse.data.links) {
            return res.json({
                success: true,
                title: apiResponse.data.title || 'Video',
                links: apiResponse.data.links
            });
        } else {
            return res.status(404).json({ success: false, message: 'Video not found or invalid link' });
        }
    } catch (error) {
        console.error('Download Error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error or video not accessible' });
    }
});

// Redirect any other route to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
