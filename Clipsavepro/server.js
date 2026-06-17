const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Post endpoint using your exact logic structure
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.json({ success: false, error: 'URL is required' });
    }

    const platform = detectPlatform(url);

    if (platform === 'YouTube') {
        try {
            console.log('Native Node Scraper pulling YouTube Video:', url);
            
            // Get comprehensive video details directly from YouTube network
            const info = await ytdl.getInfo(url);
            
            // Auto select highest available format with both video and audio
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });

            if (format && format.url) {
                return res.json({
                    success: true,
                    downloadUrl: format.url,
                    platform: 'YouTube'
                });
            } else {
                return res.json({
                    success: false,
                    error: 'Could not find a valid stream URL. Please try another link.'
                });
            }
        } catch (error) {
            console.error('YTDL Core Error:', error.message);
            return res.json({
                success: false,
                error: 'Server connection is tight. Please click download again.'
            });
        }
    } else if (platform === 'Unknown') {
        return res.json({
            success: false,
            error: 'Unsupported platform link format.'
        });
    } else {
        // Your strategic choice to show 'Coming Soon' notice for other platforms
        return res.json({
            success: false,
            isComingSoon: true,
            error: ⚠️ এই ${platform} ফিচারটি খুব শীঘ্রই যুক্ত করা হচ্ছে! আপাতত আপনি আনলিমিটেড ইউটিউব ভিডিও ডাউনলোড করতে পারবেন।
        });
    }
});

// Your exact platform checker structure
function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    return 'Unknown';
}

app.listen(PORT, () => {
    console.log(ClipSavePro Native Engine Active on port ${PORT});
});
