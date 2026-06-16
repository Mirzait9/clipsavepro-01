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
                const data = await response.json();

                loader.style.display = 'none';
                console.log("Response Data Received:", data);

                // Dynamically parsing links or secondary fields directly from the provider
                let downloadLink = "";
                if (data && data.links && data.links.length > 0) {
                    downloadLink = data.links[0].url;
                } else if (data && data.url) {
                    downloadLink = data.url;
                } else if (data && data.urls && data.urls.length > 0) {
                    downloadLink = data.urls[0];
                }

                if (downloadLink) {
                    resultDiv.innerHTML = '<p style="margin-bottom: 12px; font-weight: bold; color: #28a745; font-size: 1.1rem;">Video Ready to Download!</p><a href="' + downloadLink + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #28a745; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold;">Click Here to Save Video</a>';
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = data.message || 'Invalid link or video not supported. Please try another link.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                loader.style.display = 'none';
                errorDiv.innerText = 'Server error. Please try again later.';
                errorDiv.style.display = 'block';
            } finally {
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
