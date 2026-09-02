/**
 * Bootpaths – Chimmini Climate Walk Trek Page
 * Interaction & Responsive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLightboxKeyboard();
});

// ---- Navbar Scroll State ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ---- Mobile Drawer Navigation ----
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const navBackdrop = document.getElementById('navBackdrop');
  const body = document.body;

  const isOpen = navMenu.classList.contains('open');

  if (isOpen) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    navBackdrop.classList.remove('open');
    body.classList.remove('menu-open');
  } else {
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    navBackdrop.classList.add('open');
    body.classList.add('menu-open');
  }
}

// Auto close menu when navigation link is clicked
function closeMenuOnNav() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('open')) {
    toggleMenu();
  }
}

// ---- Dual Itinerary Accordion Toggles ----
function toggleMainAccordion(headerElement) {
  const item = headerElement.parentElement;
  const isAlreadyActive = item.classList.contains('active');

  // Toggle clicked accordion
  if (isAlreadyActive) {
    item.classList.remove('active');
  } else {
    item.classList.add('active');
  }
}

// ---- FAQ Accordion Toggle ----
function toggleFaq(buttonElement) {
  const faqItem = buttonElement.parentElement;
  const isAlreadyActive = faqItem.classList.contains('active');

  // Optional: close other open items in the same container
  const allItems = document.querySelectorAll('.fqi');
  allItems.forEach(i => {
    if (i !== faqItem) i.classList.remove('active');
  });

  if (isAlreadyActive) {
    faqItem.classList.remove('active');
  } else {
    faqItem.classList.add('active');
  }
}

// ---- Photo Gallery Lightbox ----
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');

  lbImg.src = src;
  lbCap.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function initLightboxKeyboard() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) {
        closeLightbox();
      }
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('open')) {
        toggleMenu();
      }
    }
  });
}
