// Update Recent Works
function updateRecentGallery() {
  const gallery = document.querySelector('.gallery-grid');
  gallery.innerHTML = '';

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
      const img = imgData.element.querySelector('img');
      imgData.element.addEventListener('click', () => {
        openPhotoModal(
          img.src,
          `${imgData.hobby} – Work ${imgData.index + 1}`,
          `A recent ${imgData.hobby} project.`
        );
      });
      gallery.appendChild(imgData.element);
    });
  } else {
    for (let i = 1; i <= 8; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-item';
      placeholder.textContent = `Work ${i}`;
      gallery.appendChild(placeholder);
    }
  }
}

// Modal Functions
function openPhotoModal(imageSrc, title, description) {
  const modal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = description;

  modal.classList.add('active');
}

function closePhotoModal() {
  document.getElementById('photoModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('photoModal').addEventListener('click', (e) => {
  if (e.target.id === 'photoModal') {
    closePhotoModal();
  }
});

// Enable modals on blog images
function enableBlogImageModals() {
  document.querySelectorAll('.blog-image-item img').forEach((img, index) => {
    const hobby = img.closest('.blog-image-grid').getAttribute('data-hobby');
    img.addEventListener('click', () => {
      openPhotoModal(
        img.src,
        `${hobby} – Work ${index + 1}`,
        `A ${hobby} gallery photo.`
      );
    });
  });
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  updateRecentGallery();
  enableBlogImageModals();
});
