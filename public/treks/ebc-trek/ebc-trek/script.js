/* ==========================================
   BOOTPATHS – EBC TREK PAGE SCRIPT
   ========================================== */

/* --- Navbar scroll effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* --- Mobile menu --- */
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  
  const isOpen = menu.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active', isOpen);
  if (backdrop) backdrop.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

// Close menu on link click
document.querySelectorAll('#navMenu a').forEach(a => {
  a.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const backdrop = document.getElementById('navBackdrop');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const backdrop = document.getElementById('navBackdrop');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }
});

/* --- Main Itinerary Accordions (Quick & Day-by-Day) with Mutual Auto-Close --- */
function toggleMainAccordion(header) {
  const item = header.closest('.main-accordion-item');
  if (!item) return;

  const wasOpen = item.classList.contains('open');

  // Automatically close/undrop all other main itinerary accordions
  document.querySelectorAll('.main-accordion-item').forEach(acc => {
    acc.classList.remove('open');
  });

  // If it wasn't open, open it
  if (!wasOpen) {
    item.classList.add('open');
  }
}

/* --- Day Tab Switcher in 'How Does Each Day Look' --- */
function switchDayTab(dayNum) {
  // Update active button
  const buttons = document.querySelectorAll('.day-tab-btn');
  buttons.forEach((btn, index) => {
    if (index + 1 === dayNum) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      btn.classList.remove('active');
    }
  });

  // Update active day panel
  const panels = document.querySelectorAll('.day-panel');
  panels.forEach(panel => {
    if (panel.id === `day-panel-${dayNum}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

/* --- FAQ accordion --- */
function tf(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.fqq.open').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* --- Gallery Lightbox --- */
function ol(src, cap) {
  const lb = document.getElementById('lb');
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = cap;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function cl() {
  document.getElementById('lb').classList.remove('active');
  document.getElementById('lb-img').src = '';
  document.body.style.overflow = '';
}
// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cl();
});

/* --- Scroll-triggered fade-up animations --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.hlc, .ii, .fqi, .iec, .gi, .qi, .fact, .as, .pc').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  observer.observe(el);
});

/* --- Smooth active nav link highlighting --- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* --- Prayer flags wind effect enhancement --- */
document.querySelectorAll('.flag').forEach((flag, i) => {
  flag.style.animationDelay = (i * 0.15) + 's';
  flag.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
});

console.log('🏔️ Bootpaths EBC Trek Page Loaded');
