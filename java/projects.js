document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById('projectsGallery');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');
    const scrollAmount = 300;
  
    function updateButtons() {
      if (!gallery) return;
  
      leftBtn.disabled = gallery.scrollLeft <= 0;
      rightBtn.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
    }
  
    // Scroll actions
    leftBtn.addEventListener('click', () => {
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  
    rightBtn.addEventListener('click', () => {
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  
    // Check button state when scrolling
    gallery.addEventListener('scroll', updateButtons);
  
    // Initial check after DOM is ready
    updateButtons();
  });