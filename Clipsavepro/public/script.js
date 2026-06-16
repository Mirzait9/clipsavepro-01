document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.querySelector('button'); 
    const urlInput = document.querySelector('input[type="text"]'); 

    downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const videoUrl = urlInput.value.trim();
        if (!videoUrl) {
            alert('Please enter a valid video link!');
            return;
        }

        downloadBtn.innerText = 'Processing...';
        downloadBtn.disabled = true;

        try {
            // Fetching video data directly from the free API without a local server backend
            const response = await fetch(https://api.allinone-downloader.com/v1/download?url=${encodeURIComponent(videoUrl)});
            const data = await response.json();

            if (data && data.links && data.links.length > 0) {
                const downloadLink = data.links[0].url;
                window.open(downloadLink, '_blank');
            } else {
                alert('Invalid link or video not found.');
            }
        } catch (error) {
            console.error(error);
            alert('Error fetching video. Please try again.');
        } finally {
            downloadBtn.innerText = 'Download Video';
            downloadBtn.disabled = false;
        }
    });
})
