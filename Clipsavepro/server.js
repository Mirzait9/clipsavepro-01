const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint for video download
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // FIXED: Perfect string with correct closing brackets
        const apiResponse = await axios.get(https://api.allinone-downloader.com/v1/download?url=${encodeURIComponent(videoUrl)});
        
        // Send the data back to the frontend
        res.json(apiResponse.data);
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch video data from external API' });
    }
});

// Fallback to serve index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(Server is running perfectly on port ${PORT});
});
