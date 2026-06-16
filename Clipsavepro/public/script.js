function initClipSavePro() {
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // 1. Tab Selection Feature
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('tab-btn')) {
            e.preventDefault();
            const platformTabs = document.querySelectorAll('.tab-btn');
            platformTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    });

    // Helper function to find any URL recursively in the API response
    function findDownloadUrl(obj) {
        if (!obj || typeof obj !== 'object') return null;
        
        // Priority direct matching keys from various video APIs
        const primaryKeys = ['url', 'download', 'link', 'downloadUrl', 'videoUrl', 'src'];
        for (let key of primaryKeys) {
            if (obj[key] && typeof obj[key] === 'string' && obj[key].startsWith('http')) {
                return obj[key];
            }
        }

        // Loop through all properties to find nested objects or arrays
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                const found = findDownloadUrl(obj[key]);
                if (found) return found;
            } else if (typeof obj[key] === 'string' && obj[key].startsWith('http')) {
                // Ignore tracking, website, or thumb links if possible, but keep as fallback
                if (!key.toLowerCase().includes('thumb') && !key.toLowerCase().includes('avatar') && !key.toLowerCase().includes('author')) {
                    return obj[key];
                }
            }
        }
        return null;
    }

    // 2. Core Download Action
    if (downloadBtn && urlInput) {
        const handleDownload = async function(e) {
            if (e) e.preventDefault();
            const videoUrl = urlInput.value.trim();
            
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            errorDiv.innerHTML = '';

            if (!videoUrl) {
                alert('Please enter a valid video link!');
                return;
            }

            loader.style.display = 'block';
            downloadBtn.disabled = true;
            downloadBtn.innerText = 'Processing...';

            try {
                const targetUrl = '/api/download?url=' + encodeURIComponent(videoUrl);
                const response = await fetch(targetUrl);
                
                // Safe JSON compilation to avoid "undefined" SyntaxError
                const data = await response.json();
                console.log("Response Data Content:", data);

                // Run the automatic link scanner
                const downloadLink = findDownloadUrl(data);

                if (downloadLink) {
                    resultDiv.innerHTML = '<p style="margin-bottom: 12px; font-weight: bold; color: #28a745; font-size: 1.1rem;">Video Ready to Download!</p><a href="' + downloadLink + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #28a745; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold;">Click Here to Save Video</a>';
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = 'Unsupported video structure or link expired. Please try another link.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error("Frontend handling error:", error);
                loader.style.display = 'none';
                errorDiv.innerText = 'Server processing error. Please try again.';
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
