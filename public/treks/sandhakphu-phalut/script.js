/* ==========================================
   BOOTPATHS – SANDAKPHU PHALUT HIMALAYAN TREK
   INTERACTIVE ITINERARY, GALLERY, VIDEO, CHECKLIST & UX
   ========================================== */

'use strict';

// -------------------------------------------------------------
// 1. MOBILE NAVIGATION & BACKDROP
// -------------------------------------------------------------
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const navBackdrop = document.getElementById('navBackdrop');
  if (!navMenu || !hamburger || !navBackdrop) return;

  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  navBackdrop.classList.toggle('active');
  document.body.classList.toggle('menu-open');

  hamburger.setAttribute('aria-expanded', !isExpanded);
}

function closeMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const navBackdrop = document.getElementById('navBackdrop');
  if (navMenu && navMenu.classList.contains('open')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
}

// Close menu when clicking navigation links & handle scrolled navbar
document.addEventListener('DOMContentLoaded', () => {
  const allNavLinks = document.querySelectorAll('.nav-menu a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Dynamic Glass Sticky Navbar on scroll (Amphi style)
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (navbar) {
      if (window.scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Initialize checklist counter
  updateChecklistCount();
});

// -------------------------------------------------------------
// 2. ACCORDIONS (ITINERARY & FAQS)
// -------------------------------------------------------------
function toggleMainAccordion(headerElement) {
  const accordionItem = headerElement.closest('.main-accordion-item');
  if (!accordionItem) return;

  const isOpen = accordionItem.classList.contains('open');

  // Close all other main accordion items
  document.querySelectorAll('.main-accordion-item').forEach(item => {
    item.classList.remove('open');
  });

  // If clicked item was not open, open it
  if (!isOpen) {
    accordionItem.classList.add('open');
  }
}

function toggleDay(headerElement) {
  const dayCard = headerElement.closest('.it-day');
  if (!dayCard) return;

  const isOpen = dayCard.classList.contains('open');

  // Close all other day cards in the same list
  const container = dayCard.closest('.it-day-list');
  if (container) {
    container.querySelectorAll('.it-day').forEach(card => {
      card.classList.remove('open');
    });
  }

  // If clicked item was not open, open it
  if (!isOpen) {
    dayCard.classList.add('open');
  }
}

function toggleFaq(headerElement) {
  const faqItem = headerElement.closest('.faq-item');
  if (!faqItem) return;

  const isOpen = faqItem.classList.contains('open');

  // Close all other faq items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('open');
    const q = item.querySelector('.faq-q');
    if (q) q.setAttribute('aria-expanded', 'false');
  });

  // If clicked item was not open, open it
  if (!isOpen) {
    faqItem.classList.add('open');
    const q = faqItem.querySelector('.faq-q');
    if (q) q.setAttribute('aria-expanded', 'true');
  }
}

// Keyboard navigation support for FAQ items
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('faq-q')) {
    e.preventDefault();
    toggleFaq(e.target);
  }
});

// -------------------------------------------------------------
// 3. PACKING & GEAR CHECKLIST
// -------------------------------------------------------------
function toggleCheck(itemElement) {
  itemElement.classList.toggle('checked');
  updateChecklistCount();
}

function updateChecklistCount() {
  const total = document.querySelectorAll('.cl-item').length;
  const checked = document.querySelectorAll('.cl-item.checked').length;
  const badge = document.getElementById('clCountBadge');
  if (badge) {
    badge.textContent = `${checked} / ${total} Packed`;
  }
}

// -------------------------------------------------------------
// 4. GALLERY LIGHTBOX & FILTERING
// -------------------------------------------------------------
let currentLightboxIndex = 0;
let galleryImages = [];

function filterGallery(category, button) {
  const buttons = document.querySelectorAll('.gt-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');

  const items = document.querySelectorAll('.gi');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-cat');
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(index) {
  const visibleItems = Array.from(document.querySelectorAll('.gi')).filter(item => item.style.display !== 'none');
  galleryImages = visibleItems.map(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gi-cap') ? item.querySelector('.gi-cap').innerText : '';
    return { src: img ? img.src : '', alt: img ? img.alt : '', caption: cap };
  });

  if (galleryImages.length === 0) return;

  currentLightboxIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
  updateLightboxContent();

  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeLightbox(direction) {
  if (galleryImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const cur = galleryImages[currentLightboxIndex];
  if (!cur) return;
  const imgEl = document.getElementById('lightboxImg');
  const capEl = document.getElementById('lightboxCaption');
  const numEl = document.getElementById('lightboxIndex');

  if (imgEl) imgEl.src = cur.src;
  if (capEl) capEl.textContent = cur.caption || cur.alt;
  if (numEl) numEl.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

// -------------------------------------------------------------
// 5. VIDEO MODAL PLAYER
// -------------------------------------------------------------
function openVideoModal(videoUrl) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  if (!modal || !iframe) return;

  const url = videoUrl || 'https://www.youtube.com/embed/videoseries?list=PL_BOOTPATHS_DEMO';
  iframe.src = url;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  if (!modal || !iframe) return;

  iframe.src = '';
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Global Keydown Handler (ESC, Arrow keys)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeVideoModal();
    closeMenu();
  } else if (e.key === 'ArrowLeft') {
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      changeLightbox(-1);
    }
  } else if (e.key === 'ArrowRight') {
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      changeLightbox(1);
    }
  }
});


// -------------------------------------------------------------
// 6. FAQ CATEGORY FILTER
// -------------------------------------------------------------
function filterFaq(category, button) {
  const buttons = document.querySelectorAll('.faq-cat-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');

  const groups = document.querySelectorAll('.faq-theme-group');
  groups.forEach(group => {
    const groupCat = group.getAttribute('data-cat');
    if (category === 'all' || groupCat === category) {
      group.style.display = 'block';
    } else {
      group.style.display = 'none';
    }
  });
}
