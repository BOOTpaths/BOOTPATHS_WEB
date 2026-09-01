/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, 
  X, 
  LogOut, 
  Shield, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Users, 
  TreePine, 
  FileText, 
  Navigation,
  Compass,
  Leaf
} from 'lucide-react';

const Instagram = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const CURATED_DEFAULT_TREKS = [
  {
    id: 'silent-valley',
    title: 'Silent Valley Rainforest Trek',
    location: 'Palakkad, Kerala',
    region: 'Western Ghats',
    difficulty: 'Moderate',
    duration: '3 Days',
    tag: 'EXPLORATION SPECIAL',
    price: 4000,
    isSpecialPage: true,
    pageHash: '#silent-valley',
    description: "Journey into India's last undisturbed tropical rainforest & biodiversity haven."
  },
  {
    id: 'netravathi',
    title: 'Netravathi Peak Trek',
    location: 'Chikmagalur, Karnataka',
    region: 'Western Ghats',
    difficulty: 'Moderate',
    duration: '2 Days',
    tag: 'FILLING FAST!',
    price: 3499,
    description: "Lush rolling shola grasslands, cloud walks and breathtaking ridge panoramas."
  },
  {
    id: 'brahmagiri',
    title: 'Brahmagiri Coorg Trek',
    location: 'Coorg, Karnataka',
    region: 'Western Ghats',
    difficulty: 'Moderate',
    duration: '2 Days',
    tag: 'PREMIUM TRAIL',
    price: 3899,
    description: "Misty evergreen coffee ridge trails, Iruppu falls and pristine flora."
  },
  {
    id: 'vellagavi',
    title: 'Vellagavi Village Trek',
    location: 'Kodaikanal, Tamil Nadu',
    region: 'Western Ghats',
    difficulty: 'Challenging',
    duration: '2 Days',
    tag: 'ANCIENT TRAIL',
    price: 3799,
    description: "Centuries-old hidden tribal settlement nestled within deep cardamom slopes."
  },
  {
    id: 'kedarkantha',
    title: 'Kedarkantha Winter Trek',
    location: 'Sankri, Uttarakhand',
    region: 'Himalayan Trails',
    difficulty: 'Moderate',
    duration: '5 Days',
    tag: 'SNOW EXPEDITION',
    price: 8999,
    description: "Panoramic 360-degree snow peaks summit in the Garhwal Himalayas."
  },
  {
    id: 'hampta-pass',
    title: 'Hampta Pass Trek',
    location: 'Manali to Spiti, HP',
    region: 'Himalayan Trails',
    difficulty: 'Challenging',
    duration: '5 Days',
    tag: 'CROSSOVER TRAIL',
    price: 10499,
    description: "Dramatic crossover from green Kullu valley to arid desert mountains of Spiti."
  },
  {
    id: 'roopkund',
    title: 'Roopkund Mystery Lake Trek',
    location: 'Chamoli, Uttarakhand',
    region: 'Himalayan Trails',
    difficulty: 'Difficult',
    duration: '6 Days',
    tag: 'HIGH ALTITUDE',
    price: 14500,
    description: "Glacial lake high in the Himalayas surrounded by rock-strewn glaciers."
  },
  {
    id: 'everest-base-camp',
    title: 'Everest Base Camp (EBC)',
    location: 'Khumbu, Nepal',
    region: 'International Treks',
    difficulty: 'Demanding',
    duration: '14 Days',
    tag: 'GLOBAL ICON',
    price: 48000,
    description: "The ultimate bucket-list expedition to the foot of Mt. Everest (8,848m)."
  },
  {
    id: 'kilimanjaro',
    title: 'Mt. Kilimanjaro Expedition',
    location: 'Tanzania, Africa',
    region: 'International Treks',
    difficulty: 'High Altitude',
    duration: '8 Days',
    tag: 'SEVEN SUMMITS',
    price: 125000,
    description: "Stand atop the roof of Africa at Uhuru Peak (5,895m)."
  },
  {
    id: 'annapurna-circuit',
    title: 'Annapurna Circuit Trek',
    location: 'Gandaki, Nepal',
    region: 'International Treks',
    difficulty: 'Challenging',
    duration: '12 Days',
    tag: 'ICONIC PASS',
    price: 42000,
    description: "Cross Thorong La Pass (5,416m) through diverse landscapes and Tibetan cultures."
  }
];

const NAVIGATION_SECTIONS = [
  {
    id: 'upcoming-treks',
    title: 'Upcoming Batches & Live Treks',
    category: 'Bookings & Batches',
    desc: 'View all open weekend and multi-day expedition schedules',
    badge: 'Batches'
  },
  {
    id: 'booking-widget',
    title: 'Live Slot Reservation Widget',
    category: 'Instant Booking',
    desc: 'Reserve slots, select batch date & book via Razorpay',
    badge: 'Reserve'
  },
  {
    id: 'advantage',
    title: 'Safety Standards & Certified Leads',
    category: 'Safety & Eco',
    desc: 'Wilderness first-aid, Quechua gear & safety protocols',
    badge: 'Safety'
  },
  {
    id: 'advantage',
    title: 'Eco-Initiatives & Zero-Plastic Policy',
    category: 'Ecotourism',
    desc: 'Leave No Trace principles and green biosphere conservation',
    badge: 'Eco'
  },
  {
    id: 'blogs',
    title: 'Official Blog & Trail Stories',
    category: 'Exploration Diaries',
    desc: 'Guides, preparation tips, gear reviews & expedition journals',
    badge: 'Editorial'
  },
  {
    id: 'careers',
    title: 'Lead Careers & Guide Applications',
    category: 'Work with BOOTpaths',
    desc: 'Join our team as certified mountain leader or trek naturalist',
    badge: 'Hiring'
  }
];

export default function Navbar({
  isCareersEnabled,
  user,
  userRole,
  handleLogout,
  setIsDashboardOpen,
  setIsAuthModalOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  treks = [],
  blogs = [],
  onSelectTrek,
  onOpenAuth
}) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileUpcomingOpen, setMobileUpcomingOpen] = useState(false);
  const [mobileWesternOpen, setMobileWesternOpen] = useState(false);
  const [mobileHimalayanOpen, setMobileHimalayanOpen] = useState(false);
  const [mobileInternationalOpen, setMobileInternationalOpen] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);
      if (isOutsideDesktop && isOutsideMobile) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Merge live treks with curated defaults so indexing is fast and rich
  const allIndexedTreks = useMemo(() => {
    const map = new Map();
    CURATED_DEFAULT_TREKS.forEach(t => map.set(t.id, t));
    (treks || []).forEach(t => {
      const existing = map.get(t.id) || {};
      map.set(t.id, { ...existing, ...t });
    });
    return Array.from(map.values());
  }, [treks]);

  const queryClean = searchQuery.trim().toLowerCase();

  const { filteredTreks, filteredBlogs, filteredSections, totalMatches } = useMemo(() => {
    if (!queryClean) {
      return { filteredTreks: [], filteredBlogs: [], filteredSections: [], totalMatches: 0 };
    }

    const matchedTreks = allIndexedTreks.filter(t => {
      const title = (t.title || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      const region = (t.region || '').toLowerCase();
      const diff = (t.difficulty || '').toLowerCase();
      const tag = (t.tag || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const duration = (t.duration || '').toLowerCase();
      return (
        title.includes(queryClean) ||
        loc.includes(queryClean) ||
        region.includes(queryClean) ||
        diff.includes(queryClean) ||
        tag.includes(queryClean) ||
        desc.includes(queryClean) ||
        duration.includes(queryClean)
      );
    }).slice(0, 5);

    const matchedBlogs = (blogs || []).filter(b => {
      const title = (b.title || '').toLowerCase();
      const cat = (b.category || b.categoryTag || '').toLowerCase();
      const author = (b.authorName || b.author || '').toLowerCase();
      const content = (b.content || '').toLowerCase();
      return (
        title.includes(queryClean) ||
        cat.includes(queryClean) ||
        author.includes(queryClean) ||
        content.includes(queryClean)
      );
    }).slice(0, 4);

    const matchedSections = NAVIGATION_SECTIONS.filter(s => {
      const title = s.title.toLowerCase();
      const cat = s.category.toLowerCase();
      const desc = s.desc.toLowerCase();
      const id = s.id.toLowerCase();
      return (
        title.includes(queryClean) ||
        cat.includes(queryClean) ||
        desc.includes(queryClean) ||
        id.includes(queryClean)
      );
    }).slice(0, 4);

    return {
      filteredTreks: matchedTreks,
      filteredBlogs: matchedBlogs,
      filteredSections: matchedSections,
      totalMatches: matchedTreks.length + matchedBlogs.length + matchedSections.length
    };
  }, [queryClean, allIndexedTreks, blogs]);

  // Action handlers
  const handleTrekClick = (trek) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setMobileMenuOpen?.(false);

    if (trek.id === 'silent-valley' || trek.pageHash === '#silent-valley' || trek.title?.toLowerCase().includes('silent valley')) {
      window.location.hash = '#silent-valley';
      window.scrollTo(0, 0);
      return;
    }

    if (onSelectTrek) {
      onSelectTrek(trek);
    } else {
      window.location.hash = '#upcoming-treks';
      setTimeout(() => {
        document.getElementById('upcoming-treks')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleBlogClick = (blog) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setMobileMenuOpen?.(false);
    window.location.hash = `#blog/${blog.id}`;
    window.scrollTo(0, 0);
  };

  const handleSectionClick = (section) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setMobileMenuOpen?.(false);

    const targetEl = document.getElementById(section.id);
    if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
      window.location.hash = '';
      setTimeout(() => {
        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = `#${section.id}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTreks.length > 0) {
        handleTrekClick(filteredTreks[0]);
      } else if (filteredBlogs.length > 0) {
        handleBlogClick(filteredBlogs[0]);
      } else if (filteredSections.length > 0) {
        handleSectionClick(filteredSections[0]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  // Reusable dropdown component
  const renderSearchResultsDropdown = () => {
    if (!isDropdownOpen || queryClean.length === 0) return null;

    return (
      <div className="absolute top-full mt-2 left-0 w-full md:w-[480px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-[#F5F5F3] max-h-[460px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 text-left">
        {totalMatches === 0 ? (
          <div className="p-6 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FFF2EA] text-[#C1571F] flex items-center justify-center mb-2.5">
              <Search className="h-5 w-5" />
            </div>
            <p className="font-outfit text-sm font-bold text-[#1A1A18]">
              No matching results for "{searchQuery}"
            </p>
            <p className="text-xs text-[#52524E] mt-1">
              Try searching for "Silent Valley", "Western Ghats", "Safety", or "Himalayan".
            </p>
          </div>
        ) : (
          <>
            {/* 🌲 Treks & Expeditions */}
            {filteredTreks.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE]">
                  <span>🌲 Treks &amp; Expeditions</span>
                  <span className="text-[10px] font-semibold text-[#8C8C88]">
                    {filteredTreks.length} {filteredTreks.length === 1 ? 'trek' : 'treks'}
                  </span>
                </div>
                <div className="divide-y divide-[#F5F5F3]">
                  {filteredTreks.map((trek) => (
                    <button
                      key={trek.id}
                      onClick={() => handleTrekClick(trek)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F8F8F6] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-outfit text-sm font-bold text-[#1A1A18] group-hover:text-[#C1571F] transition-colors truncate">
                            {trek.title}
                          </span>
                          {trek.difficulty && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE8D6] text-[#6B4E3D]">
                              {trek.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#52524E] mt-0.5">
                          <span className="truncate">{trek.location || trek.region}</span>
                          {trek.duration && <span>• {trek.duration}</span>}
                          {trek.price && (
                            <span className="font-bold text-[#C1571F]">
                              • ₹{Number(trek.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#C1571F] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 📝 Blogs & Stories */}
            {filteredBlogs.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE]">
                  <span>📝 Blogs &amp; Stories</span>
                  <span className="text-[10px] font-semibold text-[#8C8C88]">
                    {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>
                <div className="divide-y divide-[#F5F5F3]">
                  {filteredBlogs.map((blog) => (
                    <button
                      key={blog.id}
                      onClick={() => handleBlogClick(blog)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F8F8F6] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <span className="font-outfit text-sm font-bold text-[#1A1A18] group-hover:text-[#C1571F] transition-colors truncate block">
                          {blog.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[#52524E] mt-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C1571F]">
                            {blog.category || blog.categoryTag || 'Article'}
                          </span>
                          {blog.authorName && <span>• By {blog.authorName}</span>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#C1571F] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 🧭 Navigation & Sections */}
            {filteredSections.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE]">
                  <span>🧭 Navigation &amp; Sections</span>
                  <span className="text-[10px] font-semibold text-[#8C8C88]">
                    {filteredSections.length} {filteredSections.length === 1 ? 'section' : 'sections'}
                  </span>
                </div>
                <div className="divide-y divide-[#F5F5F3]">
                  {filteredSections.map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSectionClick(section)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F8F8F6] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-outfit text-sm font-bold text-[#1A1A18] group-hover:text-[#C1571F] transition-colors truncate">
                            {section.title}
                          </span>
                          {section.badge && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0F0EE] text-[#52524E]">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#52524E] mt-0.5 truncate">
                          {section.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#C1571F] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Top Announcement Strip */}
      {showAnnouncement && (
        <div className="bg-[#C1571F] text-white text-xs font-medium py-1.5 px-4 flex justify-between items-center z-50">
          <div className="flex-1 text-center font-outfit">
            <span>🌲 Netravathi &amp; Brahmagiri Weekend Slots Open — Limited Batches Available! </span>
            <a href="#upcoming-treks" className="underline font-bold ml-1 hover:text-orange-100 transition-colors">
              Book Now ➔
            </a>
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)} 
            className="text-white/80 hover:text-white transition-colors focus:outline-none ml-2 shrink-0 cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Primary Navigation Bar (Tier 1) */}
      <div className="border-b border-autumn-bark/10 bg-autumn-mist/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12 gap-4">
          {/* Left: Brand typography */}
          <a href="/#" className="flex items-center gap-2.5 select-none hover:opacity-95 transition-opacity shrink-0">
            <div className="w-10 h-10 rounded-full bg-white border border-[#3E2723]/30 shadow-sm flex items-center justify-center overflow-hidden p-1">
              <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight select-none">
              <span className="text-[#FF6B00]">BOOT</span>
              <span className="text-[#8B2626]">paths</span>
            </span>
          </a>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative" ref={desktopSearchRef}>
            <span className="absolute left-3.5 text-autumn-bark/40 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input 
              ref={desktopInputRef}
              type="text" 
              placeholder="Search treks by region, difficulty, season..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/40 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none focus:bg-[#EFE8D6]/80 focus:border-[#C1571F]/50 transition-all font-outfit"
            />
            {searchQuery.length > 0 && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  desktopInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-autumn-bark/40 hover:text-autumn-bark transition-colors p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {renderSearchResultsDropdown()}
          </div>

          {/* Right: Quick Links */}
          <div className="hidden md:flex items-center gap-6">
            {isCareersEnabled && (
              <a href="#careers" className="font-outfit text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#C1571F] transition-colors">
                Careers
              </a>
            )}
            <a href="#advantage" className="font-outfit text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#C1571F] transition-colors">
              Safety
            </a>
            <a 
              href="#blogs" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
                  window.location.hash = '';
                  setTimeout(() => {
                    document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); 
                }
              }}
              className="font-outfit text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#C1571F] transition-colors"
            >
              Blogs
            </a>

            {/* Nav CTA / User Avatar */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5 rounded-full border border-autumn-bark/10 bg-[#EFE8D6]/60 p-1.5 pr-4 transition-all duration-200 hover:border-autumn-maple/50 hover:bg-[#EFE8D6] focus:outline-none focus:ring-2 focus:ring-autumn-maple cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-autumn-maple font-outfit text-sm font-bold text-[#F3ECDD] shadow-md">
                    {user.initials}
                  </div>
                  <span className="font-outfit text-xs font-bold text-autumn-bark/80 tracking-wide">{user.name}</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-autumn-bark/10 bg-[#EFE8D6] p-2 shadow-2xl opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-50">
                  <div className="px-3 py-1.5 border-b border-autumn-bark/10 text-[10px] text-autumn-bark/50 uppercase tracking-widest font-bold">
                    {user.email}
                  </div>
                  {user && (userRole === 'developer' || user?.role === 'developer' || user?.email === 'vzentura2026@gmail.com') && (
                    <button 
                      onClick={() => { window.location.hash = '#dev-ops'; }} 
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      🛠️ DEVELOPER CONSOLE
                    </button>
                  )}
                  {user && userRole === 'admin' && (
                    <button 
                      onClick={() => { window.location.hash = '#admin'; }}
                      className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider bg-[#C1571F] text-white hover:bg-[#a34718] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      ⚙️ ADMIN PORTAL
                    </button>
                  )}
                  <button 
                    onClick={() => setIsDashboardOpen?.(true)}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-autumn-maple hover:bg-autumn-maple/10 transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => (onOpenAuth ? onOpenAuth('login') : setIsAuthModalOpen?.(true))}
                className="border border-[#C1571F] text-[#C1571F] hover:bg-[#C1571F] hover:text-[#3A2A1E] font-bold text-xs uppercase tracking-wider rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/40 text-autumn-bark transition-colors hover:bg-[#EFE8D6] md:hidden shrink-0 cursor-pointer"
            onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Category Sub-Navigation Bar (Tier 2) */}
      <div className="bg-[#F8F8F6] border-b border-[#E7E7E4] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#52524E] px-6 py-2.5 flex items-center justify-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">
        {/* Upcoming Treks dropdown */}
        <div className="relative group/menu">
          <button className="flex items-center gap-1 hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold focus:outline-none">
            Upcoming Treks <ChevronDown className="h-3 w-3" />
          </button>
          <div className="absolute left-0 mt-2.5 w-56 bg-white border border-[#E7E7E4] rounded-xl shadow-xl py-2 hidden group-hover/menu:block z-50 text-left normal-case tracking-normal font-medium text-[#52524E]">
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs font-bold">
              All Live Batches
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Weekend Treks
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Premium Small Batches
            </a>
          </div>
        </div>

        {/* Western Ghats dropdown */}
        <div className="relative group/menu">
          <button className="flex items-center gap-1 hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold focus:outline-none">
            Western Ghats <ChevronDown className="h-3 w-3" />
          </button>
          <div className="absolute left-0 mt-2.5 w-56 bg-white border border-[#E7E7E4] rounded-xl shadow-xl py-2 hidden group-hover/menu:block z-50 text-left normal-case tracking-normal font-medium text-[#52524E]">
            <a href="#silent-valley" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs font-bold">
              Silent Valley Rainforest Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs font-bold">
              Netravathi Peak Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Brahmagiri Coorg Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Vellagavi Village Trek
            </a>
          </div>
        </div>

        {/* Himalayan Trails dropdown */}
        <div className="relative group/menu">
          <button className="flex items-center gap-1 hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold focus:outline-none">
            Himalayan Trails <ChevronDown className="h-3 w-3" />
          </button>
          <div className="absolute left-0 mt-2.5 w-56 bg-white border border-[#E7E7E4] rounded-xl shadow-xl py-2 hidden group-hover/menu:block z-50 text-left normal-case tracking-normal font-medium text-[#52524E]">
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs font-bold">
              Kedarkantha Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Hampta Pass Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Roopkund Trek
            </a>
          </div>
        </div>

        {/* International Treks dropdown */}
        <div className="relative group/menu">
          <button className="flex items-center gap-1 hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold focus:outline-none">
            International Treks <ChevronDown className="h-3 w-3" />
          </button>
          <div className="absolute left-0 mt-2.5 w-56 bg-white border border-[#E7E7E4] rounded-xl shadow-xl py-2 hidden group-hover/menu:block z-50 text-left normal-case tracking-normal font-medium text-[#52524E]">
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs font-bold">
              Mt. Kilimanjaro Expedition
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Everest Base Camp Trek
            </a>
            <a href="#upcoming-treks" className="block px-4 py-2 hover:bg-[#F8F8F6] hover:text-[#C1571F] transition-colors text-xs">
              Annapurna Circuit
            </a>
          </div>
        </div>

        {/* Eco-Initiatives */}
        <a href="#advantage" className="hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold">
          Eco-Initiatives
        </a>

        {/* Blogs */}
        <a 
          href="#blogs" 
          onClick={(e) => { 
            e.preventDefault(); 
            if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
              window.location.hash = '';
              setTimeout(() => {
                document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            } else {
              document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); 
            }
          }}
          className="hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold"
        >
          Blogs
        </a>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b border-autumn-bark/10 bg-autumn-mist/95 px-8 py-6 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200 overflow-y-auto max-h-[75vh] z-40">
          <nav className="flex flex-col gap-5">
            {/* Search Input for Mobile */}
            <div className="relative w-full" ref={mobileSearchRef}>
              <span className="absolute left-3.5 top-3 text-autumn-bark/40 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input 
                ref={mobileInputRef}
                type="text" 
                placeholder="Search treks by region, difficulty, season..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/60 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none font-outfit"
              />
              {searchQuery.length > 0 && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    mobileInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-autumn-bark/40 hover:text-autumn-bark transition-colors p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Mobile Search Results Dropdown */}
              {renderSearchResultsDropdown()}
            </div>

            {/* Accordion 1: Upcoming Treks */}
            <div>
              <button 
                onClick={() => setMobileUpcomingOpen(!mobileUpcomingOpen)}
                className="w-full flex items-center justify-between text-left font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1 cursor-pointer"
              >
                <span>Upcoming Treks</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileUpcomingOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileUpcomingOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">All Live Batches</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Weekend Treks</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Premium Small Batches</a>
                </div>
              )}
            </div>

            {/* Accordion 2: Western Ghats */}
            <div>
              <button 
                onClick={() => setMobileWesternOpen(!mobileWesternOpen)}
                className="w-full flex items-center justify-between text-left font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1 cursor-pointer"
              >
                <span>Western Ghats</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileWesternOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileWesternOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  <a href="#silent-valley" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors font-bold text-[#C1571F]">Silent Valley Rainforest Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Netravathi Peak Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Brahmagiri Coorg Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Vellagavi Village Trek</a>
                </div>
              )}
            </div>

            {/* Accordion 3: Himalayan Trails */}
            <div>
              <button 
                onClick={() => setMobileHimalayanOpen(!mobileHimalayanOpen)}
                className="w-full flex items-center justify-between text-left font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1 cursor-pointer"
              >
                <span>Himalayan Trails</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileHimalayanOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileHimalayanOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Kedarkantha Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Hampta Pass Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Roopkund Trek</a>
                </div>
              )}
            </div>

            {/* Accordion 4: International Treks */}
            <div>
              <button 
                onClick={() => setMobileInternationalOpen(!mobileInternationalOpen)}
                className="w-full flex items-center justify-between text-left font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1 cursor-pointer"
              >
                <span>International Treks</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileInternationalOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileInternationalOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Mt. Kilimanjaro Expedition</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Everest Base Camp Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen?.(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Annapurna Circuit</a>
                </div>
              )}
            </div>

            <a 
              href="#advantage" 
              onClick={() => {
                setMobileMenuOpen?.(false);
                if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
                  window.location.hash = '';
                  setTimeout(() => {
                    document.getElementById('advantage')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1"
            >
              Eco-Initiatives
            </a>

            <a 
              href="#blogs" 
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen?.(false); 
                if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
                  window.location.hash = '';
                  setTimeout(() => {
                    document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); 
                }
              }}
              className="font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1"
            >
              Blogs
            </a>

            {isCareersEnabled && (
              <a 
                href="#careers" 
                onClick={() => {
                  setMobileMenuOpen?.(false);
                  if (window.location.hash === '#silent-valley' || window.location.hash.startsWith('#blog-') || window.location.hash.startsWith('#blog/')) {
                    window.location.hash = '';
                    setTimeout(() => {
                      document.getElementById('careers')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }
                }}
                className="font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1"
              >
                Careers
              </a>
            )}

            <hr className="my-2 border-autumn-bark/10" />

            {user ? (
              <div className="flex flex-col gap-3">
                <div className="bg-[#EBE3D3] border border-[#3A2A1E]/10 p-4 rounded-2xl flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-autumn-maple font-outfit text-md font-bold text-[#F3ECDD] shadow-md overflow-hidden shrink-0">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-outfit text-sm font-bold text-[#3A2A1E] truncate">{user.name}</div>
                    <div className="text-xxs text-[#3A2A1E]/60 truncate">{user.email}</div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsDashboardOpen?.(true);
                    setMobileMenuOpen?.(false);
                  }}
                  className="bg-[#C1571F] text-white font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none cursor-pointer"
                >
                  My Dashboard
                </button>
                <button 
                  onClick={() => {
                    handleLogout?.();
                    setMobileMenuOpen?.(false);
                  }}
                  className="text-[#8C2B2A] font-semibold text-center w-full mt-2 text-xs uppercase tracking-wider transition-colors hover:text-[#732221] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('login');
                  else setIsAuthModalOpen?.(true);
                  setMobileMenuOpen?.(false);
                }}
                className="bg-[#C1571F] text-white font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none cursor-pointer"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
