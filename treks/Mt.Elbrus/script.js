/* ==========================================
   BOOTPATHS – MOUNT ELBRUS EXPEDITION (5,642m)
   INTERACTIVE APPLICATION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Initial check for gear checklist items
  updateChecklistCount();
});

// Mobile Menu Toggle
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  
  const isOpen = navMenu.classList.toggle('active');
  hamburger.classList.toggle('active', isOpen);
  backdrop.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

// Main Accordions (Quick Itinerary vs Detailed Itinerary)
function toggleMainAccordion(header) {
  const item = header.closest('.main-accordion-item');
  if (item) {
    item.classList.toggle('open');
  }
}

// Day-by-Day Accordion (within detailed itinerary)
function toggleDay(header) {
  const dayItem = header.closest('.it-day');
  if (dayItem) {
    dayItem.classList.toggle('open');
  }
}

// FAQ Accordion
function toggleFaq(header) {
  const faqItem = header.closest('.faq-item');
  if (faqItem) {
    const wasOpen = faqItem.classList.contains('open');
    // Close other FAQ items for a neat accordion look
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('open');
      const q = item.querySelector('.faq-q');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    
    if (!wasOpen) {
      faqItem.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  }
}

// Photo Gallery Filter
function filterGallery(category, btn) {
  document.querySelectorAll('.gt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

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

// Gallery Lightbox Data & Controls
const galleryData = [
  { src: 'images/elbrus_hero.jpg', caption: 'Sunrise over Mount Elbrus Twin Volcanic Peaks & Greater Caucasus Range' },
  { src: 'images/pastukhov_rocks.jpg', caption: 'High-Altitude Acclimatization Climb towards Pastukhov Rocks (4,700m)' },
  { src: 'images/garabashi_barrels.jpg', caption: 'Iconic Garabashi Barrels & High Refuge Huts at 3,800m Altitude' },
  { src: 'images/elbrus_saddle.jpg', caption: 'Climbers on the Saddle Traverse (5,300m) with Safety Fixed Ropes' },
  { src: 'images/elbrus_summit.jpg', caption: 'Standing on the Roof of Europe – Mount Elbrus West Summit (5,642m)' },
  { src: 'images/ice_training.jpg', caption: 'Glacier & Snow Safety School: Crampons & Ice Axe Self-Arrest Training' },
  { src: 'images/cheget_view.jpg', caption: 'Panoramic View of Mount Elbrus from Mount Cheget Acclimatization Ridge' },
  { src: 'images/caucasian_feast.jpg', caption: 'Celebratory Caucasian Traditional Feast & Tea in Terskol Valley' }
];

let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('galleryLightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const idx = document.getElementById('lightboxIndex');

  if (galleryData[index]) {
    img.src = galleryData[index].src;
    img.alt = galleryData[index].caption;
    cap.textContent = galleryData[index].caption;
    idx.textContent = `Photo ${index + 1} of ${galleryData.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('galleryLightbox');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryData.length - 1;
  if (currentLightboxIndex >= galleryData.length) currentLightboxIndex = 0;
  openLightbox(currentLightboxIndex);
}

// Keyboard controls for Lightbox
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('galleryLightbox');
  if (modal && modal.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'ArrowRight') changeLightbox(1);
  }
});

// Interactive Packing Checklist
function toggleCheck(item) {
  const box = item.querySelector('.cl-box');
  const isChecked = item.classList.toggle('checked');
  
  if (isChecked) {
    box.textContent = '✓';
    box.style.background = '#0284c7';
    box.style.borderColor = '#0284c7';
    item.style.borderColor = '#38bdf8';
    item.style.background = '#f0f9ff';
  } else {
    box.textContent = '';
    box.style.background = 'transparent';
    box.style.borderColor = '#cbd5e1';
    item.style.borderColor = 'rgba(15, 23, 42, 0.08)';
    item.style.background = '#ffffff';
  }
  updateChecklistCount();
}

function updateChecklistCount() {
  const total = document.querySelectorAll('.cl-item').length;
  const checked = document.querySelectorAll('.cl-item.checked').length;
  const badge = document.getElementById('clCountBadge');
  if (badge) {
    badge.textContent = `${checked} / ${total} Packed`;
    if (checked === total) {
      badge.style.background = '#dcfce7';
      badge.style.color = '#15803d';
      badge.textContent = `All ${total} Items Packed! Ready for Elbrus! 🏔️`;
    } else {
      badge.style.background = '#e0f2fe';
      badge.style.color = '#0284c7';
    }
  }
}
