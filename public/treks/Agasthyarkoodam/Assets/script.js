/* ==========================================================================
   BOOTPATHS — AGASTYARKOODAM TREK INTERACTIVE JAVASCRIPT
   Navbar, Accordions, Tabs, Gallery Lightbox, Form & 3D WebGL Terrain Engine
   ========================================================================== */

/* --- Navbar Scroll Effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* --- Mobile Hamburger Menu --- */
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

// Close menu on Escape key
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

/* --- Main Itinerary Accordions (Mutual Auto-Close) --- */
function toggleMainAccordion(header) {
  const item = header.closest('.main-accordion-item');
  if (!item) return;

  const wasOpen = item.classList.contains('open');

  // Close all accordions
  document.querySelectorAll('.main-accordion-item').forEach(acc => {
    acc.classList.remove('open');
  });

  // Open clicked one if it was closed
  if (!wasOpen) {
    item.classList.add('open');
  }
}

/* --- Detailed Day Tab Switcher --- */
function switchDayTab(dayNum) {
  const buttons = document.querySelectorAll('.day-tab-btn');
  buttons.forEach((btn, index) => {
    if (index + 1 === dayNum) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      btn.classList.remove('active');
    }
  });

  const panels = document.querySelectorAll('.day-panel');
  panels.forEach(panel => {
    if (panel.id === `day-panel-${dayNum}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

/* --- FAQ Accordion --- */
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
  lb.classList.remove('active');
  document.getElementById('lb-img').src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cl();
});

/* --- Booking Form Submission with WhatsApp Forwarding --- */
function sf(event) {
  event.preventDefault();
  const form = document.getElementById('bookForm');
  const btn = form.querySelector('.btn-sub');
  const ok = document.getElementById('fok');

  const name = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  const month = document.getElementById('bkMonth').value;
  const trekkers = document.getElementById('bkTrekkers').value;

  btn.textContent = 'Processing...';
  btn.disabled = true;

  const msg = `Hi Bootpaths, I would like to book the Agastyarkoodam Trek:%0A- Name: ${encodeURIComponent(name)}%0A- Phone: ${encodeURIComponent(phone)}%0A- Batch: ${encodeURIComponent(month)}%0A- Trekkers: ${encodeURIComponent(trekkers)}`;
  const waUrl = `https://wa.me/919446102200?text=${msg}`;

  setTimeout(() => {
    form.style.display = 'none';
    ok.style.display = 'block';
    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
  }, 1000);
}

/* --- Scroll Animations (IntersectionObserver) --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.hlc, .fact, .qi, .reach-card, .gi, .faq-item, .spec-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  observer.observe(el);
});

/* --- Active Nav Links On Scroll --- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* ==========================================================================
   3D REALTYPE ALTITUDE & TERRAIN ENGINE (THREE.JS)
   Interactive 3D Western Ghats Elevation Topography for Agastyarkoodam
   ========================================================================== */

const WAYPOINTS_3D = [
  { name: "Bonacaud Trailhead", alt: 450, altFt: 1476, day: "Day 1 (08:00 AM)", climate: "Estate foothills", x: -42, y: 1.5, z: 10, labelY: 5.5, desc: "Forest Picket Station & entry plastic audit checkpoint." },
  { name: "Karamanayar Stream", alt: 520, altFt: 1706, day: "Day 1 (10:00 AM)", climate: "Evergreen canopy", x: -30, y: 2.8, z: 6, labelY: 6.8, desc: "First crystal clear mountain stream crossing in the rainforest." },
  { name: "Vazhapanthiyar", alt: 680, altFt: 2230, day: "Day 1 (11:30 AM)", climate: "Moist deciduous", x: -18, y: 4.8, z: 2, labelY: 8.8, desc: "Second stream trail through lush bamboo brakes." },
  { name: "Attayar River Camp", alt: 750, altFt: 2460, day: "Day 1 (01:00 PM)", climate: "River valley", x: -6, y: 6.5, z: -2, labelY: 10.5, desc: "Major lunch resting point by sparkling mossy cascades." },
  { name: "Athirumala Base Camp", alt: 1000, altFt: 3280, day: "Day 1 & 2 (Overnight)", climate: "Misty highlands", x: 8, y: 10.2, z: -6, labelY: 14.2, desc: "Forest Department dormitory clearing guarded by trenches." },
  { name: "Pongalapara", alt: 1450, altFt: 4757, day: "Day 2 (08:30 AM)", climate: "Dwarf forest & ridge", x: 22, y: 15.6, z: -10, labelY: 19.6, desc: "Rocky ridge viewpoint where orchid dwarf forests give way to bare rock." },
  { name: "Fixed Rope Rock Walls", alt: 1720, altFt: 5643, day: "Day 2 (10:30 AM)", climate: "Sheer granite cliff", x: 34, y: 19.8, z: -12, labelY: 23.8, desc: "Technical near-vertical climb using heavy-duty forest safety ropes." },
  { name: "Agastyarkoodam Peak", alt: 1868, altFt: 6128, day: "Day 2 Summit (11:30 AM)", climate: "360° windswept peak", x: 44, y: 23.5, z: -14, labelY: 27.5, desc: "Kerala's 2nd highest summit with Sage Agastya shrine & Arabian Sea views." }
];

let scene3D, camera3D, renderer3D, terrainGroup, profileGroup, trailLine, beaconMesh, waypointObjects = [];
let isAutoRotating = true;
let current3DMode = 'terrain';
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0.35, y: -0.5 };
let currentRotation = { x: 0.35, y: -0.5 };

function init3DProfile() {
  const canvasWrap = document.getElementById('altCanvasWrap');
  const canvas = document.getElementById('alt3dCanvas');
  if (!canvas || !window.THREE) return;

  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;

  // Scene
  scene3D = new THREE.Scene();
  scene3D.fog = new THREE.FogExp2(0x0a1018, 0.009);

  // Camera
  camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera3D.position.set(0, 32, 72);
  camera3D.lookAt(0, 8, 0);

  // Renderer
  renderer3D = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer3D.setSize(width, height);
  renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer3D.shadowMap.enabled = true;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.85);
  scene3D.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
  dirLight.position.set(40, 60, 30);
  dirLight.castShadow = true;
  scene3D.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x0284c7, 0.6);
  fillLight.position.set(-40, 30, -30);
  scene3D.add(fillLight);

  // Groups
  terrainGroup = new THREE.Group();
  profileGroup = new THREE.Group();
  scene3D.add(terrainGroup);
  scene3D.add(profileGroup);
  profileGroup.visible = false;

  // Build Terrain Mesh (Agasthyamalai Western Ghats Mountain Ridge)
  buildTerrainMesh();

  // Build Trail Path and Waypoints
  buildTrailAndWaypoints();

  // Interaction Listeners
  setupCanvasEvents(canvasWrap);

  // Resize listener
  window.addEventListener('resize', on3DResize);

  // Focus Default Waypoint (Peak)
  focus3DWaypoint(7);

  // Animation Loop
  animate3D();
}

function buildTerrainMesh() {
  const geom = new THREE.PlaneGeometry(110, 65, 80, 50);
  geom.rotateX(-Math.PI / 2);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const pz = pos.getZ(i);

    // Height elevation formula mimicking Agasthyarkoodam ridge
    let h = Math.sin((px + 50) * 0.05) * 4.5 + Math.cos(pz * 0.08) * 3;
    if (px > 0) {
      h += Math.pow((px + 10) / 45, 2.2) * 14;
    }
    // High conical peak at top right
    const distToPeak = Math.hypot(px - 44, pz - (-14));
    if (distToPeak < 18) {
      h += Math.cos((distToPeak / 18) * (Math.PI / 2)) * 10.5;
    }
    pos.setY(i, Math.max(0, h));
  }
  geom.computeVertexNormals();

  // Material with lush emerald gradient look
  const mat = new THREE.MeshStandardMaterial({
    color: 0x153e2d,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true,
    wireframe: false
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  const terrainMesh = new THREE.Mesh(geom, mat);
  const wireMesh = new THREE.Mesh(geom, wireMat);
  terrainGroup.add(terrainMesh);
  terrainGroup.add(wireMesh);
}

function buildTrailAndWaypoints() {
  const points = WAYPOINTS_3D.map(wp => new THREE.Vector3(wp.x, wp.y + 0.4, wp.z));
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.4, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
    roughness: 0.3
  });
  trailLine = new THREE.Mesh(tubeGeom, tubeMat);
  terrainGroup.add(trailLine);

  // Animated Beacon for Selected Waypoint
  const beaconGeom = new THREE.RingGeometry(0.8, 1.4, 24);
  beaconGeom.rotateX(-Math.PI / 2);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
  terrainGroup.add(beaconMesh);

  // Waypoint Markers
  WAYPOINTS_3D.forEach((wp, idx) => {
    // Pin Sphere
    const pinGeom = new THREE.SphereGeometry(idx === 7 ? 1.1 : 0.75, 16, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: idx === 7 ? 0xf59e0b : 0x10b981,
      emissive: idx === 7 ? 0xb45309 : 0x059669,
      emissiveIntensity: 0.7
    });
    const pin = new THREE.Mesh(pinGeom, pinMat);
    pin.position.set(wp.x, wp.y + 0.8, wp.z);
    pin.userData = { index: idx };
    terrainGroup.add(pin);
    waypointObjects.push(pin);

    // Stem Line to ground
    const stemGeom = new THREE.CylinderGeometry(0.1, 0.1, wp.y, 8);
    const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.set(wp.x, wp.y / 2, wp.z);
    terrainGroup.add(stem);
  });
}

function setupCanvasEvents(canvasWrap) {
  canvasWrap.addEventListener('mousedown', (e) => {
    isDragging = true;
    isAutoRotating = false;
    document.getElementById('rotateIcon').textContent = '▶️';
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.008;
    targetRotation.x = Math.max(0.1, Math.min(0.85, targetRotation.x + deltaY * 0.008));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch support
  canvasWrap.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      isAutoRotating = false;
      document.getElementById('rotateIcon').textContent = '▶️';
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.008;
    targetRotation.x = Math.max(0.1, Math.min(0.85, targetRotation.x + deltaY * 0.008));

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
}

function on3DResize() {
  const canvasWrap = document.getElementById('altCanvasWrap');
  if (!canvasWrap || !renderer3D || !camera3D) return;
  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;
  camera3D.aspect = width / height;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(width, height);
}

function animate3D() {
  requestAnimationFrame(animate3D);

  if (isAutoRotating) {
    targetRotation.y += 0.0025;
  }

  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

  if (terrainGroup) {
    terrainGroup.rotation.x = currentRotation.x;
    terrainGroup.rotation.y = currentRotation.y;
  }

  // Beacon pulse
  if (beaconMesh) {
    const s = 1 + Math.sin(Date.now() * 0.006) * 0.25;
    beaconMesh.scale.set(s, s, s);
  }

  renderer3D.render(scene3D, camera3D);
}

function focus3DWaypoint(idx) {
  const wp = WAYPOINTS_3D[idx];
  if (!wp) return;

  // Update HUD
  document.getElementById('hudDay').textContent = wp.day;
  document.getElementById('hudName').textContent = wp.name;
  document.getElementById('hudAlt').textContent = `${wp.alt.toLocaleString()} m (${wp.altFt.toLocaleString()} ft)`;
  document.getElementById('hudO2').textContent = wp.climate;
  document.getElementById('hudDesc').textContent = wp.desc;

  // Move Beacon
  if (beaconMesh) {
    beaconMesh.position.set(wp.x, wp.y + 0.45, wp.z);
  }

  // Update pill active state
  const pills = document.querySelectorAll('.aw-btn');
  pills.forEach((p, i) => {
    p.classList.remove('active');
    if (i === idx) p.classList.add('active');
  });
}

function set3DMode(mode) {
  current3DMode = mode;
  document.getElementById('btnModeTerrain').classList.toggle('active', mode === 'terrain');
  document.getElementById('btnModeProfile').classList.toggle('active', mode === 'profile');

  if (mode === 'profile') {
    targetRotation.x = 0.05;
    targetRotation.y = 0;
  } else {
    targetRotation.x = 0.35;
    targetRotation.y = -0.5;
  }
}

function toggle3DRotate() {
  isAutoRotating = !isAutoRotating;
  document.getElementById('rotateIcon').textContent = isAutoRotating ? '⏸️' : '▶️';
}

function reset3DCamera() {
  targetRotation.x = 0.35;
  targetRotation.y = -0.5;
  camera3D.position.set(0, 32, 72);
  focus3DWaypoint(7);
}

// Initialize Three.js on Load
window.addEventListener('DOMContentLoaded', () => {
  // Load Three.js if needed or initialize
  if (window.THREE) {
    init3DProfile();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = init3DProfile;
    document.head.appendChild(script);
  }
});
