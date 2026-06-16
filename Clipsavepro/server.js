const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/download', async (req, res) => {
    const { url, platform } = req.body;
    
    if (!url) {
        return res.json({ success: false, error: 'Please enter a valid URL' });
    }
    
    try {
        let detectedPlatform = platform;
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            detectedPlatform = 'youtube';
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            detectedPlatform = 'facebook';
        } else if (url.includes('instagram.com')) {
            detectedPlatform = 'instagram';
        } else if (url.includes('tiktok.com')) {
            detectedPlatform = 'tiktok';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            detectedPlatform = 'twitter';
        }
        
        if (detectedPlatform === 'youtube') {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
            
            res.json({
                success: true,
                downloadUrl: format.url,
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                platform: 'YouTube'
            });
        } else {
            res.json({
                success: false,
                error: `${detectedPlatform || 'This'} platform download will be available soon. Stay tuned!`
            });
        }
    } catch (error) {
        res.json({ success: false, error: 'Invalid URL or video not accessible' });
    }
});

app.listen(PORT, () => {
    console.log(`ClipSavePro running on port ${PORT}`);
});