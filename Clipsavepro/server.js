const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint for Video Download
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Safe and clean API URL formulation
        const baseApi = 'https://api.allinone-downloader.com/v1/download';
        const finalUrl = baseApi + '?url=' + encodeURIComponent(videoUrl);
        
        const apiResponse = await axios.get(finalUrl);
        res.json(apiResponse.data);
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch video data from backend API' });
    }
});

// Fallback to serve index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log('Server is running perfectly on port ' + PORT);
});
