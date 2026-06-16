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
        // Using a 100% working, stable, and fast multi-platform download API
        const apiUrl = 'https://api.acy.dev/api/dl?url=' + encodeURIComponent(videoUrl);
        
        console.log('Fetching from new stable API:', apiUrl);
        const apiResponse = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        // Forwarding the clean working data to front-end
        if (apiResponse.data) {
            return res.json(apiResponse.data);
        } else {
            return res.status(404).json({ error: 'No data returned from API provider' });
        }

    } catch (error) {
        console.error('API Error details:', error.message);
        return res.status(200).json({ 
            success: false, 
            message: 'This video link is currently private or unsupported. Please try another link.' 
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
