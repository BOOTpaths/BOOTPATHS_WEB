/**
 * BOOTPATHS – BRAHMAGIRI TREK JAVASCRIPT
 * Interactive navigation, accordions, gallery lightbox, and media triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initIntersectionAnimations();
});

// Navbar scroll state
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// Mobile Hamburger Menu
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  const body = document.body;

  if (!menu || !hamburger) return;

  const isOpen = menu.classList.contains('active');
  if (isOpen) {
    closeMenu();
  } else {
    menu.classList.add('active');
    hamburger.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    body.classList.add('menu-open');
  }
}

function closeMenu() {
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  const body = document.body;

  if (menu) menu.classList.remove('active');
  if (hamburger) hamburger.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  body.classList.remove('menu-open');
}

// Main Itinerary Accordions
function toggleMainAccordion(headerElement) {
  const item = headerElement.closest('.main-accordion-item');
  if (!item) return;

  const isOpen = item.classList.contains('open');
  
  // Toggle current item
  if (isOpen) {
    item.classList.remove('open');
  } else {
    item.classList.add('open');
  }
}

// FAQ Accordion
function toggleFaq(faqElement) {
  const isOpen = faqElement.classList.contains('open');
  
  // Close any currently open FAQs in list for clean accordion feel
  const allFaqs = document.querySelectorAll('.faq-item');
  allFaqs.forEach(faq => {
    if (faq !== faqElement) faq.classList.remove('open');
  });

  if (isOpen) {
    faqElement.classList.remove('open');
  } else {
    faqElement.classList.add('open');
  }
}

// Featured YouTube Video Player
function playMainVideo() {
  const cover = document.getElementById('videoCover');
  const frame = document.getElementById('youtubeFrame');
  
  if (cover) {
    cover.classList.add('hidden');
  }
  
  if (frame) {
    let currentSrc = frame.src;
    // Auto-play the video on click
    if (!currentSrc.includes('autoplay=1')) {
      frame.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=1';
    }
  }
}

// Photo Gallery Lightbox
function openLightbox(imageSrc, captionText) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');

  if (!modal || !img) return;

  img.src = imageSrc;
  if (caption) caption.textContent = captionText || '';
  modal.classList.add('active');
  document.body.classList.add('menu-open');
}

function closeLightbox(event) {
  // If clicked directly on close button or outer backdrop
  if (event && event.target && event.target.id === 'lbImg') {
    return; // Don't close if clicking the actual image
  }
  
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    closeLightbox();
  }
});

// Intersection observer for smooth scroll reveals
function initIntersectionAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hlc, .qi, .cl-card, .ie-card, .reel-card').forEach(el => {
    observer.observe(el);
  });
}
