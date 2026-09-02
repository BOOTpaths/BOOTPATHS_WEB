/* ==========================================
   BOOTPATHS – KATHIRMUDI TREK SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMainAccordions();
  initFaqAccordions();
  initGalleryFilters();
  initChecklist();
  initLightbox();
});

/* ---- 1. NAVBAR & MOBILE MENU ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navMenu');
      const hamburger = document.getElementById('hamburger');
      const backdrop = document.getElementById('navBackdrop');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        backdrop.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  });
}

function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  
  if (navMenu) {
    const isOpen = navMenu.classList.toggle('open');
    if (hamburger) hamburger.classList.toggle('active', isOpen);
    if (backdrop) backdrop.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }
}

/* ---- 2. REDESIGNED ITINERARY ACCORDIONS ---- */
function initMainAccordions() {
  // Open the first accordion (Quick Itinerary) by default
  const firstAccordion = document.getElementById('acc-quick-itinerary');
  if (firstAccordion) {
    firstAccordion.classList.add('active');
    const content = firstAccordion.querySelector('.main-accordion-content');
    if (content) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // Open the first sub-phase inside detailed itinerary by default
  const firstPhase = document.querySelector('.phase-card');
  if (firstPhase) {
    firstPhase.classList.add('open');
    const phaseBody = firstPhase.querySelector('.phase-body');
    if (phaseBody) {
      phaseBody.style.maxHeight = phaseBody.scrollHeight + 'px';
    }
  }
}

function toggleMainAccordion(headerEl) {
  const parentItem = headerEl.closest('.main-accordion-item');
  if (!parentItem) return;

  const content = parentItem.querySelector('.main-accordion-content');
  const isActive = parentItem.classList.contains('active');

  if (isActive) {
    parentItem.classList.remove('active');
    content.style.maxHeight = '0';
  } else {
    parentItem.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 100 + 'px';
  }
}

function togglePhase(headerEl) {
  const card = headerEl.closest('.phase-card');
  if (!card) return;

  const body = card.querySelector('.phase-body');
  const isOpen = card.classList.contains('open');

  if (isOpen) {
    card.classList.remove('open');
    body.style.maxHeight = '0';
  } else {
    card.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';

    // Update parent accordion max-height to avoid cut-offs
    const parentAcc = card.closest('.main-accordion-content');
    if (parentAcc) {
      parentAcc.style.maxHeight = parentAcc.scrollHeight + body.scrollHeight + 'px';
    }
  }
}

/* ---- 3. FAQ ACCORDION ---- */
function initFaqAccordions() {
  // Open first FAQ by default
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) {
    firstFaq.classList.add('active');
    const body = firstFaq.querySelector('.faq-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }
}

function toggleFaq(buttonEl) {
  const item = buttonEl.closest('.faq-item');
  if (!item) return;

  const body = item.querySelector('.faq-body');
  const isActive = item.classList.contains('active');

  // Optional: close other open FAQs for accordion behavior
  document.querySelectorAll('.faq-item').forEach(other => {
    if (other !== item && other.classList.contains('active')) {
      other.classList.remove('active');
      const otherBody = other.querySelector('.faq-body');
      if (otherBody) otherBody.style.maxHeight = '0';
    }
  });

  if (isActive) {
    item.classList.remove('active');
    body.style.maxHeight = '0';
  } else {
    item.classList.add('active');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

/* ---- 4. INTERACTIVE PACKING CHECKLIST ---- */
function initChecklist() {
  const totalEl = document.getElementById('clTotal');
  const checkboxes = document.querySelectorAll('#clGrid input[type="checkbox"]');
  if (totalEl) totalEl.textContent = checkboxes.length;
  updateChecklist();
}

function updateChecklist() {
  const checkboxes = document.querySelectorAll('#clGrid input[type="checkbox"]');
  const countEl = document.getElementById('clCount');
  const fillEl = document.getElementById('clBarFill');

  let checkedCount = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  if (countEl) countEl.textContent = checkedCount;
  if (fillEl && checkboxes.length > 0) {
    const percentage = Math.round((checkedCount / checkboxes.length) * 100);
    fillEl.style.width = percentage + '%';
  }
}

/* ---- 5. PHOTO GALLERY & LIGHTBOX ---- */
const galleryData = [
  {
    src: 'images/kathirmudi_hero.jpg',
    caption: 'Golden Sunrise at Kathirmudi Peak – 1,120m high ridge overlooking clouds',
    category: 'summit'
  },
  {
    src: 'images/kathirmudi_trail.jpg',
    caption: 'Ancient Shola Rainforest Canopy – Moss-draped trees & wild bamboo trails',
    category: 'trails'
  },
  {
    src: 'images/bonacaud_estate.jpg',
    caption: 'Bonacaud Heritage Tea Foothills – Colonial plantation slopes and misty roads',
    category: 'estate'
  },
  {
    src: 'images/kathirmudi_summit.jpg',
    caption: 'Kathirmudi Summit Panorama – Windswept rocky pinnacle vantage point',
    category: 'summit'
  },
  {
    src: 'images/kathirmudi_stream.jpg',
    caption: 'Crystal Clear Forest Stream – Natural mountain springs and granite pools',
    category: 'nature'
  },
  {
    src: 'images/kathirmudi_wildlife.jpg',
    caption: 'Endemic Malabar Giant Squirrel – Western Ghats rainforest canopy wildlife',
    category: 'nature'
  }
];

let currentLbIndex = 0;

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.g-filter');
  const items = document.querySelectorAll('.g-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });
}

function openLightbox(index) {
  currentLbIndex = index;
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lbImage');
  const caption = document.getElementById('lbCaption');

  if (modal && img && caption && galleryData[index]) {
    img.src = galleryData[index].src;
    img.alt = galleryData[index].caption;
    caption.textContent = galleryData[index].caption;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function nextLightbox() {
  currentLbIndex = (currentLbIndex + 1) % galleryData.length;
  openLightbox(currentLbIndex);
}

function prevLightbox() {
  currentLbIndex = (currentLbIndex - 1 + galleryData.length) % galleryData.length;
  openLightbox(currentLbIndex);
}
