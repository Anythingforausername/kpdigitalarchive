// Halftone canvas animation
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

// Photo Modal Functions
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

// Close modal on background click
document.getElementById('photoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePhotoModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePhotoModal();
    }
});

console.log('Digital Archive website loaded successfully! 🚀');
