function initClipSavePro() {
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Smart Tab & Platform Click Listener
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('tab-btn')) {
            e.preventDefault();
            
            const platformText = e.target.innerText.trim().toLowerCase();
            
            // If user clicks on Facebook, Instagram, TikTok or Twitter
            if (platformText !== 'youtube' && platformText !== 'all platforms') {
                resultDiv.style.display = 'none';
                errorDiv.innerHTML = '<div style="background: rgba(255,193,7,0.1); border: 1px solid #ffc107; color: #ffc107; padding: 12px; border-radius: 8px; font-weight: 500;">⚠️ এই ফিচারটি আপনার জন্য খুব শীঘ্রই যুক্ত করা হচ্ছে! আপাতত আপনি নিচে আনলিমিটেড ইউটিউব ভিডিও ও শর্টস ডাউনলোড করতে পারবেন।</div>';
                errorDiv.style.display = 'block';
                return; // Stop further actions
            }

            // Normal tab toggle behavior for YouTube / All Platforms
            const platformTabs = document.querySelectorAll('.tab-btn');
            platformTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            e.target.classList.add('active');
            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '';
        }
    });

    // YouTube Download Action Handler
    if (downloadBtn && urlInput) {
        const handleDownload = async function(e) {
            if (e) e.preventDefault();
            const videoUrl = urlInput.value.trim();
            
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            errorDiv.innerHTML = '';

            if (!videoUrl) {
                alert('Please enter a valid YouTube video link!');
                return;
            }

            // Client-side quick check if user inputs non-youtube link without selecting tab
            if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
                errorDiv.innerText = 'This site currently only processes YouTube links. Other platforms are coming soon!';
                errorDiv.style.display = 'block';
                return;
            }

            loader.style.display = 'block';
            downloadBtn.disabled = true;
            downloadBtn.innerText = 'Processing YouTube Video...';

            try {
                const targetUrl = '/api/download?url=' + encodeURIComponent(videoUrl);
                const response = await fetch(targetUrl);
                const data = await response.json();

                loader.style.display = 'none';

                if (data && data.success && data.url) {
                    resultDiv.innerHTML = '<p style="margin-bottom: 12px; font-weight: bold; color: #28a745; font-size: 1.1rem;">YouTube Video Ready!</p><a href="' + data.url + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #28a745; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; box-shadow: 0 4px 15px rgba(40,167,69,0.2);">Click Here to Save Video</a>';
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = data.message || 'Error parsing this video. Please try another YouTube link.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                loader.style.display = 'none';
                errorDiv.innerText = 'System connection error. Please click download again.';
                errorDiv.style.display = 'block';
            } finally {
                loader.style.display = 'none';
                downloadBtn.disabled = false;
                downloadBtn.innerText = 'Download Video';
            }
        };

        downloadBtn.onclick = handleDownload;
        
        urlInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                handleDownload(e);
            }
        };
    }
}

initClipSavePro();
document.addEventListener('DOMContentLoaded', initClipSavePro);
window.onload = initClipSavePro;
