/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import './SilentValleyPage.css';

// Public asset URLs
const logoImg = "/logo.png";
const kunthiRiver = "/treks/silent-valley/Silent valley/Assets/kunthi_river.jpg";
const lionTailedMacaque = "/treks/silent-valley/Silent valley/Assets/lion_tailed_macaque.jpg";
const mukkaliCamp = "/treks/silent-valley/Silent valley/Assets/mukkali_camp.jpg";
const poochiparaTrail = "/treks/silent-valley/Silent valley/Assets/poochipara_trail.jpg";
const rainforestCanopy = "/treks/silent-valley/Silent valley/Assets/rainforest_canopy.jpg";
const sairandhriTower = "/treks/silent-valley/Silent valley/Assets/sairandhri_tower.jpg";
const silentValleyHero = "/treks/silent-valley/Silent valley/Assets/silent_valley_hero.jpg";
const sisparaPass = "/treks/silent-valley/Silent valley/Assets/sispara_pass.jpg";
const wildFlora = "/treks/silent-valley/Silent valley/Assets/wild_flora.jpg";

// Gallery images array
const GALLERY_ITEMS = [
  { id: 0, cat: 'canopy', src: silentValleyHero, alt: "Silent Valley Evergreen Canopy", caption: "Misty Sunrise over Virgin Rainforest Canopy" },
  { id: 1, cat: 'river', src: kunthiRiver, alt: "Kunthi River Suspension Bridge", caption: "Pristine Kunthi River & Suspension Bridge" },
  { id: 2, cat: 'canopy', src: sairandhriTower, alt: "Sairandhri 100ft Watch Tower", caption: "100ft Sairandhri Observation Tower" },
  { id: 3, cat: 'wildlife', src: lionTailedMacaque, alt: "Lion-tailed Macaque", caption: "Endangered Lion-tailed Macaque in Habitat" },
  { id: 4, cat: 'trail', src: poochiparaTrail, alt: "Poochipara Rainforest Path", caption: "Poochipara Rainforest Trail with Trekkers" },
  { id: 5, cat: 'canopy', src: sisparaPass, alt: "Sispara Mountain Pass", caption: "Sispara Mountain Ridge at 2,206m" },
  { id: 6, cat: 'canopy', src: rainforestCanopy, alt: "Tropical Rainforest Canopy", caption: "Lush Western Ghats Rainforest Canopy" },
  { id: 7, cat: 'trail', src: mukkaliCamp, alt: "Mukkali Forest Basecamp", caption: "Mukkali Forest Base & Inspection Bungalow" }
];

export default function SilentValleyPage({ onBack, onOpenBookingModal, packageData }) {
  const price = packageData?.price || 4000;
  const formattedPrice = Number(price).toLocaleString('en-IN');
  // Mobile navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Accordions and UI tabs
  const [activeAccordion, setActiveAccordion] = useState('detailed'); // 'quick' or 'detailed'
  const [activeDay, setActiveDay] = useState(1); // 1, 2, or 3
  const [activeFaq, setActiveFaq] = useState(0); // FAQ item index

  // Checklist state
  const [checkedItems, setCheckedItems] = useState(new Set());

  // Gallery state
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Scroll handler for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Packing list checker
  const handleToggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Gallery category filter
  const filteredGallery = GALLERY_ITEMS.filter(item => activeCategory === 'all' || item.cat === activeCategory);

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevLightbox = () => {
    setLightboxIndex(prev => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const handleNextLightbox = () => {
    setLightboxIndex(prev => (prev + 1) % filteredGallery.length);
  };

  // Mobile menu close trigger
  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="silent-valley-page-container bg-[#f8fafc] text-[#0f172a] font-outfit min-h-screen">
      
      {/* 1. NAVIGATION BAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-container">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="nav-logo">
            <div className="logo-icon-container">
              <img src={logoImg} alt="BOOTpaths" className="logo-img" />
            </div>
            <span className="logo-text">
              <span className="text-orange">BOOT</span>
              <span className="text-brown">paths</span>
            </span>
          </a>
          
          <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`} id="navMenu">
            <ul className="nav-links">
              <li><a href="#overview" onClick={(e) => { e.preventDefault(); handleNavClick('overview'); }}>Overview</a></li>
              <li><a href="#highlights" onClick={(e) => { e.preventDefault(); handleNavClick('highlights'); }}>Highlights</a></li>
              <li><a href="#itinerary" onClick={(e) => { e.preventDefault(); handleNavClick('itinerary'); }}>Itinerary</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}>Gallery</a></li>
              <li><a href="#inclusions" onClick={(e) => { e.preventDefault(); handleNavClick('inclusions'); }}>Inclusions</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}>FAQ</a></li>
            </ul>
            <div className="nav-mobile-actions">
              <a 
                href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%2520a%2520callback%2520regarding%2520the%2520Silent%2520Valley%2520trek." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mobile-callback-btn"
              >
                Request Callback on WhatsApp
              </a>
              <button 
                onClick={() => { setIsMenuOpen(false); onOpenBookingModal(); }} 
                className="mobile-cta-btn border-none"
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="nav-actions">
            <a 
              href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-callback-btn"
            >
              Request Callback
            </a>
            <button 
              onClick={onOpenBookingModal} 
              className="nav-cta border-none cursor-pointer"
            >
              Book Now
            </button>
            
            {/* STICKY TOP BACK BUTTON */}
            <button 
              onClick={onBack}
              className="ml-2 rounded-full border border-stone-300 hover:border-[#C1571F] bg-white text-stone-700 hover:text-[#C1571F] text-xs font-bold px-4 py-2 transition-all duration-300 shadow-sm cursor-pointer"
            >
              ← Back to BOOTpaths
            </button>
          </div>

          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle navigation menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`nav-backdrop ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      </nav>

      {/* 2. HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src={silentValleyHero} alt="Silent Valley National Park" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge"><span className="bdot"></span>Kerala • Nilgiri Biosphere Reserve</div>
          <h1 className="hero-title">Silent Valley<br/><em>Rainforest Trek</em></h1>
          <p className="hero-sub font-outfit">Journey into India's last undisturbed evergreen tropical rainforest &amp; virgin biodiversity haven</p>
          <div className="hero-stats">
            <div className="hs"><span className="hs-ico">🏔️</span><div><b>2,383m</b><small>Max Altitude</small></div></div>
            <div className="hs-div"></div>
            <div className="hs"><span className="hs-ico">📅</span><div><b>3 Days</b><small>Duration</small></div></div>
            <div className="hs-div"></div>
            <div className="hs"><span className="hs-ico">🧗</span><div><b>Moderate</b><small>Difficulty</small></div></div>
            <div className="hs-div"></div>
            <div className="hs"><span className="hs-ico">📍</span><div><b>Mukkali</b><small>Start Point</small></div></div>
          </div>
          <div className="hero-btns">
            <button onClick={onOpenBookingModal} className="btn-p border-none cursor-pointer">Book This Trek</button>
            <a 
              href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-wa"
            >
              Request a Callback
            </a>
            <a href="#itinerary" onClick={(e) => { e.preventDefault(); document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-g">View Itinerary</a>
          </div>
        </div>
        <div className="scroll-hint"><span>Scroll to explore</span><div className="sarrow"></div></div>
      </section>

      {/* 3. QUICK INFO BAR */}
      <div className="qi-bar">
        <div className="container">
          <div className="qi-grid">
            <div className="qi"><span>📅</span><div><small>Best Season</small><strong>Oct–Mar (Cool &amp; Clear)</strong></div></div>
            <div className="qi"><span>⛺</span><div><small>Accommodation</small><strong>Forest Bungalow &amp; Camp</strong></div></div>
            <div className="qi"><span>🥾</span><div><small>Trek Distance</small><strong>~32 km Circuit Trail</strong></div></div>
            <div className="qi"><span>🚗</span><div><small>Starting Base</small><strong>Mukkali, Palakkad (658m)</strong></div></div>
            <div className="qi"><span>💰</span><div><small>Eco Expedition</small><strong>₹{formattedPrice} / person</strong></div></div>
          </div>
        </div>
      </div>

      {/* 4. OVERVIEW */}
      <section className="overview section" id="overview">
        <div className="container">
          <div className="ov-layout">
            <div className="ov-text">
              <div className="stag">About the Trek</div>
              <h2 className="stitle">India's Most Mystical<br/>Virgin Rainforest</h2>
              <p className="ov-lead font-outfit">Silent Valley National Park is one of the last undisturbed tropical evergreen rainforest tracts in the world — a living prehistoric sanctuary where the natural silence is broken only by the whispers of the canopy and the rush of the crystal Kunthi River.</p>
              <p className="ov-body font-outfit">Protected through the historic 1970s environmental movement that saved it from being submerged by a hydroelectric dam, Silent Valley stands today as the crown jewel of the UNESCO Nilgiri Biosphere Reserve. Because cicadas are mysteriously absent from these deep woods, the silence here has a sacred, primeval quality found nowhere else on earth.</p>
              <p className="ov-body font-outfit">Starting from Mukkali basecamp with Kerala Forest Department registered eco-guides, our expedition takes you across the roaring Sairandhri forest trails, over the legendary Kunthi River suspension footbridge, and into the heart of the endangered Lion-tailed Macaque's primary habitat.</p>
              <div className="ov-facts">
                <div className="fact"><b>2,383m</b><small>Anginda Peak Rim</small></div>
                <div className="fact"><b>1,000+</b><small>Flora &amp; Orchid Species</small></div>
                <div className="fact"><b>100%</b><small>Virgin Forest Canopy</small></div>
              </div>
            </div>
            <div className="ov-vis">
              <div className="img-stack">
                <img src={sairandhriTower} alt="Sairandhri Watch Tower" className="si1"/>
                <img src={kunthiRiver} alt="Kunthi River" className="si2"/>
                <div className="img-float"><span>03</span><small>Days in Jungle</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGHLIGHTS */}
      <section className="highlights section" id="highlights">
        <div className="container">
          <div className="sh center">
            <div className="stag">Why This Trek</div>
            <h2 className="stitle">Trek Highlights</h2>
            <p className="ssub">Extraordinary moments in the heart of the Western Ghats biodiversity hotspot</p>
          </div>
          <div className="hl-grid">
            <div className="hlc">
              <div className="hlc-img-w"><img src={kunthiRiver} alt="Kunthi River Suspension Bridge" loading="lazy"/><div className="hlc-ov"></div><span className="hln">01</span></div>
              <div className="hlc-body"><h3>Kunthi River &amp; Suspension Bridge</h3><p>Cross the mythical Kunthipuzha river over the steel suspension bridge — water so untouched and pure it famously never turns muddy even during heavy tropical rains.</p></div>
            </div>
            <div className="hlc">
              <div className="hlc-img-w"><img src={sairandhriTower} alt="Sairandhri 100ft Tower" loading="lazy"/><div className="hlc-ov"></div><span className="hln">02</span></div>
              <div className="hlc-body"><h3>Sairandhri 100ft Canopy Tower</h3><p>Ascend the observation tower standing 100 feet above the multi-tiered jungle canopy for a panoramic 360-degree view of endless emerald peaks and drifting valley mist.</p></div>
            </div>
            <div className="hlc">
              <div className="hlc-img-w"><img src={lionTailedMacaque} alt="Endangered Lion-tailed Macaque" loading="lazy"/><div className="hlc-ov"></div><span className="hln">03</span></div>
              <div className="hlc-body"><h3>Lion-tailed Macaque Tracking</h3><p>Encounter India's most iconic primate — the majestic, silver-maned Lion-tailed Macaque (Macaca silenus) — living freely in its largest viable global population.</p></div>
            </div>
            <div className="hlc">
              <div className="hlc-img-w"><img src={poochiparaTrail} alt="Poochipara Rainforest Path" loading="lazy"/><div className="hlc-ov"></div><span className="hln">04</span></div>
              <div className="hlc-body"><h3>Poochipara Trail &amp; Waterfalls</h3><p>Trek beneath colossal ancient buttress-rooted trees, hanging lianas, and mossy jungle logs along the pristine Poochipara stream and secluded cascade pools.</p></div>
            </div>
            <div className="hlc">
              <div className="hlc-img-w"><img src={sisparaPass} alt="Sispara Historic Ridge" loading="lazy"/><div className="hlc-ov"></div><span className="hln">05</span></div>
              <div className="hlc-body"><h3>Historic Sispara Shola Pass</h3><p>Explore the historic pass linking Kerala and the Nilgiri hills, where unique high-altitude shola grasslands meet the mist-soaked rainforest ridges at over 2,200m.</p></div>
            </div>
            <div className="hlc hlc-wide">
              <div className="hlc-wide-inner">
                <div className="hlc-w-icon">🌳</div>
                <h3>360° Nilgiri Biosphere Rainforest Canopy</h3>
                <p>Walk through one of the planet's top biodiversity hotspots — home to rare endemic birds, Malabar giant squirrels, Ceylon frogmouths, Nilgiri langurs, and centuries-old tropical trees.</p>
                <div className="mtn-tags"><span>Lion-tailed Macaque</span><span>Malabar Giant Squirrel</span><span>Great Indian Hornbill</span><span>Nilgiri Tahr</span><span>Ceylon Frogmouth</span><span>Kunthi River</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ITINERARY */}
      <section className="itinerary section" id="itinerary">
        <div className="container">
          <div className="sh center">
            <div className="stag">Trek Plan &amp; Route Guide</div>
            <h2 className="stitle">Itinerary Details</h2>
            <p className="ssub font-outfit">Discover the 3-day rainforest expedition with daily milestones, trail maps, and eco-guidelines</p>
          </div>

          <div className="itinerary-accordions">

            {/* ACCORDION 1: QUICK ITINERARY */}
            <div className={`main-accordion-item ${activeAccordion === 'quick' ? 'open' : ''}`} id="acc-quick-itinerary">
              <div className="main-accordion-header" onClick={() => setActiveAccordion(prev => prev === 'quick' ? null : 'quick')}>
                <div className="mah-left">
                  <span className="mah-icon">📋</span>
                  <div className="mah-text">
                    <h3>Quick Itinerary</h3>
                    <p>Get your trek plan at a glance with key milestones &amp; daily highlights</p>
                  </div>
                </div>
                <div className="mah-toggle-arrow">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div className="main-accordion-body">
                <div className="quick-it-grid">
                  <div className="qi-card">
                    <div className="qi-card-badge bg-[#C1571F]">Day 1</div>
                    <h4>Mukkali Base to Sairandhri &amp; Kunthi River</h4>
                    <p className="font-outfit">Arrival at Mukkali basecamp. Forest Department permit verification, safari jeep drive (23 km) into dense buffer zone, check-in at Sairandhri, trek down to the historic suspension bridge over Kunthi River.</p>
                    <div className="qi-stats"><span>🥾 4 km Trek</span><span>🏔️ 1,020m</span><span>⛺ Sairandhri FRH / Camp</span></div>
                  </div>

                  <div className="qi-card">
                    <div className="qi-card-badge bg-[#C1571F]">Day 2</div>
                    <h4>Poochipara Deep Rainforest Trail &amp; Wildlife</h4>
                    <p className="font-outfit">Early morning ascent to Sairandhri 100ft watch tower for canopy birdwatching. Full-day guided trek into Poochipara forest path, observing Lion-tailed Macaques, endemic flora, and swimming in crystal natural pools.</p>
                    <div className="qi-stats"><span>🥾 14 km Trek</span><span>🏔️ 1,150m</span><span>⛺ Forest Eco Camp</span></div>
                  </div>

                  <div className="qi-card">
                    <div className="qi-card-badge bg-[#C1571F]">Day 3</div>
                    <h4>Walakkad Shola Ridge &amp; Mukkali Return</h4>
                    <p className="font-outfit">Trek towards Walakkad wilderness ridge bordering the Nilgiri Biosphere sholas. Final panoramic views across Sispara Pass, descent back to Sairandhri, safari return to Mukkali, and certificate presentation.</p>
                    <div className="qi-stats"><span>🥾 10 km Trek</span><span>🏔️ 1,450m</span><span>🏁 Departure</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCORDION 2: DETAILED DAY-BY-DAY ITINERARY */}
            <div className={`main-accordion-item ${activeAccordion === 'detailed' ? 'open' : ''}`} id="acc-detailed-itinerary">
              <div className="main-accordion-header" onClick={() => setActiveAccordion(prev => prev === 'detailed' ? null : 'detailed')}>
                <div className="mah-left">
                  <span className="mah-icon">🗺️</span>
                  <div className="mah-text">
                    <h3>Detailed Day-by-Day Itinerary</h3>
                    <p>In-depth schedule with elevations, terrain descriptions, wildlife spotting, and meals</p>
                  </div>
                </div>
                <div className="mah-toggle-arrow">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div className="main-accordion-body">
                <div className="it-days-list">

                  {/* DAY 1 */}
                  <div className={`it-day ${activeDay === 1 ? 'open' : ''}`}>
                    <div className="itd-h" onClick={() => setActiveDay(prev => prev === 1 ? null : 1)}>
                      <div className="itd-left">
                        <span className="itd-badge">Day 1</span>
                        <div>
                          <h4 className="itd-title">Arrival at Mukkali, Forest Jeep Safari to Sairandhri &amp; Kunthi River Bridge</h4>
                          <div className="itd-sub">Mukkali (658m) → Sairandhri (1,020m) → Kunthi River (920m)</div>
                        </div>
                      </div>
                      <div className="itd-right">
                        <div className="itd-pills">
                          <span className="itd-pill">4 km hike</span>
                          <span className="itd-pill alt-up">1,020m</span>
                        </div>
                        <div className="itd-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></div>
                      </div>
                    </div>
                    <div className="itd-body">
                      <div className="itd-content">
                        <div className="itd-text">
                          <p className="font-outfit">Meet the Bootpaths expedition leader at the Mukkali Forest Information Centre at 08:30 AM. After Forest Department registration and a comprehensive briefing on rainforest etiquette, board authorized 4WD forest safari jeeps for the scenic 23 km journey through the buffer zone to Sairandhri.</p>
                          <p className="font-outfit">Check into the Forest Inspection Bungalow / Eco-Camps at Sairandhri. After a warm traditional Kerala lunch, set out on foot with certified tribal trackers descending through towering mahogany, rosewood, and bamboo groves towards the Kunthi River.</p>
                          <p className="font-outfit">Stand in awe on the historic suspension footbridge over the crystal-clear waters of the Kunthi River, known as the river that never turns muddy. Return to camp before sunset for tea and an evening naturalist presentation on the endemic biodiversity of the Silent Valley.</p>
                          <div className="itd-meta-grid">
                            <div className="im-item"><b>Distance</b><span>23 km Jeep + 4 km Trek</span></div>
                            <div className="im-item"><b>Duration</b><span>5–6 Hours total</span></div>
                            <div className="im-item"><b>Meals</b><span>Lunch, Evening Tea &amp; Dinner</span></div>
                            <div className="im-item"><b>Stay</b><span>Forest Inspection Bungalow / Eco Camp</span></div>
                          </div>
                        </div>
                        <div className="itd-vis">
                          <img src={kunthiRiver} alt="Kunthi River Footbridge" loading="lazy"/>
                          <span className="itd-vis-cap">Historic suspension bridge over the crystal Kunthi River</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DAY 2 */}
                  <div className={`it-day ${activeDay === 2 ? 'open' : ''}`}>
                    <div className="itd-h" onClick={() => setActiveDay(prev => prev === 2 ? null : 2)}>
                      <div className="itd-left">
                        <span className="itd-badge">Day 2</span>
                        <div>
                          <h4 className="itd-title">Poochipara Deep Rainforest Expedition &amp; Lion-tailed Macaque Tracking</h4>
                          <div className="itd-sub">Sairandhri (1,020m) → Sairandhri Tower → Poochipara Stream (1,150m)</div>
                        </div>
                      </div>
                      <div className="itd-right">
                        <div className="itd-pills">
                          <span className="itd-pill">14 km trek</span>
                          <span className="itd-pill alt-up">1,150m</span>
                        </div>
                        <div className="itd-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></div>
                      </div>
                    </div>
                    <div className="itd-body">
                      <div className="itd-content">
                        <div className="itd-text">
                          <p className="font-outfit">Wake up to the symphony of Malabar Whistling Thrushes at dawn. Climb the 100ft Sairandhri observation tower to watch early morning mist rolling over the multi-tiered canopy of the Western Ghats.</p>
                          <p className="font-outfit">Equipped with leech gaiters and trail packs, embark on the legendary Poochipara trek. This trail penetrates deep into the primary tropical evergreen rainforest. Keep your eyes trained on the upper canopy for the glossy black fur and silver mane of the Lion-tailed Macaque foraging in wild fig trees.</p>
                          <p className="font-outfit">Reach the picturesque Poochipara riverbed and natural cascade pools for a packed trail lunch beside pristine cascades. Return along the shaded forest route, spotting Malabar Giant Squirrels, hornbills, and rare tree frogs.</p>
                          <div className="itd-meta-grid">
                            <div className="im-item"><b>Distance</b><span>14 km round trip</span></div>
                            <div className="im-item"><b>Duration</b><span>6–7 Hours</span></div>
                            <div className="im-item"><b>Meals</b><span>Breakfast, Trail Lunch &amp; Dinner</span></div>
                            <div className="im-item"><b>Stay</b><span>Sairandhri Forest Camp</span></div>
                          </div>
                        </div>
                        <div className="itd-vis">
                          <img src={poochiparaTrail} alt="Poochipara Rainforest Trail" loading="lazy"/>
                          <span className="itd-vis-cap">Walking beneath giant rainforest canopy trees along Poochipara trail</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DAY 3 */}
                  <div className={`it-day ${activeDay === 3 ? 'open' : ''}`}>
                    <div className="itd-h" onClick={() => setActiveDay(prev => prev === 3 ? null : 3)}>
                      <div className="itd-left">
                        <span className="itd-badge">Day 3</span>
                        <div>
                          <h4 className="itd-title">Walakkad Shola Wilderness, Sairandhri Farewell &amp; Mukkali Return</h4>
                          <div className="itd-sub">Sairandhri → Walakkad Ridge (1,450m) → Mukkali Base (658m)</div>
                        </div>
                      </div>
                      <div className="itd-right">
                        <div className="itd-pills">
                          <span className="itd-pill">10 km trek</span>
                          <span className="itd-pill alt-down">658m base</span>
                        </div>
                        <div className="itd-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></div>
                      </div>
                    </div>
                    <div className="itd-body">
                      <div className="itd-content">
                        <div className="itd-text">
                          <p className="font-outfit">Start early with a scenic trek towards the Walakkad forest ridge, where the dense rainforest gradually transitions into the high-altitude shola grasslands of the Nilgiris border.</p>
                          <p className="font-outfit">Enjoy uninterrupted views towards Sispara Pass and Anginda Peak. Return to camp for a traditional brunch, pack up, and board the 4WD safari jeeps back down the winding ghat road to Mukkali.</p>
                          <p className="font-outfit">Conclude the expedition with certificate distribution, sharing group memories, and farewells at the Mukkali Forest Information Centre by 03:00 PM.</p>
                          <div className="itd-meta-grid">
                            <div className="im-item"><b>Distance</b><span>10 km trek + 23 km Jeep</span></div>
                            <div className="im-item"><b>Duration</b><span>4–5 Hours</span></div>
                            <div className="im-item"><b>Meals</b><span>Breakfast &amp; Lunch</span></div>
                            <div className="im-item"><b>Stay</b><span>Departure to Palakkad / Coimbatore</span></div>
                          </div>
                        </div>
                        <div className="itd-vis">
                          <img src={sairandhriTower} alt="Silent Valley Wilderness" loading="lazy"/>
                          <span className="itd-vis-cap">Farewell vistas over the pristine Western Ghats canopy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PHOTO GALLERY */}
      <section className="gallery section" id="gallery">
        <div className="container">
          <div className="sh center">
            <div className="stag">Visual Experience</div>
            <h2 className="stitle">Photo Gallery</h2>
            <p className="ssub">Moments captured deep in the virgin tropical evergreen wilderness of Silent Valley</p>
          </div>

          <div className="gallery-tabs">
            <button className={`gt-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All Photos</button>
            <button className={`gt-btn ${activeCategory === 'canopy' ? 'active' : ''}`} onClick={() => setActiveCategory('canopy')}>Canopy &amp; Peaks</button>
            <button className={`gt-btn ${activeCategory === 'river' ? 'active' : ''}`} onClick={() => setActiveCategory('river')}>Rivers &amp; Falls</button>
            <button className={`gt-btn ${activeCategory === 'wildlife' ? 'active' : ''}`} onClick={() => setActiveCategory('wildlife')}>Wildlife &amp; Flora</button>
            <button className={`gt-btn ${activeCategory === 'trail' ? 'active' : ''}`} onClick={() => setActiveCategory('trail')}>Trail Life</button>
          </div>

          <div className="gallery-grid" id="galleryGrid">
            {filteredGallery.map((item, idx) => (
              <div 
                key={item.id} 
                className="gi" 
                onClick={() => handleOpenLightbox(idx)}
              >
                <img src={item.src} alt={item.alt} loading="lazy"/>
                <div className="gi-ov">
                  <div className="gi-cap font-outfit">{item.caption}</div>
                  <span className="gi-mag">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="gallery-lightbox active" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close border-none" onClick={() => setLightboxOpen(false)}>&times;</button>
            <button className="lightbox-prev border-none" onClick={handlePrevLightbox}>&#10094;</button>
            <img 
              src={filteredGallery[lightboxIndex]?.src} 
              alt={filteredGallery[lightboxIndex]?.alt} 
              id="lightboxImg" 
            />
            <button className="lightbox-next border-none" onClick={handleNextLightbox}>&#10095;</button>
            <div className="lightbox-info">
              <div id="lightboxCaption">{filteredGallery[lightboxIndex]?.caption || filteredGallery[lightboxIndex]?.alt}</div>
              <div id="lightboxIndex">{lightboxIndex + 1} / {filteredGallery.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. INCLUSIONS & EXCLUSIONS */}
      <section className="ie-section section" id="inclusions">
        <div className="container">
          <div className="sh center">
            <div className="stag">What is Covered</div>
            <h2 className="stitle">Inclusions &amp; Exclusions</h2>
            <p className="ssub">Complete transparency on what your Silent Valley eco-trek package covers</p>
          </div>
          <div className="ie-grid">
            <div className="iec inc-card">
              <div className="iec-h"><span>✅</span><h3>What is Included</h3></div>
              <ul className="space-y-3">
                <li><span className="chk">✓</span> Kerala Forest Department entry &amp; trekking permits</li>
                <li><span className="chk">✓</span> Certified government-licensed tribal naturalist guide</li>
                <li><span className="chk">✓</span> Sairandhri return 4WD forest safari jeep transfers</li>
                <li><span className="chk">✓</span> Sairandhri Forest Inspection Bungalow / Eco-camp stay (2 nights)</li>
                <li><span className="chk">✓</span> All meals during trek (traditional organic Kerala breakfast, trail lunch &amp; dinner)</li>
                <li><span className="chk">✓</span> Leech gaiters &amp; natural herbal repellent kit</li>
                <li><span className="chk">✓</span> Full wilderness first-aid kit &amp; certified wilderness responder</li>
                <li><span className="chk">✓</span> Certificate of Eco-Trek Completion signed by Bootpaths</li>
              </ul>
            </div>
            <div className="iec exc-card">
              <div className="iec-h"><span>❌</span><h3>What is Excluded</h3></div>
              <ul className="space-y-3">
                <li><span className="crs">&times;</span> Travel to and from Mukkali Base (available as add-on from Palakkad / Coimbatore)</li>
                <li><span className="crs">&times;</span> Professional camera/video permits mandated by Forest Dept</li>
                <li><span className="crs">&times;</span> Personal trekking gear (boots, rain ponchos, backpack)</li>
                <li><span className="crs">&times;</span> Personal expenses, mineral water bottles, snacks</li>
                <li><span className="crs">&times;</span> Travel insurance &amp; medical evacuation costs</li>
                <li><span className="crs">&times;</span> Tips or gratuities for forest drivers and tribal eco-trackers</li>
              </ul>
            </div>
          </div>

          {/* 9. PACKING & GEAR CHECKLIST */}
          <div className="gear-section" style={{ marginTop: '60px' }}>
            <div className="sh center" style={{ marginBottom: '30px' }}>
              <div className="stag">Trail Readiness</div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", color: '#0f172a' }}>Essential Rainforest Packing Checklist</h3>
              <p className="ssub">Click items to mark them as packed into your rucksack</p>
              <div className="cl-badge" id="clCountBadge" style={{ display: 'inline-block', marginTop: '10px', background: '#e0f2fe', color: '#0284c7', padding: '6px 16px', borderRadius: '9999px', fontWeight: '700', fontSize: '0.85rem' }}>
                {checkedItems.size} / 8 Packed
              </div>
            </div>
            <div className="checklist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              
              {[
                { id: 'leech', title: 'Leech Socks / Gaiters', desc: 'Vital protection on forest floor' },
                { id: 'shoes', title: 'Waterproof Trekking Shoes', desc: 'With aggressive grip for wet trails' },
                { id: 'poncho', title: 'Rain Poncho / Jacket', desc: 'Lightweight tropical rain cover' },
                { id: 'shirts', title: 'Quick-Dry Full Sleeve Shirts', desc: 'Earthy tones (green, olive, brown)' },
                { id: 'binoculars', title: 'Binoculars (8x42 or 10x42)', desc: 'For high canopy birdwatching' },
                { id: 'drybags', title: 'Dry Bags / Waterproof Pouch', desc: 'For phone, camera &amp; documents' },
                { id: 'flask', title: 'Reusable Water Flask (1.5L)', desc: 'Strict plastic-free park rule' },
                { id: 'headlamp', title: 'Headlamp &amp; Extra Batteries', desc: 'For eco-camp nights in the jungle' }
              ].map(item => {
                const isChecked = checkedItems.has(item.id);
                return (
                  <div 
                    key={item.id}
                    className={`cl-item ${isChecked ? 'checked bg-[#f0f9ff] border-[#0284c7]' : ''}`} 
                    onClick={() => handleToggleCheck(item.id)} 
                    style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}
                  >
                    <div className="cl-box" style={{ width: '22px', height: '22px', border: '2px solid #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: '700', color: '#fff', backgroundColor: isChecked ? '#0284c7' : 'transparent', borderColor: isChecked ? '#0284c7' : '#cbd5e1' }}>
                      {isChecked && '✓'}
                    </div>
                    <div>
                      <strong className="font-outfit">{item.title}</strong>
                      <br/>
                      <small style={{ color: '#64748b' }} dangerouslySetInnerHTML={{ __html: item.desc }}></small>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* 10. FAQ */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white" id="faq">
        <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
          <span className="px-3.5 py-1 rounded-md bg-[#FFF2EA] text-[#E05A1B] text-xs font-black tracking-widest uppercase mb-3">GOT QUESTIONS?</span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1A1A18] text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-sm text-[#718096] text-center max-w-xl mb-10">Everything you need to know about trekking in Silent Valley National Park</p>

          {[
            { q: 'Do we need prior government permits to trek in Silent Valley?', a: "Yes. Silent Valley is an ecologically sensitive core zone under the Kerala Forest and Wildlife Department. Visitor numbers are strictly capped every day to minimize human footprint. Bootpaths secures all official forest permits, vehicle safari permissions, and tribal guide allotments on your behalf in advance." },
            { q: 'Are there leeches on the trail and how do we prepare?', a: "Because Silent Valley is a moist tropical evergreen rainforest, leeches are common along damp forest paths, particularly after light rain. Leeches are completely harmless and do not carry diseases. Bootpaths provides specialized knee-high leech gaiters and natural herbal salt/lime solutions to keep them off comfortably." },
            { q: 'Can beginners and first-time trekkers join this trek?', a: "Absolutely! The 3-day Silent Valley expedition is rated as Moderate. It involves daily walks of 4 to 14 km over natural terrain with gentle to moderate inclines. Anyone with average cardiovascular fitness and a passion for wild nature can complete it with ease." },
            { q: 'What is the chance of spotting the rare Lion-tailed Macaque?', a: "Silent Valley houses one of the healthiest viable populations of the endangered Lion-tailed Macaque in the world. While wildlife sightings are naturally wild and unpredictable, our trek routes through Poochipara and Sairandhri offer over an 80% sighting probability, especially in the early mornings when they feed in the high canopy." },
            { q: 'How do I reach the Mukkali basecamp?', a: "Mukkali is located in Mannarkkad taluk, Palakkad district, Kerala. The nearest major railway stations are Palakkad Junction (60 km) and Coimbatore Junction (85 km). The nearest airport is Coimbatore International Airport (CJB - 95 km) or Calicut International Airport (CCJ - 100 km). Bootpaths can arrange shared or private cab transfers directly from Palakkad or Coimbatore upon request." },
            { q: 'What are the plastic and ecological regulations in the park?', a: "Silent Valley is a strict zero-plastic zone. Single-use plastic bottles, polythene bags, alcohol, smoking, and music speakers are strictly prohibited. All baggage is inspected by forest rangers at the Mukkali check-post. Trekkers must carry reusable steel or copper water bottles." }
          ].map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`w-full rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border border-[#FF9E66] bg-white shadow-sm' 
                    : 'border border-[#FFE2D1] bg-white'
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 md:px-7 md:py-5 text-left focus:outline-none cursor-pointer"
                >
                  <span className={`pr-4 font-bold text-sm md:text-base transition-colors duration-300 ${
                    isOpen ? 'text-[#E05A1B]' : 'text-[#1A1A18]'
                  }`}>
                    {faq.q}
                  </span>
                  <div className="shrink-0 transition-all duration-300">
                    {isOpen ? (
                      <div className="w-8 h-8 rounded-full bg-[#E05A1B] text-white flex items-center justify-center text-xs font-black">
                        ✕
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#E05A1B] flex items-center justify-center text-sm font-bold">
                        +
                      </div>
                    )}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-5 md:px-7 pb-5 pt-0">
                    <div className="border-t border-[#FFE2D1] my-4" />
                    <p className="text-left text-xs md:text-sm text-[#4A5568] leading-relaxed pb-2 font-outfit">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* 11. BOOKING SECTION */}
      <section className="booking section" id="booking">
        <div className="bk-bg"><img src={silentValleyHero} alt="Silent Valley Trek" className="bk-bgi"/><div className="bk-ov"></div></div>
        <div className="container">
          <div className="bk-layout">
            <div className="bk-info">
              <div className="stag light">Reserve Your Spot</div>
              <h2 className="stitle light">Ready to Explore India's<br/>Last Virgin Rainforest?</h2>
              <p className="bk-desc font-outfit">Join Bootpaths on this once-in-a-lifetime expedition into Silent Valley National Park. 3 unforgettable days of deep forest silence, crystal river crossings, and indigenous wildlife with government-certified naturalist guides.</p>
              
              {/* Package Card */}
              <div className="single-pkg-card">
                <div className="spc-badge">ALL-INCLUSIVE ECO-EXPEDITION PACKAGE</div>
                <div className="spc-price-row">
                  <div className="spc-price">
                    <span className="spc-curr">₹</span><span className="spc-amt">{formattedPrice}</span>
                    <span className="spc-per">/ person (All-Inclusive)</span>
                  </div>
                  <div className="spc-duration">3 Days • Mukkali to Mukkali Base</div>
                </div>
                
                <div className="spc-features-grid">
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Kerala Forest Department Permits &amp; Entry</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Sairandhri 4WD Forest Safari Transfers</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Forest Inspection Bungalow / Camp (2 Nights)</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Certified Tribal Naturalist &amp; Eco Guides</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> All Meals &amp; Traditional Kerala Feasts</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Kunthi River &amp; Poochipara Deep Trails</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Leech Gaiters &amp; Natural Repellent Kit</div>
                  <div className="spc-feat-item"><span className="spc-chk">✓</span> Emergency First-Aid &amp; Responder Lead</div>
                </div>
                
                <div className="spc-cta-row">
                  <button onClick={onOpenBookingModal} className="btn-p btn-spc border-none cursor-pointer">Book at ₹{formattedPrice}</button>
                  <a 
                    href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%2520I%2520would%2520like%2520to%2520book%2520the%2520Silent%2520Valley%2520Rainforest%2520Trek." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-wa"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="ft-grid">
            <div className="ft-brand">
              <div className="ft-logo"><img src={logoImg} alt="Bootpaths"/><span>Bootpaths</span></div>
              <p className="font-outfit">Walk the world's greatest paths with expert guides, thoughtful logistics, and an unwavering passion for wild nature.</p>
              <div className="socials">
                <a href="https://instagram.com/bootpaths" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="sb">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com/share/1ELLiv1gUJ/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="sb">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com/@BOOTpaths2025" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="sb">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                </a>
              </div>
            </div>
            <div className="ft-col"><h4>Quick Links</h4><ul><li><a href="#overview" onClick={(e) => { e.preventDefault(); handleNavClick('overview'); }}>About the Trek</a></li><li><a href="#highlights" onClick={(e) => { e.preventDefault(); handleNavClick('highlights'); }}>Trek Highlights</a></li><li><a href="#itinerary" onClick={(e) => { e.preventDefault(); handleNavClick('itinerary'); }}>Detailed Itinerary</a></li><li><a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}>Photo Gallery</a></li><li><a href="#inclusions" onClick={(e) => { e.preventDefault(); handleNavClick('inclusions'); }}>Inclusions</a></li><li><a href="#faq" onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}>FAQs</a></li><li><a href="#booking" onClick={(e) => { e.preventDefault(); handleNavClick('booking'); }}>Book Now</a></li></ul></div>
            <div className="ft-col"><h4>Other Treks</h4><ul><li><a href="#upcoming-treks" onClick={() => onBack()}>Netravathi Peak Trek</a></li><li><a href="#upcoming-treks" onClick={() => onBack()}>Brahmagiri Coorg Trek</a></li><li><a href="#upcoming-treks" onClick={() => onBack()}>Vellagavi Village Trek</a></li></ul></div>
            <div className="ft-col"><h4>Contact Bootpaths</h4><ul className="ct"><li><span>📧</span> <a href="mailto:lead@bootpaths.com">lead@bootpaths.com</a></li><li><span>📱</span> <a href="tel:+919446102200">Call: +91 9446102200</a></li><li><span>💬</span> <a href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." target="_blank" rel="noopener noreferrer">WhatsApp: +91 9446102200</a></li><li><span>💬</span> <a href="https://wa.me/919895452187?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." target="_blank" rel="noopener noreferrer">WhatsApp: +91 9895452187</a></li><li><span>💬</span> <a href="https://wa.me/918848998470?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." target="_blank" rel="noopener noreferrer">WhatsApp: +91 8848998470</a></li><li><span>🕒</span> Mon–Sat: 9am – 7pm IST</li></ul></div>
          </div>
          <div className="ft-bottom"><p>© 2026 Bootpaths Trekking Pvt. Ltd. All rights reserved.</p><p>Crafted for Silent Valley Wilderness</p></div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP / CALLBACK BUTTON */}
      <a 
        href="https://wa.me/919446102200?text=Hi%20Bootpaths%2C%20I%20would%20like%20to%20request%20a%20callback%20regarding%20the%20Silent%20Valley%20trek." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-callback" 
        title="Request a Callback on WhatsApp"
      >
        <div className="floating-pulse"></div>
        <div className="floating-inner">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.7c.974.538 1.95.823 2.791.824h.001c3.182 0 5.769-2.587 5.769-5.768 0-3.181-2.586-5.767-5.771-5.767zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.718.067-2.316-.593-1.805-.747-2.955-2.58-3.044-2.7-.09-.12-1.748-2.327-1.748-4.439 0-2.112 1.107-3.15 1.498-3.57.391-.42.853-.526 1.138-.526.284 0 .568.002.818.014.266.012.622-.101.974.743.363.87 1.242 3.03 1.349 3.249.106.219.178.474.036.755-.143.282-.214.457-.427.707-.213.25-.45.559-.643.75-.213.21-.436.438-.187.865.249.427 1.104 1.82 2.368 2.946 1.626 1.448 2.997 1.897 3.424 2.11.427.213.676.178.925-.107.25-.284 1.066-1.242 1.35-1.668.284-.427.569-.356.96-.213.391.142 2.488 1.173 2.915 1.386.427.213.711.32.818.498.107.178.107 1.032-.037 1.437z"/></svg>
          <span className="floating-label font-outfit">Request Callback</span>
        </div>
      </a>

    </div>
  );
}
