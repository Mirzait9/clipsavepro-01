const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Route for video downloading
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        const targetUrl = 'https://api.allinone-downloader.com/v1/download?url=' + encodeURIComponent(videoUrl);
        const apiResponse = await axios.get(targetUrl);
        res.json(apiResponse.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'API Error' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Server is running perfectly.');
});
