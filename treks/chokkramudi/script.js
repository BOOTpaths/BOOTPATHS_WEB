/* ==========================================
   BOOTPATHS — CHOKKRAMUDI TREK PAGE SCRIPT
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

/* --- Main Itinerary Accordions (Quick & Detailed) with Mutual Auto-Close --- */
function toggleMainAccordion(header) {
  const item = header.closest('.main-accordion-item');
  if (!item) return;

  const wasOpen = item.classList.contains('open');

  document.querySelectorAll('.main-accordion-item').forEach(acc => {
    acc.classList.remove('open');
  });

  if (!wasOpen) {
    item.classList.add('open');
  }
}

/* --- Stage Tab Switcher in 'How Does Each Stage Look' --- */
function switchDayTab(stageNum) {
  const buttons = document.querySelectorAll('.day-tab-btn');
  buttons.forEach((btn, index) => {
    if (index + 1 === stageNum) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      btn.classList.remove('active');
    }
  });

  const panels = document.querySelectorAll('.day-panel');
  panels.forEach(panel => {
    if (panel.id === `day-panel-${stageNum}`) {
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
  const lb = document.getElementById('lb');
  if (lb) lb.classList.remove('active');
  const lbImg = document.getElementById('lb-img');
  if (lbImg) lbImg.src = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cl();
    closeReelPlayer();
    closeMediaUploadModal();
  }
});

/* --- Scroll-triggered fade-up animations --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.hlc, .ii, .fqi, .iec, .gi, .qi, .fact, .reel-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 70 + 'ms';
  observer.observe(el);
});

/* --- Smooth active nav link highlighting --- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* ==========================================
   MEDIA HUB (INSTAGRAM REELS & YOUTUBE)
   ========================================== */

function switchMediaTab(type) {
  const btnReels = document.getElementById('tabBtnReels');
  const btnYt = document.getElementById('tabBtnYoutube');
  const panelReels = document.getElementById('panelReels');
  const panelYt = document.getElementById('panelYoutube');

  if (type === 'reels') {
    btnReels.classList.add('active');
    btnYt.classList.remove('active');
    panelReels.classList.add('active');
    panelYt.classList.remove('active');
  } else {
    btnYt.classList.add('active');
    btnReels.classList.remove('active');
    panelYt.classList.add('active');
    panelReels.classList.remove('active');
  }
}

/* --- Reel Video Modal Player --- */
function openReelPlayer(posterSrc, title, author, caption) {
  const modal = document.getElementById('reelPlayerModal');
  const container = document.getElementById('rpContainer');
  const rpTitle = document.getElementById('rpTitle');
  const rpAuthor = document.getElementById('rpAuthor');
  const rpCaption = document.getElementById('rpCaption');

  rpTitle.textContent = title || 'Chokkramudi Reel';
  rpAuthor.textContent = author || '@bootpaths';
  rpCaption.textContent = caption || '';

  container.innerHTML = `
    <div style="width:100%; height:100%; position:relative; overflow:hidden; background:#000;">
      <img src="${posterSrc}" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" alt="${title}"/>
      <div style="position:absolute; inset:0; background:linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.4) 100%);"></div>
      
      <!-- Center Playing Indicator -->
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; color:#fff;">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--orange); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; box-shadow:0 0 25px rgba(249,115,22,0.6);">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <span style="font-weight:700; font-size:0.95rem; text-shadow:0 2px 4px rgba(0,0,0,0.8);">Playing Reel Stream</span>
      </div>

      <!-- Bottom Audio Wave -->
      <div style="position:absolute; bottom:20px; left:20px; right:20px; display:flex; align-items:center; justify-content:space-between; color:#fff;">
        <span style="font-size:0.8rem; opacity:0.85;">🔊 Western Ghats Ambient Audio</span>
        <span style="font-size:0.75rem; background:rgba(255,255,255,0.2); padding:3px 8px; border-radius:12px;">HD 1080p</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeReelPlayer() {
  const modal = document.getElementById('reelPlayerModal');
  if (modal) modal.classList.remove('active');
  const container = document.getElementById('rpContainer');
  if (container) container.innerHTML = '';
  document.body.style.overflow = '';
}

/* --- Media Upload & Embed Modal --- */
let activeMediaType = 'reel';

function openMediaUploadModal() {
  const modal = document.getElementById('mediaUploadModal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMediaUploadModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('mediaUploadModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function setMediaType(type) {
  activeMediaType = type;
  const btnReel = document.getElementById('srcBtnReel');
  const btnYt = document.getElementById('srcBtnYoutube');
  const btnUp = document.getElementById('srcBtnUpload');
  const urlGroup = document.getElementById('mediaUrlGroup');
  const fileGroup = document.getElementById('mediaFileGroup');
  const urlLabel = document.getElementById('mediaUrlLabel');
  const urlInput = document.getElementById('mediaUrl');

  [btnReel, btnYt, btnUp].forEach(b => b.classList.remove('active'));

  if (type === 'reel') {
    btnReel.classList.add('active');
    urlGroup.style.display = 'block';
    fileGroup.style.display = 'none';
    urlLabel.textContent = 'Instagram Reel URL (e.g. https://www.instagram.com/reel/...)';
    urlInput.placeholder = 'https://www.instagram.com/reel/Cx94J...';
    urlInput.required = true;
  } else if (type === 'youtube') {
    btnYt.classList.add('active');
    urlGroup.style.display = 'block';
    fileGroup.style.display = 'none';
    urlLabel.textContent = 'YouTube Video URL or Embed ID';
    urlInput.placeholder = 'https://www.youtube.com/watch?v=... or youtu.be/...';
    urlInput.required = true;
  } else {
    btnUp.classList.add('active');
    urlGroup.style.display = 'none';
    fileGroup.style.display = 'block';
    urlInput.required = false;
  }
}

function handleMediaSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('mediaTitle').value;
  const author = document.getElementById('mediaAuthor').value;
  const url = document.getElementById('mediaUrl').value;
  const caption = document.getElementById('mediaCaption').value;
  const fileInput = document.getElementById('mediaFile');

  if (activeMediaType === 'reel') {
    const reelsGrid = document.getElementById('reelsGrid');
    const newCard = document.createElement('div');
    newCard.className = 'reel-card fade-up visible';
    
    const posters = ['images/cloud_sea.jpg', 'images/chokramudi_hero.jpg', 'images/nilgiri_tahr.jpg', 'images/shola_forest.jpg'];
    const chosenPoster = posters[Math.floor(Math.random() * posters.length)];

    newCard.innerHTML = `
      <img src="${chosenPoster}" alt="${title}" class="reel-poster" loading="lazy" />
      <div class="reel-overlay">
        <div class="reel-top-badges">
          <span class="reel-ig-badge"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg> Reel</span>
          <span class="reel-views">New ✨</span>
        </div>
        <div class="reel-center-play">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <div class="reel-bottom-info">
          <span class="reel-author">${author}</span>
          <p class="reel-caption">${title} — ${caption || 'Chokkramudi peak memories'}</p>
          <span class="reel-audio">🎵 Trail Beats &bull; Bootpaths Community</span>
        </div>
      </div>
    `;

    newCard.onclick = () => openReelPlayer(chosenPoster, title, author, caption);
    reelsGrid.insertBefore(newCard, reelsGrid.firstChild);
    switchMediaTab('reels');

  } else if (activeMediaType === 'youtube') {
    let embedSrc = url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      embedSrc = `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }

    const ytGrid = document.getElementById('ytFramesGrid');
    const newVf = document.createElement('div');
    newVf.className = 'vf';
    newVf.innerHTML = `<iframe src="${embedSrc}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    ytGrid.insertBefore(newVf, ytGrid.firstChild);
    switchMediaTab('youtube');

  } else if (activeMediaType === 'file') {
    const file = fileInput.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const reelsGrid = document.getElementById('reelsGrid');
      const newCard = document.createElement('div');
      newCard.className = 'reel-card fade-up visible';
      newCard.innerHTML = `
        <video src="${objectUrl}" class="reel-poster" muted loop playsinline></video>
        <div class="reel-overlay">
          <div class="reel-top-badges">
            <span class="reel-ig-badge">Uploaded Video</span>
            <span class="reel-views">Live 📹</span>
          </div>
          <div class="reel-center-play">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <div class="reel-bottom-info">
            <span class="reel-author">${author}</span>
            <p class="reel-caption">${title}</p>
          </div>
        </div>
      `;
      newCard.onclick = () => {
        const modal = document.getElementById('reelPlayerModal');
        const container = document.getElementById('rpContainer');
        document.getElementById('rpTitle').textContent = title;
        document.getElementById('rpAuthor').textContent = author;
        document.getElementById('rpCaption').textContent = caption;
        container.innerHTML = `<video src="${objectUrl}" controls autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video>`;
        modal.classList.add('active');
      };
      reelsGrid.insertBefore(newCard, reelsGrid.firstChild);
      switchMediaTab('reels');
    }
  }

  document.getElementById('mediaAddForm').reset();
  closeMediaUploadModal();
  alert('✨ Success! Your media has been added to the Chokkramudi gallery feed.');
}

console.log('🏔️ Bootpaths Chokkramudi Trek Page Initialized');
