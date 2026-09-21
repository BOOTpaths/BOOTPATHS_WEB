/* ==========================================================================
   BOOTPATHS – YELLAPATTY TREK JAVASCRIPT
   Interactive UX, Redesigned Itinerary Accordions, Gallery & Lightbox
   ========================================================================== */

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

document.addEventListener('DOMContentLoaded', () => {
  // Close menu when clicking navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Sticky Navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });
});

// -------------------------------------------------------------
// 2. REDESIGNED ITINERARY ACCORDIONS & EXPEDITION TABS
// -------------------------------------------------------------
function switchItineraryTab(tabName, btnElement) {
  const tabs = document.querySelectorAll('.it-pill-btn');
  tabs.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const panes = document.querySelectorAll('.it-tab-pane');
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(tabName);
  if (targetPane) {
    targetPane.classList.add('active');
  }
}

function toggleDay(headerElement) {
  const dayItem = headerElement.closest('.it-day-item');
  if (!dayItem) return;

  const parentPane = dayItem.closest('.it-tab-pane') || document;
  const isOpen = dayItem.classList.contains('open');

  // Close siblings within the same tab pane for clean accordion behavior
  parentPane.querySelectorAll('.it-day-item').forEach(item => {
    item.classList.remove('open');
    const statusText = item.querySelector('.idh-status-text');
    if (statusText) statusText.textContent = 'View Details';
  });

  // If clicked item was not open, open it
  if (!isOpen) {
    dayItem.classList.add('open');
    const statusText = dayItem.querySelector('.idh-status-text');
    if (statusText) statusText.textContent = 'Collapse';
  }
}

// -------------------------------------------------------------
// 3. FAQ ACCORDION
// -------------------------------------------------------------
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

  if (!isOpen) {
    faqItem.classList.add('open');
    headerElement.setAttribute('aria-expanded', 'true');
  }
}

// -------------------------------------------------------------
// 4. PHOTO GALLERY & LIGHTBOX
// -------------------------------------------------------------
function filterGallery(category, btnElement) {
  const filterBtns = document.querySelectorAll('.gf-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const items = document.querySelectorAll('.gal-item');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    if (category === 'all' || itemCat === category || itemCat.includes(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(element) {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const img = element.querySelector('img');
  const title = element.querySelector('h4');

  if (!modal || !modalImg || !img) return;

  modalImg.src = img.src;
  modalImg.alt = img.alt || 'Yellapatty Trek Photography';
  if (modalCaption && title) {
    modalCaption.textContent = title.textContent;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});
