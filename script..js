document.addEventListener('DOMContentLoaded', () => {
    // Halftone canvas animation
    const canvas = document.getElementById('halftone');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        // Ensure canvas width is 60% of window.innerWidth on larger screens
        // and 100% with reduced opacity on smaller screens (as per CSS @media)
        if (window.innerWidth > 768) {
            canvas.width = window.innerWidth * 0.6;
        } else {
            canvas.width = window.innerWidth;
        }
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function drawHalftone() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const dotSize = 3;
        const spacing = 6;
        const time = Date.now() * 0.0005; // Continues here
        
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                // Create horizontal ocean wave pattern
                const wave1 = Math.sin(y * 0.015 + time * 2);
                const wave2 = Math.sin(y * 0.025 + x * 0.008 + time * 1.5);
                const wave3 = Math.cos(y * 0.01 + time);
                
                const combinedWave = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;
                const waveIntensity = (combinedWave + 1) / 2;
                
                // Vary dot size and opacity based on wave
                const size = dotSize * (0.3 + waveIntensity * 0.9);
                const alpha = 0.2 + waveIntensity * 0.5;
                
                // Blue gradient from light to dark
                const r = 0;
                const g = Math.floor(100 + waveIntensity * 150);
                const b = 255;
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        requestAnimationFrame(drawHalftone);
    }
    
    drawHalftone();
    
    // Hobby window click handlers
    const hobbyWindows = document.querySelectorAll('.hobby-window');
    const mainContent = document.getElementById('main-content');
    const blogSections = document.querySelectorAll('.blog-section');
    
    hobbyWindows.forEach(window => {
        window.addEventListener('click', function() {
            const hobby = this.getAttribute('data-hobby');
            showBlog(hobby);
        });
    });
    
    window.showBlog = function(hobby) { // Made global for onclick in HTML
        mainContent.style.display = 'none';
        blogSections.forEach(section => section.classList.remove('active'));
        document.getElementById(`blog-${hobby}`).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        initializePhotoClicks(); // Re-initialize photo clicks for new blog section images
    }
    
    window.showMain = function() { // Made global for onclick in HTML
        blogSections.forEach(section => section.classList.remove('active'));
        mainContent.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateRecentPhotos(); // Refresh recent photos when returning to main
        initializePhotoClicks(); // Re-initialize photo clicks for main gallery
    }
    
    // Update Recent Photos gallery with most recent images from all hobbies
    function updateRecentPhotos() {
        const recentGallery = document.querySelector('.gallery-grid');
        
        // Clear current gallery
        recentGallery.innerHTML = '';
        
        // Collect all images from hobby blogs
        const allImages = [];
        document.querySelectorAll('.blog-image-grid').forEach(grid => {
            const hobby = grid.getAttribute('data-hobby');
            const images = grid.querySelectorAll('.blog-image-item');
            images.forEach((item, index) => {
                const img = item.querySelector('img');
                if (img) { // Only add if there's an actual image
                    allImages.push({
                        element: item.cloneNode(true), // Clone the whole item div
                        hobby: hobby,
                        index: index,
                        // You might want to add a timestamp here if images are dated
                        // For now, order by appearance in the DOM for "recent"
                    });
                }
            });
        });
        
        // Sort images (e.g., by index or a data-timestamp if you add one)
        // For now, the "recent" is simply the last 8 items collected from the DOM
        const recentImages = allImages.slice(-8).reverse(); // Get last 8 and reverse to show newest first
        
        // Populate recent photos gallery
        if (recentImages.length > 0) {
            recentImages.forEach(imgData => {
                // Ensure the cloned element gets the right classes for the gallery
                const galleryItem = imgData.element;
                galleryItem.classList.remove('blog-image-item'); // Remove blog-specific class
                galleryItem.classList.add('gallery-item'); // Add gallery-specific class
                
                // If it's a "Photo X" placeholder, replace with actual image if available
                if (galleryItem.textContent.includes('Photo') && galleryItem.querySelector('img')) {
                    galleryItem.textContent = ''; // Clear placeholder text
                }

                recentGallery.appendChild(galleryItem);
            });
        } else {
            // Show placeholders if no images exist
            for (let i = 1; i <= 8; i++) {
                const placeholder = document.createElement('div');
                placeholder.className = 'gallery-item';
                placeholder.textContent = `Photo ${i}`; // Keep original placeholder text
                recentGallery.appendChild(placeholder);
            }
        }
    }
    
    // Call on page load
    window.addEventListener('load', updateRecentPhotos);
    
    // Photo Modal Functions
    window.openPhotoModal = function(imageSrc, title, description) { // Made global
        const modal = document.getElementById('photoModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        
        modalImage.src = imageSrc;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }
    
    window.closePhotoModal = function() { // Made global
        const modal = document.getElementById('photoModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Close modal on background click
    document.getElementById('photoModal').addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('modal-content')) { // Also close if clicking outside image but within modal-content
            closePhotoModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePhotoModal();
        }
    });
    
    // Add click handlers to all blog images and gallery items
    function initializePhotoClicks() {
        // Remove existing listeners to prevent duplicates if called multiple times
        document.querySelectorAll('.blog-image-item, .gallery-item').forEach(item => {
            // Store the old event listener if necessary, or just rely on re-adding
            // For simplicity here, we'll assume a fresh attachment is fine.
            item.onclick = null; // Clear any previous inline handlers or attached listeners
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    const title = this.getAttribute('data-title') || 'Untitled Photo';
                    const description = this.getAttribute('data-description') || 'No description available.';
                    openPhotoModal(img.src, title, description);
                }
            });
        });
    }
    
    // Initialize on load and after blog navigation
    window.addEventListener('load', initializePhotoClicks);
    // You might need to call initializePhotoClicks() after dynamically loading content or changing blog sections
    // This is already done within showBlog and showMain now.
    
    console.log('kp.archive website loaded successfully! 🚀');
}); // End DOMContentLoaded
