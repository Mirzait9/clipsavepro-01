function initClipSavePro() {
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Tab Navigation
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

    // Download Action
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

                if (data && data.success && data.url) {
                    resultDiv.innerHTML = '<p style="margin-bottom: 12px; font-weight: bold; color: #28a745; font-size: 1.1rem;">Video Ready to Download!</p><a href="' + data.url + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #28a745; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold;">Click Here to Save Video</a>';
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = data.message || 'Unsupported video link or private content. Please try another link.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                loader.style.display = 'none';
                errorDiv.innerText = 'System processing error. Please try again.';
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
