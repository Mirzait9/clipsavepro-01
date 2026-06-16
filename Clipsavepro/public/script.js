document.addEventListener('DOMContentLoaded', () => {
    // Select elements using general selectors to avoid class mismatch
    const downloadBtn = document.querySelector('button') || document.querySelector('.download-btn') || document.getElementById('downloadBtn'); 
    const urlInput = document.querySelector('input[type="text"]') || document.querySelector('.url-input') || document.getElementById('urlInput'); 
    const platformTabs = document.querySelectorAll('.platform-tab') || document.querySelectorAll('ul li') || document.querySelectorAll('.tabs span');

    // 1. Tab selection functionality (Fix for tabs not selecting)
    if (platformTabs.length > 0) {
        platformTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                platformTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
            });
        });
    }

    // 2. Download functionality (Fix for button click reaction)
    if (downloadBtn && urlInput) {
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const videoUrl = urlInput.value.trim();
            if (!videoUrl) {
                alert('Please enter a valid video link!');
                return;
            }

            // UI Feedback on click
            const originalText = downloadBtn.innerText;
            downloadBtn.innerText = 'Processing...';
            downloadBtn.disabled = true;

            try {
                // Fetching video data directly from the free API
                const response = await fetch(https://api.allinone-downloader.com/v1/download?url=${encodeURIComponent(videoUrl)});
                const data = await response.json();

                if (data && data.links && data.links.length > 0) {
                    const downloadLink = data.links[0].url;
                    // Open download link in a new window/tab
                    window.open(downloadLink, '_blank');
                } else {
                    alert('Invalid link or video not found on the server.');
                }
            } catch (error) {
                console.error(error);
                alert('Error fetching video. Please try again.');
            } finally {
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
            }
        });
    } else {
        console.error('Download button or input field not found in HTML.');
    }
});
