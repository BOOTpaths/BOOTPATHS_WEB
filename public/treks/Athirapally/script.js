/* ==========================================
   BOOTPATHS – ATHIRAPALLY NADUKANI TREK JAVASCRIPT
   MULTI-DEVICE RESPONSIVE INTERACTION & UX
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

// Close menu when clicking navigation links
document.addEventListener('DOMContentLoaded', () => {
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
    updateActiveNavLink();
  }, { passive: true });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') changeLightbox(1);
      if (e.key === 'ArrowLeft') changeLightbox(-1);
    }
  });

  // Swipe support for mobile lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) {
        changeLightbox(1); // Swipe left -> next
      }
      if (touchEndX > touchStartX + 50) {
        changeLightbox(-1); // Swipe right -> prev
      }
    }, { passive: true });
  }
});

// Scrollspy for active nav link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (navLink) {
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

// -------------------------------------------------------------
// 2. ACCORDIONS (ITINERARY & FAQS) - AUTO-COLLAPSE SIBLINGS
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

  // Close all other day cards
  document.querySelectorAll('.it-day').forEach(card => {
    card.classList.remove('open');
  });

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
