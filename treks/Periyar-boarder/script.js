/* ==========================================
   BOOTPATHS – PERIYAR BORDER HIKING INTERACTION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize first accordion open height
  const activeAccordion = document.querySelector('.main-accordion-item.active');
  if (activeAccordion) {
    const body = activeAccordion.querySelector('.main-accordion-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 50 + 'px';
    }
  }

  // Smooth scroll handler for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
          toggleMenu();
        }
        
        const navHeight = document.getElementById('navbar').offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

/* ---- Navbar Scroll Effect ---- */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ---- Mobile Menu Toggle ---- */
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('navBackdrop');
  const body = document.body;

  if (navMenu && hamburger && backdrop) {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    backdrop.classList.toggle('active');
    if (isOpen) {
      body.classList.add('menu-open');
    } else {
      body.classList.remove('menu-open');
    }
  }
}

/* ---- Redesigned Main Accordion (Itinerary) ---- */
function toggleMainAccordion(headerElement) {
  const item = headerElement.closest('.main-accordion-item');
  if (!item) return;

  const isActive = item.classList.contains('active');
  const allItems = document.querySelectorAll('.main-accordion-item');

  // Collapse all other items
  allItems.forEach(acc => {
    if (acc !== item) {
      acc.classList.remove('active');
      const body = acc.querySelector('.main-accordion-body');
      if (body) body.style.maxHeight = '0px';
    }
  });

  // Toggle current item
  if (isActive) {
    item.classList.remove('active');
    const body = item.querySelector('.main-accordion-body');
    if (body) body.style.maxHeight = '0px';
  } else {
    item.classList.add('active');
    const body = item.querySelector('.main-accordion-body');
    if (body) {
      body.style.maxHeight = (body.scrollHeight + 80) + 'px';
    }
  }
}

/* ---- FAQ Accordion Toggle ---- */
function toggleFaq(headerElement) {
  const item = headerElement.closest('.faq-item');
  if (!item) return;

  const isActive = item.classList.contains('active');
  const allItems = document.querySelectorAll('.faq-item');

  allItems.forEach(faq => {
    if (faq !== item) {
      faq.classList.remove('active');
      const body = faq.querySelector('.faq-body');
      if (body) body.style.maxHeight = '0px';
    }
  });

  if (isActive) {
    item.classList.remove('active');
    const body = item.querySelector('.faq-body');
    if (body) body.style.maxHeight = '0px';
  } else {
    item.classList.add('active');
    const body = item.querySelector('.faq-body');
    if (body) {
      body.style.maxHeight = (body.scrollHeight + 20) + 'px';
    }
  }
}

/* ---- Gallery Lightbox Modal ---- */
function openLightbox(imageSrc) {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('lightboxImg');
  if (modal && img) {
    img.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  const modal = document.getElementById('imageModal');
  if (event.target.id === 'imageModal' || event.target.classList.contains('modal-close')) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
}
