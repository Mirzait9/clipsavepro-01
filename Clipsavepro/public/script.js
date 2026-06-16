document.addEventListener('DOMContentLoaded', () => {
    // Select HTML elements (Ensure these match your index.html tags/classes)
    const downloadBtn = document.querySelector('button'); 
    const urlInput = document.querySelector('input[type="text"]'); 

    downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const videoUrl = urlInput.value.trim();
        if (!videoUrl) {
            alert('Please enter a valid video link!');
            return;
        }

        // Change button state to loading
        downloadBtn.innerText = 'Downloading...';
        downloadBtn.disabled = true;

        try {
            // Send request to the live Render backend using a relative path
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ videoUrl: videoUrl })
            });

            const data = await response.json();

            if (data.success && data.links && data.links.length > 0) {
                // Get the first downloadable video URL and open it in a new tab
                const downloadLink = data.links[0].url;
                window.open(downloadLink, '_blank');
                downloadBtn.innerText = 'Download Video';
            } else {
                alert('Invalid link or video cannot be downloaded.');
                downloadBtn.innerText = 'Download Video';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error! Please try again.');
            downloadBtn.innerText = 'Download Video';
        } finally {
            downloadBtn.disabled = false;
        }
    });
});
