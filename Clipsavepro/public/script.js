// Ensuring everything runs safely after the DOM is fully loaded
window.addEventListener('load', () => {
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // 1. Super Solid Tab Selection Feature (Directly targeting button tags)
    const platformTabs = document.querySelectorAll('.platform-tabs button');
    
    if (platformTabs && platformTabs.length > 0) {
        platformTabs.forEach(tab => {
            // Using standard click with high priority
            tab.onclick = function(e) {
                e.preventDefault();
                // Remove active class from all peer buttons
                platformTabs.forEach(t => t.classList.remove('active'));
                // Add active class to this clicked button
                this.classList.add('active');
                console.log("Active Platform:", this.getAttribute('data-platform'));
            };
        });
    }

    // 2. Core Download Action
    if (downloadBtn && urlInput) {
        const handleDownload = async (e) => {
            if (e) e.preventDefault();
            const videoUrl = urlInput.value.trim();
            
            // Reset fields
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            errorDiv.innerHTML = '';

            if (!videoUrl) {
                alert('Please enter a valid video link!');
                return;
            }

            // Show loading
            loader.style.display = 'block';
            downloadBtn.disabled = true;
            downloadBtn.innerText = 'Processing...';

            try {
                // Calling your working Node backend
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
                errorDiv.innerText = 'Server error or timeout. Please try again.';
                errorDiv.style.display = 'block';
            } finally {
                downloadBtn.disabled = false;
                downloadBtn.innerText = 'Download Video';
            }
        };

        // Attach direct actions to main download button
        downloadBtn.onclick = handleDownload;
        
        urlInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                handleDownload(e);
            }
        };
    }
});
