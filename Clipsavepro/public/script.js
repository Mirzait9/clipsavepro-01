document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const platformTabs = document.querySelectorAll('.tab-btn');
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // 1. Tab Selection Feature
    if (platformTabs.length > 0) {
        platformTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                platformTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                console.log("Selected platform: ", tab.innerText);
            });
        });
    }

    // 2. Core Download Action
    if (downloadBtn && urlInput) {
        const handleDownload = async (e) => {
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
                const response = await fetch(/api/download?url=${encodeURIComponent(videoUrl)});
                const data = await response.json();

                loader.style.display = 'none';

                if (data && data.links && data.links.length > 0) {
                    const downloadLink = data.links[0].url;
                    
                    resultDiv.innerHTML = `
                        <p style="margin-bottom: 12px; font-weight: bold; color: #28a745; font-size: 1.1rem;">Video Ready to Download!</p>
                        <a href="${downloadLink}" target="_blank" rel="noopener noreferrer">Click Here to Save Video</a>
                    `;
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = 'Invalid link or video not found. Please try another link.';
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

        downloadBtn.addEventListener('click', handleDownload);
        
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleDownload(e);
            }
        });
    }
});
