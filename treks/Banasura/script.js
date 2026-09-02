/* ==========================================
   BOOTPATHS – BANASURA PEAK TREK JAVASCRIPT
   MULTI-DEVICE OPTIMIZED & INTERACTIVE UX
   ========================================== */

'use strict';

// -------------------------------------------------------------
// 1. MOBILE NAVIGATION & BACKDROP
// -------------------------------------------------------------
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const navBackdrop = document.getElementById('navBackdrop');
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

  // Sticky Navbar shadow & Back-to-top button visibility on scroll
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Initialize booking calculation on load
  calculateBookingTotal();

  // Set default min date for booking to tomorrow
  const dateInput = document.getElementById('bDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
});

// -------------------------------------------------------------
// 2. ACCORDIONS & DROPDOWNS: AUTO-UNDROP / SINGLE-OPEN BEHAVIOR
// -------------------------------------------------------------

/**
 * Main Itinerary Accordion
 * Opening one accordion automatically undrops/collapses all other main accordions.
 */
function toggleMainAccordion(headerElement) {
  const accordionItem = headerElement.closest('.main-accordion-item');
  if (!accordionItem) return;

  const isAlreadyOpen = accordionItem.classList.contains('open');

  // Undrop / Close ALL other main accordion items
  document.querySelectorAll('.main-accordion-item').forEach(item => {
    item.classList.remove('open');
  });

  // If clicked item was not open, drop it open
  if (!isAlreadyOpen) {
    accordionItem.classList.add('open');
    setTimeout(() => {
      accordionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }
}

/**
 * Day Tabs Switcher
 */
function switchDayTab(dayNum) {
  // Update active tab buttons
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

/**
 * Day Milestone Items
 * Opening one day milestone automatically undrops/collapses all other day cards.
 */
function toggleDay(headerElement) {
  const dayCard = headerElement.closest('.it-day');
  if (!dayCard) return;

  const isAlreadyOpen = dayCard.classList.contains('open');

  // Undrop / Close ALL day cards across all tabs
  document.querySelectorAll('.it-day').forEach(card => {
    card.classList.remove('open');
  });

  // If clicked item was not open, drop it open
  if (!isAlreadyOpen) {
    dayCard.classList.add('open');
  }
}

/**
 * FAQ Accordion
 * Opening one FAQ card automatically undrops/collapses all other FAQ cards.
 */
function toggleFaq(headerElement) {
  const faqCard = headerElement.closest('.faq-card');
  if (!faqCard) return;

  const isAlreadyOpen = faqCard.classList.contains('open');

  // Undrop / Close ALL FAQ cards
  document.querySelectorAll('.faq-card').forEach(card => {
    card.classList.remove('open');
  });

  // If clicked item was not open, drop it open
  if (!isAlreadyOpen) {
    faqCard.classList.add('open');
  }
}

// -------------------------------------------------------------
// 3. PACKING CHECKLIST INTERACTIVITY
// -------------------------------------------------------------
function togglePackItem(itemElement) {
  itemElement.classList.toggle('checked');
  updatePackProgress();
}

function updatePackProgress() {
  const total = document.querySelectorAll('.pack-item').length;
  const checked = document.querySelectorAll('.pack-item.checked').length;
  const countEl = document.getElementById('packCount');
  const barEl = document.getElementById('packBarFill');

  if (countEl) countEl.textContent = `${checked}/${total} Packed`;
  if (barEl) {
    const pct = total > 0 ? (checked / total) * 100 : 0;
    barEl.style.width = `${pct}%`;
  }
}

// -------------------------------------------------------------
// 4. PHOTO GALLERY & LIGHTBOX
// -------------------------------------------------------------
let currentLightboxIndex = 0;
let galleryImages = [];

function filterGallery(category, btnElement) {
  // Update active button
  document.querySelectorAll('.g-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const items = document.querySelectorAll('.gallery-grid .g-item');
  items.forEach(item => {
    const cat = item.getAttribute('data-cat');
    if (category === 'all' || cat === category) {
      item.style.display = 'block';
      setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 20);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      setTimeout(() => { item.style.display = 'none'; }, 200);
    }
  });
}

function openLightbox(index) {
  const visibleItems = Array.from(document.querySelectorAll('.gallery-grid .g-item')).filter(
    item => window.getComputedStyle(item).display !== 'none'
  );

  galleryImages = visibleItems.map(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.g-overlay span');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: cap ? cap.textContent : ''
    };
  });

  currentLightboxIndex = index < galleryImages.length ? index : 0;
  updateLightboxContent();

  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(e) {
  if (e && e.target && e.target.classList.contains('lb-content')) return;
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeLightbox(direction) {
  if (galleryImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  if (galleryImages.length === 0) return;
  const cur = galleryImages[currentLightboxIndex];
  const imgEl = document.getElementById('lightboxImg');
  const capEl = document.getElementById('lightboxCaption');
  const numEl = document.getElementById('lightboxIndex');

  if (imgEl) imgEl.src = cur.src;
  if (capEl) capEl.textContent = cur.caption || cur.alt;
  if (numEl) numEl.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

// Keyboard navigation for lightbox & modals
window.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeLightbox(1);
    if (e.key === 'ArrowLeft') changeLightbox(-1);
  }

  const vModal = document.getElementById('videoModal');
  if (vModal && vModal.classList.contains('active') && e.key === 'Escape') {
    closeVideoModal();
  }

  const rModal = document.getElementById('reelModal');
  if (rModal && rModal.classList.contains('active') && e.key === 'Escape') {
    closeReelModal();
  }
});

// -------------------------------------------------------------
// 5. MEDIA & UPLOAD STUDIO
// -------------------------------------------------------------
function switchMediaTab(tabName, btn) {
  document.querySelectorAll('.ms-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.ms-content').forEach(content => {
    content.style.display = 'none';
  });

  const activeContent = document.getElementById(`ms-tab-${tabName}`);
  if (activeContent) activeContent.style.display = 'block';
}

function addYouTubeVideo(e) {
  e.preventDefault();
  const urlInput = document.getElementById('ytUrl');
  const titleInput = document.getElementById('ytTitle');
  const creatorInput = document.getElementById('ytCreator');

  const url = urlInput.value.trim();
  const title = titleInput.value.trim();
  const creator = creatorInput.value.trim();

  // Extract YouTube ID
  let videoId = '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    showToast('Please enter a valid YouTube URL (youtube.com or youtu.be)');
    return;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Create new video card and prepend to YouTube showcase
  const grid = document.querySelector('.yt-showcase-grid');
  if (grid) {
    const newCard = document.createElement('div');
    newCard.className = 'yt-card user-added-yt';
    newCard.onclick = () => openVideoModal(embedUrl, title);
    newCard.innerHTML = `
      <div class="yt-thumb-wrap">
        <img src="${thumbUrl}" alt="${title}" class="yt-thumb" onerror="this.src='images/banasura_hero.jpg'"/>
        <div class="yt-play-btn"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
        <span class="yt-duration">User Video</span>
      </div>
      <div class="yt-card-body">
        <span class="yt-cat">Shared by Trekker</span>
        <h3>${title}</h3>
        <p>Uploaded by ${creator} &bull; Conquering Banasura Peak with Bootpaths.</p>
      </div>
    `;
    grid.prepend(newCard);
  }

  showToast('✓ Video successfully added to the adventure showcase!');
  urlInput.value = '';
  titleInput.value = '';
  creatorInput.value = '';
}

function addInstagramReel(e) {
  e.preventDefault();
  const urlInput = document.getElementById('reelUrl');
  const captionInput = document.getElementById('reelCaption');
  const handleInput = document.getElementById('reelHandle');

  const caption = captionInput.value.trim();
  const handle = handleInput.value.trim().startsWith('@') ? handleInput.value.trim() : `@${handleInput.value.trim()}`;

  showToast(`✓ Reel submitted from ${handle}: "${caption.slice(0, 30)}..."`);
  urlInput.value = '';
  captionInput.value = '';
  handleInput.value = '';
}

function handleVideoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    showToast('Please select a valid MP4, MOV or WebM video file.');
    return;
  }

  const fileUrl = URL.createObjectURL(file);
  const wrap = document.getElementById('localPlayerWrap');
  if (wrap) {
    wrap.innerHTML = `
      <div class="local-video-preview">
        <h4>Preview: ${file.name}</h4>
        <video controls autoplay loop playsinline src="${fileUrl}" style="width:100%; border-radius:12px; max-height:420px;"></video>
        <div style="margin-top:12px; display:flex; gap:10px;">
          <button type="button" class="btn-p" onclick="addLocalVideoToGrid('${fileUrl}', '${file.name}')">Add Video to Grid</button>
          <button type="button" class="btn-g" onclick="document.getElementById('localPlayerWrap').style.display='none'">Dismiss</button>
        </div>
      </div>
    `;
    wrap.style.display = 'block';
  }

  showToast(`✓ Selected video "${file.name}" ready for preview!`);
}

function addLocalVideoToGrid(videoUrl, fileName) {
  const grid = document.querySelector('.yt-showcase-grid');
  if (grid) {
    const card = document.createElement('div');
    card.className = 'yt-card user-added-local';
    card.innerHTML = `
      <div class="yt-thumb-wrap">
        <video src="${videoUrl}" style="width:100%; height:220px; object-fit:cover; border-radius:12px;" controls playsinline></video>
      </div>
      <div class="yt-card-body">
        <span class="yt-cat">Local Trek Video</span>
        <h3>${fileName}</h3>
        <p>Live preview footage loaded from your device.</p>
      </div>
    `;
    grid.prepend(card);
    showToast('✓ Local video added to the page showcase!');
  }
}

function copyCode(boxId) {
  const box = document.getElementById(boxId);
  if (box) {
    const pre = box.querySelector('pre');
    const textToCopy = pre ? pre.innerText : box.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('✓ HTML snippet copied to clipboard!');
    }).catch(() => {
      showToast('Press Ctrl+C to copy snippet');
    });
  }
}

// -------------------------------------------------------------
// 6. VIDEO & REEL MODALS
// -------------------------------------------------------------
function openVideoModal(embedUrl, title) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const titleEl = document.getElementById('videoModalTitle');

  if (iframe) iframe.src = embedUrl;
  if (titleEl) titleEl.textContent = title;
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal(e) {
  if (e && e.target && e.target.classList.contains('vm-content')) return;
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');

  if (iframe) iframe.src = '';
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openReelModal(imgSrc, handle, caption) {
  const modal = document.getElementById('reelModal');
  const img = document.getElementById('reelFallbackImg');
  const video = document.getElementById('reelVideoPlayer');
  const handleEl = document.getElementById('reelModalHandle');
  const captionEl = document.getElementById('reelModalCaption');

  if (video) video.style.display = 'none';
  if (img) {
    img.src = imgSrc;
    img.style.display = 'block';
  }
  if (handleEl) handleEl.textContent = handle;
  if (captionEl) captionEl.textContent = caption;

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeReelModal(e) {
  if (e && e.target && e.target.classList.contains('rm-content')) return;
  const modal = document.getElementById('reelModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// -------------------------------------------------------------
// 7. BOOKING CALCULATOR & FORM
// -------------------------------------------------------------
function calculateBookingTotal() {
  const trekkersSelect = document.getElementById('bTrekkers');
  const packageSelect = document.getElementById('bPackage');
  const countEl = document.getElementById('calcCount');
  const subtotalEl = document.getElementById('calcSubtotal');
  const totalEl = document.getElementById('calcTotal');

  const count = parseInt(trekkersSelect ? trekkersSelect.value : '2', 10) || 2;
  const unitPrice = parseInt(packageSelect ? packageSelect.value : '3999', 10) || 3999;
  const total = count * unitPrice;

  if (countEl) countEl.textContent = count;
  if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const email = document.getElementById('bEmail').value.trim();
  const date = document.getElementById('bDate').value;
  const trekkers = document.getElementById('bTrekkers').value;
  const pkgSelect = document.getElementById('bPackage');
  const pkgText = pkgSelect.options[pkgSelect.selectedIndex].text;
  const notes = document.getElementById('bNotes').value.trim();

  const total = parseInt(pkgSelect.value, 10) * parseInt(trekkers, 10);

  const message = `*Hi Bootpaths, I would like to book the Banasura Peak Trek!*

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Preferred Date:* ${date}
*Trekkers:* ${trekkers}
*Package:* ${pkgText}
*Estimated Total:* ₹${total.toLocaleString()}
*Special Notes:* ${notes || 'None'}

Please confirm availability of Forest Permits and send booking details.`;

  const waUrl = `https://wa.me/919446102200?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// -------------------------------------------------------------
// 8. TOAST NOTIFICATION UTILITY
// -------------------------------------------------------------
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
}
