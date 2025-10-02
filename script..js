const canvas = document.getElementById('halftone');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawHalftone() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dotSize = 3;
    const spacing = 6;
    const time = Date.now() * 0.0005;
    
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            const wave1 = Math.sin(y * 0.015 + time * 2);
            const wave2 = Math.sin(y * 0.025 + x * 0.008 + time * 1.5);
            const wave3 = Math.cos(y * 0.01 + time);
            
            const combinedWave = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;
            const waveIntensity = (combinedWave + 1) / 2;
            
            const size = dotSize * (0.3 + waveIntensity * 0.9);
            const alpha = 0.2 + waveIntensity * 0.5;
            
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

const hobbyWindows = document.querySelectorAll('.hobby-window');
const mainContent = document.getElementById('main-content');
const blogSections = document.querySelectorAll('.blog-section');

hobbyWindows.forEach(window => {
    window.addEventListener('click', function() {
        const hobby = this.getAttribute('data-hobby');
        showBlog(hobby);
    });
});

function showBlog(hobby) {
    mainContent.style.display = 'none';
    blogSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`blog-${hobby}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMain() {
    blogSections.forEach(section => section.classList.remove('active'));
    mainContent.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateRecentPhotos() {
    const recentGallery = document.querySelector('.gallery-grid');
    recentGallery.innerHTML = '';
    
    const allImages = [];
    document.querySelectorAll('.blog-image-grid').forEach(grid => {
        const hobby = grid.getAttribute('data-hobby');
        const images = grid.querySelectorAll('.blog-image-item');
        images.forEach((img, index) => {
            if (img.querySelector('img')) {
                allImages.push({
                    element: img.cloneNode(true),
                    hobby: hobby,
                    index: index
                });
            }
        });
    });
    
    const recentImages = allImages.slice(-8).reverse();
    
    if (recentImages.length > 0) {
        recentImages.forEach(imgData => {
            recentGallery.appendChild(imgData.element);
        });
    } else {
        for (let i = 1; i <= 8; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'gallery-item';
            placeholder.textContent = `Photo ${i}`;
            recentGallery.appendChild(placeholder);
        }
    }
}

window.addEventListener('load', updateRecentPhotos);

function openPhotoModal(imageSrc, title, description) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('photoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePhotoModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePhotoModal();
    }
});

function initializePhotoClicks() {
    document.querySelectorAll('.blog-image-item, .gallery-item').forEach(item => {
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

window.addEventListener('load', initializePhotoClicks);

console.log('Digital Archive website loaded successfully! 🚀');
