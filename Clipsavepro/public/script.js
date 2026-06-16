document.addEventListener('DOMContentLoaded', () => {
    // Correctly targeting elements from your HTML
    const downloadBtn = document.getElementById('downloadBtn'); 
    const urlInput = document.getElementById('urlInput'); 
    const platformTabs = document.querySelectorAll('.tab-btn');
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // 1. Tab selection functionality
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

    // 2. Download functionality
    if (downloadBtn && urlInput) {
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const videoUrl = urlInput.value.trim();
            
            // Clear previous results/errors
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            errorDiv.innerHTML = '';

            if (!videoUrl) {
                alert('Please enter a valid video link!');
                return;
            }

            // Show loading state using your HTML loader element
            loader.style.display = 'block';
            downloadBtn.disabled = true;

            try {
                // Fetching video data directly from the free API
                const response = await fetch(https://api.allinone-downloader.com/v1/download?url=${encodeURIComponent(videoUrl)});
                const data = await response.json();

                // Hide loader
                loader.style.display = 'none';

                if (data && data.links && data.links.length > 0) {
                    const downloadLink = data.links[0].url;
                    
                    // Display success inside your HTML result box instead of just opening a tab
                    resultDiv.innerHTML = `
                        <p style="margin-bottom: 10px; font-weight: bold;">Video Ready to Download!</p>
                        <a href="${downloadLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Click Here to Save Video</a>
                    `;
                    resultDiv.style.display = 'block';
                } else {
                    errorDiv.innerText = 'Invalid link or video not found. Please try another link.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                loader.style.display = 'none';
                errorDiv.innerText = 'Network error or API limit reached. Please try again later.';
                errorDiv.style.display = 'block';
            } finally {
                downloadBtn.disabled = false;
            }
        });
    }
});
