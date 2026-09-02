/* ==========================================
   BOOTPATHS – MEESHAPULIMALA TREK JAVASCRIPT
   INTERACTIVE 3D ELEVATION TOPOGRAPHY & UX
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

  // Sticky Navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
});

// -------------------------------------------------------------
// 2. ACCORDIONS (ITINERARY & FAQS) - AUTO-COLLAPSE SIBLINGS
// -------------------------------------------------------------
function toggleMainAccordion(headerElement) {
  const accordionItem = headerElement.closest('.main-accordion-item');
  if (!accordionItem) return;

  const isOpen = accordionItem.classList.contains('open');

  // Close all other main accordion items (automatically undrop them)
  document.querySelectorAll('.main-accordion-item').forEach(item => {
    item.classList.remove('open');
  });

  // If clicked item was not open, open it
  if (!isOpen) {
    accordionItem.classList.add('open');
    // Scroll header into view smoothly on mobile/tablet
    setTimeout(() => {
      accordionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }
}

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
  const faqCard = headerElement.closest('.faq-card');
  if (!faqCard) return;

  const isOpen = faqCard.classList.contains('open');

  // Close all other FAQ cards
  document.querySelectorAll('.faq-card').forEach(card => {
    card.classList.remove('open');
  });

  // If clicked item was not open, open it
  if (!isOpen) {
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
// 4. GALLERY FILTER & LIGHTBOX MODAL
// -------------------------------------------------------------
let currentLightboxIndex = 0;
let galleryImages = [];

function filterGallery(category, btnElement) {
  const buttons = document.querySelectorAll('.gb');
  buttons.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

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
    return { src: img.src, alt: img.alt, caption: cap };
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

// Keyboard navigation for lightbox
window.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeLightbox(1);
    if (e.key === 'ArrowLeft') changeLightbox(-1);
  }
});

// -------------------------------------------------------------
// 5. 3D REAL-TYPE ALTITUDE PROFILE (THREE.JS)
// -------------------------------------------------------------
const WAYPOINTS_3D = [
  { name: "KFDC Munnar Basecamp", alt: 1850, altFt: 6069, day: "Day 1 (11:00 AM)", o2: "82%", x: -44, y: 3.0, z: 12, labelY: 8.0, desc: "Registration, trek briefing, and 4x4 off-road safari jeep pick-up near Mattupetty/Suryanelli." },
  { name: "Forest Checkpost", alt: 1980, altFt: 6496, day: "Day 1 (1:30 PM)", o2: "81%", x: -30, y: 5.5, z: 6, labelY: 10.5, desc: "Official Kerala Forest Department entry barrier and boundary of the protected high-altitude Shola sanctuary." },
  { name: "Rhodo Valley Basecamp", alt: 2160, altFt: 7086, day: "Day 1 (3:30 PM)", o2: "79%", x: -14, y: 8.5, z: 0, labelY: 13.5, desc: "Highest motorable campsite in South India surrounded by flowering red Rhododendron arboreum trees & stream." },
  { name: "Pandava Cave", alt: 2300, altFt: 7545, day: "Day 2 (5:15 AM)", o2: "78%", x: 2, y: 12.0, z: -5, labelY: 17.0, desc: "Legendary ancient granite rock shelter where the Pandavas are said to have rested during their forest exile." },
  { name: "Peak 4 Ridge", alt: 2450, altFt: 8038, day: "Day 2 (6:00 AM)", o2: "76%", x: 18, y: 15.5, z: -8, labelY: 20.5, desc: "Midway traverse across the undulating 8 tiger-whisker peaks with sweeping views of Suryanelli and Anayirankal." },
  { name: "Peak 7 Shoulder", alt: 2560, altFt: 8398, day: "Day 2 (6:30 AM)", o2: "75%", x: 32, y: 18.5, z: -10, labelY: 23.5, desc: "Steep final ridge climb bordering Kerala and Tamil Nadu, emerging directly over the boundless sea of clouds." },
  { name: "Meeshapulimala Summit", alt: 2640, altFt: 8661, day: "Day 2 (7:00 AM Sunrise)", o2: "74%", x: 44, y: 22.0, z: -6, labelY: 27.0, desc: "The crowning peak of Meeshapulimala! South India's highest trekkable summit, famous for 'mist of Charlie' & 360° panoramas." }
];

let scene3D, camera3D, renderer3D, terrainGroup, profileGroup, trailLine, beaconMesh;
let waypointObjects = [], spriteLabels = [];
let isAutoRotating = true;
let current3DMode = 'terrain';
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0.38, y: -0.45 };
let currentRotation = { x: 0.38, y: -0.45 };
let cameraDistance = 85;
let targetCameraDistance = 85;

function init3DAltitudeProfile() {
  const canvas = document.getElementById('alt3dCanvas');
  const container = document.getElementById('altCanvasWrap');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = container.clientHeight || 480;

  // Scene setup
  scene3D = new THREE.Scene();
  scene3D.background = new THREE.Color(0xf8fafc);
  scene3D.fog = new THREE.FogExp2(0xf8fafc, 0.006);

  // Camera
  camera3D = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera3D.position.set(0, 45, cameraDistance);
  camera3D.lookAt(0, 10, 0);

  // Renderer
  renderer3D = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer3D.setSize(width, height);
  renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer3D.shadowMap.enabled = true;
  renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene3D.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 1.3);
  sunLight.position.set(50, 90, 40);
  sunLight.castShadow = true;
  scene3D.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x059669, 0.4);
  fillLight.position.set(-50, 40, -40);
  scene3D.add(fillLight);

  terrainGroup = new THREE.Group();
  profileGroup = new THREE.Group();
  scene3D.add(terrainGroup);
  scene3D.add(profileGroup);

  // Build Terrain
  build3DMountainTerrain();
  build3DExtrudedProfile();

  // Trail line
  build3DTrailPath();

  // Waypoints
  build3DWaypoints();

  // Event Listeners for 3D interactions
  setup3DInteraction(canvas, container);

  // Start Animation Loop
  animate3D();

  // Resize handler
  window.addEventListener('resize', on3DWindowResize);
}

function build3DMountainTerrain() {
  const width = 110;
  const depth = 65;
  const segX = 90;
  const segZ = 55;

  const geometry = new THREE.PlaneGeometry(width, depth, segX, segZ);
  geometry.rotateX(-Math.PI / 2);

  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    const normX = (x + 55) / 110;
    let elevation = Math.pow(normX, 1.35) * 22;

    // Valley depression near Rhodo Valley
    const valleyDist = Math.abs(x - (-14));
    if (valleyDist < 16) {
      elevation -= (1 - valleyDist / 16) * 4;
    }

    // 8 undulating peaks ridge harmonics
    const ridgeNoise = Math.sin(x * 0.22) * Math.cos(z * 0.18) * 3.8 + Math.sin(x * 0.08 + z * 0.1) * 3.5;
    const sideElevation = (Math.abs(z) / (depth * 0.5)) * 6.0;

    pos.setY(i, Math.max(0, elevation + ridgeNoise + sideElevation));
  }
  geometry.computeVertexNormals();

  const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true
  });

  const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  terrainGroup.add(terrainMesh);

  // Wireframe grid overlay for topographic contour effect
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.09
  });
  const wireMesh = new THREE.Mesh(geometry, wireMat);
  terrainGroup.add(wireMesh);

  // Sea of clouds layer
  const cloudGeo = new THREE.PlaneGeometry(120, 80);
  cloudGeo.rotateX(-Math.PI / 2);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.65,
    roughness: 0.95
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  cloudMesh.position.set(10, 6.0, 0);
  terrainGroup.add(cloudMesh);
}

function build3DExtrudedProfile() {
  const profileShape = new THREE.Shape();
  profileShape.moveTo(-45, 0);

  WAYPOINTS_3D.forEach((wp) => {
    profileShape.lineTo(wp.x, wp.y);
  });

  profileShape.lineTo(46, 0);
  profileShape.lineTo(-45, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 14,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 0.8,
    bevelSegments: 3
  };

  const geo = new THREE.ExtrudeGeometry(profileShape, extrudeSettings);
  geo.center();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    metalness: 0.25,
    roughness: 0.5,
    flatShading: true
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 11, 0);
  profileGroup.add(mesh);

  profileGroup.visible = false;
}

function build3DTrailPath() {
  const points = WAYPOINTS_3D.map(wp => new THREE.Vector3(wp.x, wp.y + 0.8, wp.z));
  const curve = new THREE.CatmullRomCurve3(points);
  const trailGeo = new THREE.TubeGeometry(curve, 64, 0.45, 8, false);
  const trailMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.6,
    roughness: 0.3
  });

  trailLine = new THREE.Mesh(trailGeo, trailMat);
  terrainGroup.add(trailLine);
}

function build3DWaypoints() {
  waypointObjects = [];
  spriteLabels = [];

  WAYPOINTS_3D.forEach((wp, index) => {
    // Waypoint Sphere Marker
    const isSummit = index === WAYPOINTS_3D.length - 1;
    const size = isSummit ? 1.6 : 1.1;
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: isSummit ? 0xe11d48 : 0xf97316,
      emissive: isSummit ? 0x9f1239 : 0xc2410c,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });

    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(wp.x, wp.y + 1.2, wp.z);
    sphere.userData = { index: index, waypoint: wp };
    terrainGroup.add(sphere);
    waypointObjects.push(sphere);

    // Subtle Ground Pin Stem
    const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, wp.y + 1.2, 8);
    const stemMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(wp.x, (wp.y + 1.2) / 2, wp.z);
    terrainGroup.add(stem);

    // Canvas-based Sprite Label
    const sprite = makeTextSprite(`${wp.name} (${wp.alt}m)`);
    sprite.position.set(wp.x, wp.y + wp.labelY, wp.z);
    terrainGroup.add(sprite);
    spriteLabels.push(sprite);
  });

  // Glowing beacon ring around summit
  const summit = WAYPOINTS_3D[WAYPOINTS_3D.length - 1];
  const ringGeo = new THREE.RingGeometry(2.0, 2.6, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  beaconMesh = new THREE.Mesh(ringGeo, ringMat);
  beaconMesh.position.set(summit.x, summit.y + 1.3, summit.z);
  terrainGroup.add(beaconMesh);
}

function makeTextSprite(message) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 376, 88, 16);
  ctx.fill();

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = 'Bold 28px Outfit, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, 192, 48);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(16, 4, 1);
  return sprite;
}

function setup3DInteraction(canvas, container) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    isDragging = true;
    isAutoRotating = false;
    previousMousePosition = {
      x: e.clientX || (e.touches && e.touches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0].clientY)
    };
    hideDragHint();
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.008;
    targetRotation.x += deltaY * 0.008;
    targetRotation.x = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotation.x));

    previousMousePosition = { x: clientX, y: clientY };
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;

    // Detect click vs drag
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    if (clientX && clientY) {
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera3D);
      const intersects = raycaster.intersectObjects(waypointObjects);

      if (intersects.length > 0) {
        const wp = intersects[0].object.userData.waypoint;
        const idx = intersects[0].object.userData.index;
        showWaypointHUD(wp, idx);
      }
    }
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetCameraDistance += e.deltaY * 0.06;
    targetCameraDistance = Math.max(45, Math.min(130, targetCameraDistance));
    hideDragHint();
  }, { passive: false });
}

function hideDragHint() {
  const hint = document.getElementById('altDragHint');
  if (hint) hint.style.opacity = '0';
}

function animate3D() {
  requestAnimationFrame(animate3D);

  // Smooth rotation
  if (isAutoRotating) {
    targetRotation.y += 0.0025;
  }

  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
  cameraDistance += (targetCameraDistance - cameraDistance) * 0.08;

  // Spherical camera positioning
  const cosX = Math.cos(currentRotation.x);
  camera3D.position.x = Math.sin(currentRotation.y) * cosX * cameraDistance;
  camera3D.position.y = Math.sin(currentRotation.x) * cameraDistance + 8;
  camera3D.position.z = Math.cos(currentRotation.y) * cosX * cameraDistance;
  camera3D.lookAt(0, 10, 0);

  // Pulse summit beacon
  if (beaconMesh) {
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
    beaconMesh.scale.set(scale, scale, scale);
  }

  renderer3D.render(scene3D, camera3D);
}

function on3DWindowResize() {
  const container = document.getElementById('altCanvasWrap');
  if (!container || !renderer3D || !camera3D) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 480;

  camera3D.aspect = width / height;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(width, height);
}

function set3DMode(mode) {
  current3DMode = mode;
  const btnTerrain = document.getElementById('btnModeTerrain');
  const btnProfile = document.getElementById('btnModeProfile');

  if (mode === 'terrain') {
    terrainGroup.visible = true;
    profileGroup.visible = false;
    if (btnTerrain) btnTerrain.classList.add('active');
    if (btnProfile) btnProfile.classList.remove('active');
  } else {
    terrainGroup.visible = false;
    profileGroup.visible = true;
    if (btnProfile) btnProfile.classList.add('active');
    if (btnTerrain) btnTerrain.classList.remove('active');
  }
}

function toggle3DRotate() {
  isAutoRotating = !isAutoRotating;
  const icon = document.getElementById('rotateIcon');
  if (icon) icon.textContent = isAutoRotating ? '⏸️' : '▶️';
}

function reset3DCamera() {
  targetRotation = { x: 0.38, y: -0.45 };
  targetCameraDistance = 85;
  isAutoRotating = true;
  const icon = document.getElementById('rotateIcon');
  if (icon) icon.textContent = '⏸️';
}

function focus3DWaypoint(index) {
  const wp = WAYPOINTS_3D[index];
  if (!wp) return;

  // Highlight pill
  const pills = document.querySelectorAll('.aw-btn');
  pills.forEach((p, idx) => {
    p.classList.toggle('active-selected', idx === index);
  });

  // Calculate target rotation to face the waypoint
  const angle = Math.atan2(wp.x, wp.z);
  targetRotation.y = angle;
  targetRotation.x = 0.32;
  targetCameraDistance = 65;
  isAutoRotating = false;

  showWaypointHUD(wp, index);
}

function showWaypointHUD(wp, index) {
  const hud = document.getElementById('altHudTooltip');
  if (!hud) return;

  document.getElementById('hudDay').textContent = wp.day;
  document.getElementById('hudName').textContent = wp.name;
  document.getElementById('hudAlt').textContent = `${wp.alt.toLocaleString()} m (${wp.altFt.toLocaleString()} ft)`;
  document.getElementById('hudO2').textContent = wp.o2;
  document.getElementById('hudDesc').textContent = wp.desc;

  hud.classList.add('active');
}

// -------------------------------------------------------------
// 6. INSTAGRAM REELS & MEDIA STUDIO INTERACTIONS
// -------------------------------------------------------------
function switchMediaTab(tabName, btn) {
  const buttons = document.querySelectorAll('.ms-tab-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const panels = document.querySelectorAll('.ms-tab-panel');
  panels.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`panel-${tabName}`);
  if (target) target.classList.add('active');
}

function toggleReelPlayback(card) {
  const video = card.querySelector('video');
  if (video) {
    if (video.paused) {
      video.play();
      card.classList.add('is-playing');
    } else {
      video.pause();
      card.classList.remove('is-playing');
    }
  } else {
    // If it is an image placeholder, toggle is-playing
    card.classList.toggle('is-playing');
  }
}

function addYouTubeVideo(e) {
  e.preventDefault();
  const urlInput = document.getElementById('ytUrlInput');
  const titleInput = document.getElementById('ytTitleInput');

  if (!urlInput || !urlInput.value.trim()) return;

  const raw = urlInput.value.trim();
  let videoId = '';

  const match = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  } else if (raw.length === 11) {
    videoId = raw;
  } else {
    showLiveFeedback('ytFeedback', 'Please enter a valid YouTube video URL or 11-character video ID.');
    return;
  }

  const container = document.getElementById('videoFramesContainer');
  if (container) {
    const vf = document.createElement('div');
    vf.className = 'vf';
    vf.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
              title="${titleInput.value || 'Meeshapulimala Trek Video'}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen loading="lazy"></iframe>
    `;
    container.prepend(vf);

    showLiveFeedback('ytFeedback', 'YouTube video successfully embedded into the showcase!');
    urlInput.value = '';
    titleInput.value = '';
  }
}

function addInstagramReel(e) {
  e.preventDefault();
  const linkInput = document.getElementById('reelLinkInput');
  const captionInput = document.getElementById('reelCaptionInput');
  const audioInput = document.getElementById('reelAudioInput');

  if (!linkInput || !linkInput.value.trim()) return;

  const raw = linkInput.value.trim();
  const caption = captionInput.value || 'Walking above the clouds at Meeshapulimala! ☁️✨ #Meeshapulimala #Bootpaths';
  const audio = audioInput.value || 'Original Audio – Munnar Mountain Mist';

  const container = document.getElementById('reelsContainer');
  if (container) {
    const card = document.createElement('div');
    card.className = 'reel-card';
    card.onclick = function() { toggleReelPlayback(this); };

    if (raw.includes('instagram.com')) {
      card.innerHTML = `
        <img src="images/meeshapulimala_summit.jpg" alt="Meeshapulimala Reel" class="reel-media"/>
        <div class="reel-play-indicator">▶</div>
        <div class="reel-overlay">
          <div class="reel-top">
            <span class="reel-badge">
              <svg viewBox="0 0 24 24" width="12" height="12"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
              Instagram Reel
            </span>
          </div>
          <div class="reel-bottom">
            <div class="reel-author">
              <img src="images/bootpaths_logo.png" alt="Bootpaths" class="reel-author-img"/>
              <span class="reel-handle">@bootpaths</span>
            </div>
            <p class="reel-caption">${caption}</p>
            <div class="reel-sound"><span>🎵</span> <span>${audio}</span></div>
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <video src="${raw}" class="reel-video" loop playsinline></video>
        <div class="reel-play-indicator">▶</div>
        <div class="reel-overlay">
          <div class="reel-top">
            <span class="reel-badge">Reel Preview</span>
          </div>
          <div class="reel-bottom">
            <div class="reel-author">
              <img src="images/bootpaths_logo.png" alt="Bootpaths" class="reel-author-img"/>
              <span class="reel-handle">@bootpaths</span>
            </div>
            <p class="reel-caption">${caption}</p>
            <div class="reel-sound"><span>🎵</span> <span>${audio}</span></div>
          </div>
        </div>
      `;
    }

    container.prepend(card);
    showLiveFeedback('reelFeedback', 'Instagram Reel added to live showcase grid!');
    linkInput.value = '';
    captionInput.value = '';
    audioInput.value = '';
  }
}

function handleVideoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const container = document.getElementById('reelsContainer');

  if (container) {
    const card = document.createElement('div');
    card.className = 'reel-card is-playing';
    card.onclick = function() { toggleReelPlayback(this); };
    card.innerHTML = `
      <video src="${url}" class="reel-video" autoplay loop playsinline></video>
      <div class="reel-play-indicator">▶</div>
      <div class="reel-overlay">
        <div class="reel-top">
          <span class="reel-badge">Uploaded Video</span>
        </div>
        <div class="reel-bottom">
          <div class="reel-author">
            <img src="images/bootpaths_logo.png" alt="Bootpaths" class="reel-author-img"/>
            <span class="reel-handle">@bootpaths</span>
          </div>
          <p class="reel-caption">Uploaded: ${file.name}</p>
          <div class="reel-sound"><span>🎵</span> <span>Original Audio</span></div>
        </div>
      </div>
    `;
    container.prepend(card);
    showLiveFeedback('uploadFeedback', `Successfully loaded "${file.name}" as an active reel preview!`);
  }
}

function showLiveFeedback(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.className = 'ms-live-feedback success';
    setTimeout(() => {
      el.style.display = 'none';
    }, 5000);
  }
}

function toggleCodeHelper(boxId) {
  const box = document.getElementById(boxId);
  if (box) {
    box.classList.toggle('show');
  }
}

function copyCode(boxId) {
  const box = document.getElementById(boxId);
  if (box) {
    const code = box.querySelector('pre') ? box.querySelector('pre').innerText : box.innerText;
    navigator.clipboard.writeText(code).then(() => {
      alert('HTML code snippet copied to clipboard!');
    });
  }
}

// -------------------------------------------------------------
// 7. BOOKING FORM & WHATSAPP REDIRECT
// -------------------------------------------------------------
function sf(event) {
  event.preventDefault();
  const fn = document.getElementById('fn') ? document.getElementById('fn').value : '';
  const ln = document.getElementById('ln') ? document.getElementById('ln').value : '';
  const em = document.getElementById('em') ? document.getElementById('em').value : '';
  const ph = document.getElementById('ph') ? document.getElementById('ph').value : '';
  const dt = document.getElementById('dt') ? document.getElementById('dt').value : '';
  const tr = document.getElementById('tr') ? document.getElementById('tr').value : '2';
  const pkg = document.getElementById('pkg') ? document.getElementById('pkg').value : 'Rhodo Valley Camp (2D/1N)';
  const msg = document.getElementById('msg') ? document.getElementById('msg').value : '';

  const message = `Hi Bootpaths, I would like to book the Meeshapulimala Trek.\n\nName: ${fn} ${ln}\nPhone: ${ph}\nEmail: ${em}\nDate: ${dt}\nTrekkers: ${tr}\nPackage: ${pkg}\nNotes: ${msg}`;

  const waUrl = `https://wa.me/919446102200?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// Initialize 3D on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DAltitudeProfile);
} else {
  init3DAltitudeProfile();
}
