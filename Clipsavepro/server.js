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
        // NEW STABLE & ACTIVE MULTI-DOWNLOADER API
        const apiUrl = 'https://api.vkrhost.erias.io/api/download?url=' + encodeURIComponent(videoUrl);
        
        console.log('Fetching from new active API:', apiUrl);
        const apiResponse = await axios.get(apiUrl);
        
        if (apiResponse.data) {
            return res.json(apiResponse.data);
        } else {
            return res.status(404).json({ error: 'No data returned from API provider' });
        }

    } catch (error) {
        console.error('API Error details:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'Unable to fetch video data. Please ensure the link is public and try again.' 
        });
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
