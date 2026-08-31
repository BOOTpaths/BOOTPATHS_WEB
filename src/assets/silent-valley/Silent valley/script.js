/* ==========================================
   BOOTPATHS – SILENT VALLEY TREK JAVASCRIPT
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
  });

  // If clicked item was not open, open it
  if (!isOpen) {
    faqItem.classList.add('open');
  }
}

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
  button.classList.add('active');

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

// -------------------------------------------------------------
// 5. 3D REAL-TYPE ALTITUDE PROFILE (THREE.JS)
// -------------------------------------------------------------
const WAYPOINTS_3D = [
  { name: "Mukkali Base", alt: 658, altFt: 2158, day: "Day 1 (Morning)", o2: "98%", x: -42, y: 2.5, z: 10, labelY: 7.5, desc: "Silent Valley Forest Information Centre & safari jeep starting point in Mannarkkad." },
  { name: "Sairandhri Gate", alt: 1020, altFt: 3346, day: "Day 1 (Midday)", o2: "95%", x: -28, y: 5.5, z: 4, labelY: 10.5, desc: "Entrance gate to core national park zone with Forest Rest House & 100ft observation tower." },
  { name: "Kunthi River", alt: 920, altFt: 3018, day: "Day 1 (Afternoon)", o2: "96%", x: -14, y: 4.2, z: -2, labelY: 9.2, desc: "Crystal-clear Kunthipuzha river crossed via the historic suspension bridge under dense canopy." },
  { name: "Poochipara Trail", alt: 1150, altFt: 3772, day: "Day 2 (Morning)", o2: "94%", x: 2, y: 7.8, z: -6, labelY: 12.8, desc: "Virgin rainforest trek route lined with giant ferns, orchids, and endemic Lion-tailed Macaques." },
  { name: "Walakkad Base", alt: 1450, altFt: 4757, day: "Day 2 (Afternoon)", o2: "91%", x: 18, y: 11.2, z: -10, labelY: 16.2, desc: "Deep interior wilderness campsite surrounded by ancient shola forest and mountain streams." },
  { name: "Sispara Ridge", alt: 2206, altFt: 7237, day: "Day 3 (Peak)", o2: "85%", x: 32, y: 17.5, z: -14, labelY: 22.5, desc: "Historic mountain pass connecting Nilgiris and Kerala with breathtaking 360° views across the valley." },
  { name: "Anginda Peak", alt: 2383, altFt: 7818, day: "Day 3 (High Summit)", o2: "83%", x: 44, y: 21.0, z: -8, labelY: 26.0, desc: "Highest elevation point in the Silent Valley Nilgiri Biosphere rim overlooking virgin Western Ghats clouds." }
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
let trailCurve;

function init3DAltitudeProfile() {
  const canvas = document.getElementById('alt3dCanvas');
  const container = document.getElementById('altCanvasWrap');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 450;

  // Scene
  scene3D = new THREE.Scene();
  scene3D.background = new THREE.Color(0xf8fafc);
  scene3D.fog = new THREE.FogExp2(0xf8fafc, 0.006);

  // Camera
  camera3D = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera3D.position.set(0, 48, 88);
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
    let elevation = Math.pow(normX, 1.4) * 22;

    const riverDist = Math.abs(x - (-14));
    if (riverDist < 16) {
      elevation -= (1 - riverDist / 16) * 5;
    }

    const ridgeNoise = Math.sin(x * 0.12) * Math.cos(z * 0.15) * 3.5 + Math.sin(x * 0.05 + z * 0.07) * 4.0;
    const sideElevation = (Math.abs(z) / (depth * 0.5)) * 6.5;

    pos.setY(i, Math.max(0, elevation + ridgeNoise + sideElevation));
  }
  geometry.computeVertexNormals();

  const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true
  });

  const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  terrainGroup.add(terrainMesh);

  // Crystal river ribbon
  const riverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-45, 1.5, 25),
    new THREE.Vector3(-30, 2.0, 12),
    new THREE.Vector3(-14, 2.2, -2),
    new THREE.Vector3(-5, 2.6, -18),
    new THREE.Vector3(5, 3.2, -30)
  ]);
  const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.2, 8, false);
  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });
  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  terrainGroup.add(riverMesh);
}

function build3DExtrudedProfile() {
  profileGroup.visible = false;

  const shape = new THREE.Shape();
  shape.moveTo(-45, 0);

  WAYPOINTS_3D.forEach((wp) => {
    shape.lineTo(wp.x, wp.y);
  });
  shape.lineTo(48, 0);
  shape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 14,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 3
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.position.y = 8;

  const material = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
    metalness: 0.2
  });

  const profileMesh = new THREE.Mesh(geometry, material);
  profileGroup.add(profileMesh);
}

function build3DTrailPath() {
  const points = WAYPOINTS_3D.map(wp => new THREE.Vector3(wp.x, wp.y + 0.8, wp.z));
  trailCurve = new THREE.CatmullRomCurve3(points);

  const tubeGeo = new THREE.TubeGeometry(trailCurve, 100, 0.4, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0xea580c,
    emissiveIntensity: 0.3
  });

  trailLine = new THREE.Mesh(tubeGeo, tubeMat);
  terrainGroup.add(trailLine);
}

function build3DWaypoints() {
  waypointObjects = [];

  WAYPOINTS_3D.forEach((wp, index) => {
    const wpGroup = new THREE.Group();
    wpGroup.position.set(wp.x, wp.y + 0.8, wp.z);

    const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8);
    const stemMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 1.75;
    wpGroup.add(stem);

    const isPeak = index >= WAYPOINTS_3D.length - 2;
    const pinColor = isPeak ? 0xe11d48 : 0xf97316;
    const sphereGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: pinColor,
      emissive: pinColor,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 3.8;
    sphere.userData = { waypointIndex: index };
    wpGroup.add(sphere);

    const ringGeo = new THREE.RingGeometry(0.9, 1.4, 16);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: pinColor, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.2;
    wpGroup.add(ring);

    terrainGroup.add(wpGroup);
    waypointObjects.push(sphere);
  });
}

function setup3DInteraction(canvas, container) {
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd);

  canvas.addEventListener('wheel', onMouseWheel, { passive: false });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera3D);
    const intersects = raycaster.intersectObjects(waypointObjects);

    if (intersects.length > 0) {
      const wpIdx = intersects[0].object.userData.waypointIndex;
      focus3DWaypoint(wpIdx);
    }
  });
}

function onMouseDown(e) {
  isDragging = true;
  isAutoRotating = false;
  updateRotateBtnIcon();
  previousMousePosition = { x: e.clientX, y: e.clientY };
  const hint = document.getElementById('altDragHint');
  if (hint) hint.style.opacity = '0';
}

function onMouseMove(e) {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  targetRotation.y += deltaX * 0.008;
  targetRotation.x = Math.max(0.15, Math.min(Math.PI / 2.2, targetRotation.x + deltaY * 0.008));

  previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseUp() {
  isDragging = false;
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    isAutoRotating = false;
    updateRotateBtnIcon();
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}

function onTouchMove(e) {
  if (isDragging && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    // Prevent default only when dragging primarily horizontally to rotate
    if (Math.abs(deltaX) > Math.abs(deltaY) * 0.8) {
      e.preventDefault();
      targetRotation.y += deltaX * 0.01;
      targetRotation.x = Math.max(0.15, Math.min(Math.PI / 2.2, targetRotation.x + deltaY * 0.01));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }
}

function onTouchEnd() {
  isDragging = false;
}

function onMouseWheel(e) {
  e.preventDefault();
  targetCameraDistance = Math.max(45, Math.min(130, targetCameraDistance + e.deltaY * 0.06));
}

function on3DWindowResize() {
  const container = document.getElementById('altCanvasWrap');
  if (!container || !camera3D || !renderer3D) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera3D.aspect = width / height;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(width, height);
}

function set3DMode(mode) {
  current3DMode = mode;
  document.getElementById('btnModeTerrain').classList.toggle('active', mode === 'terrain');
  document.getElementById('btnModeProfile').classList.toggle('active', mode === 'profile');

  terrainGroup.visible = (mode === 'terrain');
  profileGroup.visible = (mode === 'profile');
}

function toggle3DRotate() {
  isAutoRotating = !isAutoRotating;
  updateRotateBtnIcon();
}

function updateRotateBtnIcon() {
  const icon = document.getElementById('rotateIcon');
  if (icon) {
    icon.textContent = isAutoRotating ? '⏸️' : '▶️';
  }
}

function reset3DCamera() {
  targetRotation = { x: 0.38, y: -0.45 };
  targetCameraDistance = 85;
  isAutoRotating = true;
  updateRotateBtnIcon();
}

function focus3DWaypoint(index) {
  const wp = WAYPOINTS_3D[index];
  if (!wp) return;

  const pills = document.querySelectorAll('.aw-btn');
  pills.forEach((p, idx) => {
    p.classList.toggle('active', idx === index);
  });

  const hud = document.getElementById('altHudTooltip');
  if (hud) {
    document.getElementById('hudDay').textContent = wp.day;
    document.getElementById('hudName').textContent = wp.name;
    document.getElementById('hudAlt').textContent = `${wp.alt} m (${wp.altFt} ft)`;
    document.getElementById('hudO2').textContent = `~${wp.o2} sea level`;
    document.getElementById('hudDesc').textContent = wp.desc;
    hud.style.opacity = '1';
    hud.style.pointerEvents = 'auto';
  }

  targetRotation.y = -Math.atan2(wp.x, wp.z) - 0.2;
  targetCameraDistance = 65;
}

function animate3D() {
  requestAnimationFrame(animate3D);

  if (isAutoRotating) {
    targetRotation.y += 0.0035;
  }

  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
  cameraDistance += (targetCameraDistance - cameraDistance) * 0.08;

  const cx = cameraDistance * Math.sin(currentRotation.y) * Math.cos(currentRotation.x);
  const cy = cameraDistance * Math.sin(currentRotation.x) + 6;
  const cz = cameraDistance * Math.cos(currentRotation.y) * Math.cos(currentRotation.x);

  camera3D.position.set(cx, cy, cz);
  camera3D.lookAt(0, 8, 0);

  renderer3D.render(scene3D, camera3D);
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
  const msg = document.getElementById('msg') ? document.getElementById('msg').value : '';

  const message = `Hi Bootpaths, I would like to book the Silent Valley Rainforest Trek.\n\nName: ${fn} ${ln}\nPhone: ${ph}\nEmail: ${em}\nDate: ${dt}\nTrekkers: ${tr}\nNotes: ${msg}`;

  const waUrl = `https://wa.me/919446102200?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// Initialize 3D on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DAltitudeProfile);
} else {
  init3DAltitudeProfile();
}
