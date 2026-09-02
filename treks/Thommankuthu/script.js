/* ==========================================================================
   BOOTPATHS – THOMMANKUTHU SEVEN STEPS TREK JAVASCRIPT
   Interactive UI, Itinerary Accordions, Redesigned Inclusions & Packing Tracker
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

  // Initialize checklist state
  updateChecklistProgress();
});

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

function toggleFaq(itemElement) {
  const faqItem = itemElement.classList.contains('faq-item') ? itemElement : itemElement.closest('.faq-item');
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
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('faq-item')) {
    e.preventDefault();
    toggleFaq(e.target);
  }
});

// -------------------------------------------------------------
// 3. REDESIGNED INCLUSIONS & EXCLUSIONS FILTERING
// -------------------------------------------------------------
function filterInclusions(view, button) {
  const tabs = document.querySelectorAll('.ief-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (button) button.classList.add('active');

  const dualGrid = document.getElementById('ieDualGrid');
  const cardInc = document.getElementById('cardIncluded');
  const cardExc = document.getElementById('cardExcluded');

  if (!dualGrid || !cardInc || !cardExc) return;

  if (view === 'all') {
    dualGrid.classList.remove('show-only-included', 'show-only-excluded');
    cardInc.style.display = 'flex';
    cardExc.style.display = 'flex';
  } else if (view === 'included') {
    dualGrid.classList.add('show-only-included');
    dualGrid.classList.remove('show-only-excluded');
    cardInc.style.display = 'flex';
    cardExc.style.display = 'none';
  } else if (view === 'excluded') {
    dualGrid.classList.add('show-only-excluded');
    dualGrid.classList.remove('show-only-included');
    cardInc.style.display = 'none';
    cardExc.style.display = 'flex';
  }
}

// -------------------------------------------------------------
// 4. REDESIGNED PACKING & GEAR CHECKLIST
// -------------------------------------------------------------
function toggleCheckItem(itemElement) {
  itemElement.classList.toggle('checked');
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const allItems = document.querySelectorAll('.cl-card-item');
  const checkedItems = document.querySelectorAll('.cl-card-item.checked');
  const total = allItems.length || 12;
  const packed = checkedItems.length;

  const pct = Math.round((packed / total) * 100);

  // Update numbers
  const pctEl = document.getElementById('cdRingPct');
  if (pctEl) pctEl.textContent = `${pct}%`;

  const countPackedEl = document.getElementById('cdCountPacked');
  if (countPackedEl) countPackedEl.textContent = packed;

  const countTotalEl = document.getElementById('cdCountTotal');
  if (countTotalEl) countTotalEl.textContent = total;

  // Update SVG Ring: circumference = 2 * PI * 42 ≈ 263.89
  const ringFill = document.getElementById('cdRingFill');
  if (ringFill) {
    const circumference = 263.89;
    const offset = circumference - (packed / total) * circumference;
    ringFill.style.strokeDashoffset = offset;
    if (pct === 100) {
      ringFill.style.stroke = '#10b981';
    } else if (pct > 50) {
      ringFill.style.stroke = '#0ea5e9';
    } else {
      ringFill.style.stroke = '#f97316';
    }
  }

  // Update Status Pill
  const pill = document.getElementById('cdStatusPill');
  const pillText = document.getElementById('cdStatusText');
  if (pill && pillText) {
    if (packed === 0) {
      pill.className = 'cd-status-pill';
      pillText.textContent = 'Checklist Not Started';
    } else if (packed <= 3) {
      pill.className = 'cd-status-pill';
      pillText.textContent = 'Packing Started 🧳';
    } else if (packed <= 7) {
      pill.className = 'cd-status-pill';
      pillText.textContent = 'Getting Ready 🥾';
    } else if (packed < total) {
      pill.className = 'cd-status-pill';
      pillText.textContent = 'Almost Expedition Ready! 🌿';
    } else {
      pill.className = 'cd-status-pill status-ready';
      pillText.textContent = 'Expedition Ready! 🎉';
    }
  }
}

function packAllItems() {
  const allItems = document.querySelectorAll('.cl-card-item');
  allItems.forEach(item => item.classList.add('checked'));
  updateChecklistProgress();
}

function resetChecklist() {
  const allItems = document.querySelectorAll('.cl-card-item');
  allItems.forEach(item => item.classList.remove('checked'));
  updateChecklistProgress();
}

function filterChecklist(category, button) {
  const tabs = document.querySelectorAll('.clf-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (button) button.classList.add('active');

  const items = document.querySelectorAll('.cl-card-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// -------------------------------------------------------------
// 5. GALLERY LIGHTBOX & FILTERING
// -------------------------------------------------------------
let activeGalleryList = [];
let currentLbIndex = 0;

function filterGallery(arg1, arg2) {
  // Support both (button, category) and (category, button)
  let button, category;
  if (typeof arg1 === 'string') {
    category = arg1;
    button = arg2;
  } else {
    button = arg1;
    category = arg2;
  }

  const buttons = document.querySelectorAll('.gfb, .gt-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');

  const items = document.querySelectorAll('.gi');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(srcOrIndex, caption) {
  const modal = document.getElementById('lbModal') || document.getElementById('galleryLightbox');
  if (!modal) return;

  const visibleItems = Array.from(document.querySelectorAll('.gi')).filter(item => item.style.display !== 'none');
  activeGalleryList = visibleItems.map(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gi-ov p') || item.querySelector('.gi-cap');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: cap ? cap.textContent.trim() : (img ? img.alt : '')
    };
  });

  if (typeof srcOrIndex === 'number') {
    currentLbIndex = srcOrIndex;
  } else if (typeof srcOrIndex === 'string') {
    const idx = activeGalleryList.findIndex(item => item.src.includes(srcOrIndex));
    currentLbIndex = idx !== -1 ? idx : 0;
  }

  renderLightboxSlide();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightboxSlide() {
  if (activeGalleryList.length === 0) return;
  const current = activeGalleryList[currentLbIndex];
  if (!current) return;

  const lbImg = document.getElementById('lbImg') || document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lbCap') || document.getElementById('lightboxCaption');

  if (lbImg) {
    lbImg.src = current.src;
    lbImg.alt = current.alt;
  }
  if (lbCap) {
    lbCap.textContent = current.caption;
  }
}

function closeLightbox(event) {
  if (event && event.target && event.target.closest('.lb-content') && !event.target.classList.contains('lb-close')) {
    return;
  }
  const modal = document.getElementById('lbModal') || document.getElementById('galleryLightbox');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navLightbox(dir, event) {
  if (event) event.stopPropagation();
  if (activeGalleryList.length <= 1) return;
  currentLbIndex = (currentLbIndex + dir + activeGalleryList.length) % activeGalleryList.length;
  renderLightboxSlide();
}

// Keyboard controls for Lightbox
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lbModal') || document.getElementById('galleryLightbox');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    navLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    navLightbox(1);
  }
});


// -------------------------------------------------------------
// 6. REDESIGNED PAYMENT FARE CALCULATOR
// -------------------------------------------------------------
let currentTrekkerCount = 1;
const PRICE_PER_TREKKER = 1250;

function adjustTrekkers(delta) {
  setTrekkerCount(currentTrekkerCount + delta);
}

function setTrekkers(num, button) {
  const chips = document.querySelectorAll('.pqc-btn');
  chips.forEach(c => c.classList.remove('active'));
  if (button) button.classList.add('active');
  setTrekkerCount(num);
}

function setTrekkerCount(count) {
  currentTrekkerCount = Math.max(1, Math.min(count, 30));
  
  const valEl = document.getElementById('trekkerCountVal');
  if (valEl) {
    valEl.textContent = currentTrekkerCount + (currentTrekkerCount === 1 ? ' Person' : ' Persons');
  }

  const sumCount = document.getElementById('summaryCount');
  if (sumCount) sumCount.textContent = currentTrekkerCount;

  const total = currentTrekkerCount * PRICE_PER_TREKKER;
  const formattedTotal = '₹' + total.toLocaleString('en-IN');

  const sumBase = document.getElementById('summaryBaseAmount');
  if (sumBase) sumBase.textContent = formattedTotal;

  const totalPayable = document.getElementById('totalPayableAmount');
  if (totalPayable) totalPayable.textContent = formattedTotal;

  const btnTotal = document.getElementById('btnTotalText');
  if (btnTotal) btnTotal.textContent = formattedTotal;

  const dynamicBtn = document.getElementById('dynamicBookingBtn');
  if (dynamicBtn) {
    const msg = encodeURIComponent('Hi Bootpaths, I would like to reserve the Thommankuthu Seven Steps Waterfall Trek for ' + currentTrekkerCount + ' person(s). Total calculated: ' + formattedTotal + '. Please share payment details and slot confirmation.');
    dynamicBtn.href = 'https://wa.me/919446102200?text=' + msg;
  }
}
