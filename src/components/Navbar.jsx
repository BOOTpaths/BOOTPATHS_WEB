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
  Search, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Compass,
  TreePine,
  Sparkles
} from 'lucide-react';

const STATIC_WESTERN_GHATS = [
  { id: 'silent-valley', name: 'Silent Valley Rainforest Trek', duration: '3 Days', url: '#silent-valley', isSpecial: true },
  { id: 'agasthyarkoodam', name: 'Agasthyarkoodam Peak', duration: '3 Days', url: '/treks/Agasthyarkoodam/Assets/index.html' },
  { id: 'brahmagiri', name: 'Brahmagiri Coorg Trek', duration: '2 Days', url: '/treks/Brahmagiri/index.html' },
  { id: 'meeshapulimala', name: 'Meeshapulimala Peak', duration: '2 Days', url: '/treks/Meeshapulimala/index.html' },
  { id: 'kolukkumala', name: 'Kolukkumala Sunrise Trek', duration: '2 Days', url: '/treks/Kolukkumala/index.html' },
  { id: 'arippa', name: 'Arippa Rainforest Trail', duration: '2 Days', url: '/treks/Arippa/index.html' },
  { id: 'banasura', name: 'Banasura Hills Trek', duration: '2 Days', url: '/treks/Banasura/index.html' },
  { id: 'chimmini', name: 'Chimmini Amphitheatre Walk', duration: '2 Days', url: '/treks/Chimmini-amphi/index.html' },
  { id: 'parambikulam', name: 'Parambikulam Jungle Trek', duration: '2 Days', url: '/treks/Parambikulam/index.html' },
  { id: 'periyar-border', name: 'Periyar Border Trail', duration: '2 Days', url: '/treks/Periyar-boarder/index.html' },
  { id: 'thommankuthu', name: 'Thommankuthu Waterfalls', duration: '1 Day', url: '/treks/Thommankuthu/index.html' },
  { id: 'yellapatty', name: 'Yellapatty Shola Ridge', duration: '2 Days', url: '/treks/Yellapatty/index.html' },
  { id: 'chokkramudi', name: 'Chokramudi Peak Trail', duration: '1 Day', url: '/treks/chokkramudi/index.html' },
  { id: 'peechimoodal', name: 'Peechimoodal Forest Walk', duration: '1 Day', url: '/treks/peechimoodal/index.html' }
];

const STATIC_HIMALAYAN_TRAILS = [
  { id: 'ebc-trek', name: 'Everest Base Camp (EBC)', duration: '14 Days', url: '/treks/ebc-trek/index.html' },
  { id: 'goechala-pass', name: 'Goechala Pass Kanchenjunga', duration: '10 Days', url: '/treks/Goachala-pass/index.html' },
  { id: 'valley-of-flowers', name: 'Valley of Flowers Trek', duration: '6 Days', url: '#upcoming-treks' },
  { id: 'kedarkantha', name: 'Kedarkantha Summit Trek', duration: '5 Days', url: '#upcoming-treks' },
  { id: 'hampta-pass', name: 'Hampta Pass Crossover', duration: '5 Days', url: '#upcoming-treks' },
  { id: 'roopkund', name: 'Roopkund Mystery Lake', duration: '6 Days', url: '#upcoming-treks' }
];

const STATIC_INTERNATIONAL_TREKS = [
  { id: 'kilimanjaro', name: 'Mt. Kilimanjaro Expedition', duration: '8 Days', url: '/treks/Kilimanjaro/index.html' },
  { id: 'mt-elbrus', name: 'Mt. Elbrus Summit Expedition', duration: '9 Days', url: '/treks/Mt.Elbrus/index.html' },
  { id: 'annapurna-circuit', name: 'Annapurna Circuit Trek', duration: '12 Days', url: '#upcoming-treks' }
];

const STATIC_UPCOMING_ITEMS = [
  { id: 'all-batches', name: 'All Live Batches', duration: 'View All', url: '#upcoming-treks' },
  { id: 'weekend-treks', name: 'Weekend Wilderness Escapes', duration: '2-3 Days', url: '#upcoming-treks' },
  { id: 'small-batches', name: 'Small Group Batches (12-15 Max)', duration: 'Exclusive', url: '#upcoming-treks' },
  { id: 'high-altitude', name: 'High Altitude Expeditions', duration: '5-14 Days', url: '#upcoming-treks' },
  { id: 'beginner-friendly', name: 'Beginner & Solo-Friendly', duration: 'Easy-Mod', url: '#upcoming-treks' }
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
  
  // Desktop Category Dropdowns state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);

  // User / Admin Dropdown state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Mobile Accordion state
  const [mobileUpcomingOpen, setMobileUpcomingOpen] = useState(false);
  const [mobileWesternOpen, setMobileWesternOpen] = useState(false);
  const [mobileHimalayanOpen, setMobileHimalayanOpen] = useState(false);
  const [mobileInternationalOpen, setMobileInternationalOpen] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Handle click outside & escape key to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktopSearch = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const isOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);
      if (isOutsideDesktopSearch && isOutsideMobileSearch) {
        setIsDropdownOpen(false);
      }

      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Dropdown hover & toggle helpers
  const handleMouseEnter = (menuKey) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleToggleDropdown = (menuKey) => {
    setActiveDropdown((prev) => (prev === menuKey ? null : menuKey));
  };

  const userEmail = (user?.email || "").trim().toLowerCase();
  const isDevOpsUser = userEmail === "vzentura2026@gmail.com" || (typeof window !== 'undefined' && sessionStorage.getItem('isDevOps') === 'true');
  const isAdminUser = userEmail === "admin@bootpaths.com" || isDevOpsUser || (typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true');
  const isAuthorized = isAdminUser;
  const isAdminOrDev = isAuthorized;

  // Build dynamic categorized trek lists
  const westernGhatsTreks = useMemo(() => {
    const list = [...STATIC_WESTERN_GHATS];
    (treks || []).forEach(t => {
      if (!isAdminOrDev && (t.isVisible === false || t.isHidden === true)) return;
      const title = (t.name || t.title || '').toLowerCase();
      const region = (t.region || t.location || '').toLowerCase();
      const isWG = region.includes('western') || region.includes('kerala') || region.includes('karnataka') || region.includes('tamil nadu');
      if (isWG && !list.some(item => item.name.toLowerCase() === title || item.id === t.id)) {
        list.push({
          id: t.id,
          name: t.name || t.title,
          duration: t.duration || '2-3 Days',
          url: t.detailsUrl || '#upcoming-treks',
          isVisible: t.isVisible
        });
      }
    });
    return list;
  }, [treks, isAdminOrDev]);

  const himalayanTreks = useMemo(() => {
    const list = [...STATIC_HIMALAYAN_TRAILS];
    (treks || []).forEach(t => {
      if (!isAdminOrDev && (t.isVisible === false || t.isHidden === true)) return;
      const title = (t.name || t.title || '').toLowerCase();
      const region = (t.region || t.location || '').toLowerCase();
      const isHimalayan = region.includes('himalay') || region.includes('uttarakhand') || region.includes('himachal') || region.includes('nepal');
      if (isHimalayan && !list.some(item => item.name.toLowerCase() === title || item.id === t.id)) {
        list.push({
          id: t.id,
          name: t.name || t.title,
          duration: t.duration || '5-10 Days',
          url: t.detailsUrl || '#upcoming-treks',
          isVisible: t.isVisible
        });
      }
    });
    return list;
  }, [treks, isAdminOrDev]);

  const internationalTreks = useMemo(() => {
    const list = [...STATIC_INTERNATIONAL_TREKS];
    (treks || []).forEach(t => {
      if (!isAdminOrDev && (t.isVisible === false || t.isHidden === true)) return;
      const title = (t.name || t.title || '').toLowerCase();
      const region = (t.region || t.location || '').toLowerCase();
      const isIntl = region.includes('international') || region.includes('africa') || region.includes('tanzania') || region.includes('russia') || region.includes('europe');
      if (isIntl && !list.some(item => item.name.toLowerCase() === title || item.id === t.id)) {
        list.push({
          id: t.id,
          name: t.name || t.title,
          duration: t.duration || '8-14 Days',
          url: t.detailsUrl || '#upcoming-treks',
          isVisible: t.isVisible
        });
      }
    });
    return list;
  }, [treks, isAdminOrDev]);

  // Merge live treks with curated defaults for universal search indexing
  const allIndexedTreks = useMemo(() => {
    const map = new Map();
    STATIC_WESTERN_GHATS.forEach(t => map.set(t.id, { ...t, region: 'Western Ghats' }));
    STATIC_HIMALAYAN_TRAILS.forEach(t => map.set(t.id, { ...t, region: 'Himalayan Trails' }));
    STATIC_INTERNATIONAL_TREKS.forEach(t => map.set(t.id, { ...t, region: 'International Treks' }));
    (treks || []).forEach(t => {
      if (!isAdminOrDev && (t.isVisible === false || t.isHidden === true)) return;
      const existing = map.get(t.id) || {};
      map.set(t.id, { ...existing, ...t });
    });
    return Array.from(map.values());
  }, [treks, isAdminOrDev]);

  const queryClean = searchQuery.trim().toLowerCase();

  const { filteredTreks, filteredBlogs, filteredSections, totalMatches } = useMemo(() => {
    if (!queryClean) {
      return { filteredTreks: [], filteredBlogs: [], filteredSections: [], totalMatches: 0 };
    }

    const matchedTreks = allIndexedTreks.filter(t => {
      const title = (t.name || t.title || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      const region = (t.region || '').toLowerCase();
      const diff = (t.difficulty || '').toLowerCase();
      const tag = (t.tag || '').toLowerCase();
      const desc = (t.description || t.shortDescription || '').toLowerCase();
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
  const handleItemNavigate = (e, item) => {
    setActiveDropdown(null);
    setMobileMenuOpen?.(false);

    const url = item.url || item.detailsUrl;
    if (url) {
      if (url.startsWith('/treks/') || url.startsWith('treks/')) {
        const fullUrl = url.startsWith('/') ? url : `/${url}`;
        window.open(fullUrl, '_blank');
        e.preventDefault();
        return;
      }
      if (url === '#silent-valley' || item.isSpecial || (item.name && item.name.toLowerCase().includes('silent valley'))) {
        window.location.hash = '#silent-valley';
        window.scrollTo(0, 0);
        e.preventDefault();
        return;
      }
      if (url.startsWith('#')) {
        window.location.hash = url;
        const targetId = url.replace('#', '');
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }

    if (item.id === 'silent-valley' || (item.name && item.name.toLowerCase().includes('silent valley'))) {
      window.location.hash = '#silent-valley';
      window.scrollTo(0, 0);
      e.preventDefault();
      return;
    }

    if (onSelectTrek) {
      onSelectTrek(item);
    } else {
      window.location.hash = '#upcoming-treks';
      setTimeout(() => {
        document.getElementById('upcoming-treks')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleTrekClick = (trek) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setMobileMenuOpen?.(false);

    if (trek.id === 'silent-valley' || trek.url === '#silent-valley' || (trek.name || trek.title || '').toLowerCase().includes('silent valley')) {
      window.location.hash = '#silent-valley';
      window.scrollTo(0, 0);
      return;
    }

    if (trek.url && trek.url.startsWith('/treks/')) {
      window.open(trek.url, '_blank');
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

  // Reusable search dropdown component
  const renderSearchResultsDropdown = () => {
    if (!isDropdownOpen || queryClean.length === 0) return null;

    return (
      <div className="absolute top-full mt-2 left-0 w-full md:w-[480px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-[#F5F5F3] max-h-[460px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 text-left">
        {totalMatches === 0 ? (
          <div className="p-6 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FFF2EA] text-[#EB5A0D] flex items-center justify-center mb-2.5">
              <Search className="h-5 w-5" />
            </div>
            <p className="font-outfit text-sm font-bold text-[#1A1A18]">
              No matching results for "{searchQuery}"
            </p>
            <p className="text-xs text-[#52524E] mt-1 font-['Open_Sans']">
              Try searching for "Silent Valley", "Western Ghats", "Safety", or "Himalayan".
            </p>
          </div>
        ) : (
          <>
            {/* 🌲 Treks & Expeditions */}
            {filteredTreks.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE] font-['Open_Sans']">
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
                          <span className="font-['Open_Sans'] text-sm font-bold text-[#1A1A18] group-hover:text-[#EB5A0D] transition-colors truncate">
                            {trek.name || trek.title}
                          </span>
                          {trek.difficulty && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE8D6] text-[#6B4E3D]">
                              {trek.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#52524E] mt-0.5 font-['Open_Sans']">
                          <span className="truncate">{trek.location || trek.region}</span>
                          {trek.duration && <span>• {trek.duration}</span>}
                          {trek.price && (
                            <span className="font-bold text-[#EB5A0D]">
                              • ₹{Number(trek.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#EB5A0D] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 📝 Blogs & Stories */}
            {filteredBlogs.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE] font-['Open_Sans']">
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
                        <span className="font-['Open_Sans'] text-sm font-bold text-[#1A1A18] group-hover:text-[#EB5A0D] transition-colors truncate block">
                          {blog.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[#52524E] mt-0.5 font-['Open_Sans']">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EB5A0D]">
                            {blog.category || blog.categoryTag || 'Article'}
                          </span>
                          {blog.authorName && <span>• By {blog.authorName}</span>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#EB5A0D] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 🧭 Navigation & Sections */}
            {filteredSections.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FBFBFA] text-[11px] font-bold text-[#8C8C88] uppercase tracking-wider flex items-center justify-between border-b border-[#F0F0EE] font-['Open_Sans']">
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
                          <span className="font-['Open_Sans'] text-sm font-bold text-[#1A1A18] group-hover:text-[#EB5A0D] transition-colors truncate">
                            {section.title}
                          </span>
                          {section.badge && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0F0EE] text-[#52524E]">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#52524E] mt-0.5 truncate font-['Open_Sans']">
                          {section.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C8C88] group-hover:text-[#EB5A0D] group-hover:translate-x-0.5 transition-all shrink-0" />
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
        <div className="bg-[#EB5A0D] text-white text-xs font-medium py-1.5 px-4 flex justify-between items-center z-50 font-['Open_Sans']">
          <div className="flex-1 text-center">
            <span>🌲 Netravathi, Agasthyarkoodam &amp; Brahmagiri Weekend Slots Open — Limited Batches Available! </span>
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
      <div className="relative z-50 border-b border-autumn-bark/10 bg-autumn-mist/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12 gap-4">
          {/* Left: Brand typography */}
          <a href="/#" className="flex items-center gap-2.5 select-none hover:opacity-95 transition-opacity shrink-0">
            <div className="w-10 h-10 rounded-full bg-white border border-[#3E2723]/30 shadow-sm flex items-center justify-center overflow-hidden p-1">
              <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight select-none font-['Open_Sans']">
              <span className="text-[#EB5A0D]">BOOT</span>
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
              className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/40 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none focus:bg-[#EFE8D6]/80 focus:border-[#EB5A0D]/50 transition-all font-['Open_Sans']"
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
          <div className="hidden md:flex items-center gap-6 font-['Open_Sans']">
            {isCareersEnabled && (
              <a href="#careers" className="text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#EB5A0D] transition-colors">
                Careers
              </a>
            )}
            <a href="#advantage" className="text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#EB5A0D] transition-colors">
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
              className="text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#EB5A0D] transition-colors"
            >
              Blogs
            </a>

            {/* Nav CTA / User Avatar & Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-full border border-autumn-bark/10 bg-[#EFE8D6]/60 p-1.5 pr-3.5 transition-all duration-200 hover:border-[#EB5A0D]/50 hover:bg-[#EFE8D6] focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] cursor-pointer select-none"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EB5A0D] text-sm font-bold text-white shadow-md">
                    {user.initials}
                  </div>
                  <span className="text-xs font-bold text-autumn-bark/80 tracking-wide max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`h-3 w-3 text-autumn-bark/60 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 top-full mt-2 w-52 bg-white border border-[#E7E7E4] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden transition-all duration-200 ease-out origin-top-right ${
                    userDropdownOpen 
                      ? 'opacity-100 scale-100 pointer-events-auto' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-[#F0F0EE] text-[10px] text-autumn-bark/50 uppercase tracking-widest font-bold truncate">
                    {user.email}
                  </div>

                  {user && (
                    <>
                      {isAdminUser && (
                        <button
                          onClick={() => { 
                            setUserDropdownOpen(false);
                            window.location.hash = '#admin'; 
                            window.location.reload(); 
                          }}
                          className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#EB5A0D] hover:bg-[#D44E08] rounded-xl transition-colors mb-1.5 flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                          <span>⚙️</span> ADMIN PORTAL (TREKS & BOOKINGS)
                        </button>
                      )}

                      {isDevOpsUser && (
                        <button
                          onClick={() => { 
                            setUserDropdownOpen(false);
                            window.location.hash = '#devops'; 
                            window.location.reload(); 
                          }}
                          className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-200 bg-[#21262D] hover:bg-[#30363D] rounded-xl transition-colors mb-1.5 flex items-center gap-2 border border-stone-700 shadow-sm cursor-pointer"
                        >
                          <span>🛠️</span> DEVOPS CONSOLE (FLAGS & TOGGLES)
                        </button>
                      )}
                    </>
                  )}

                  <button 
                    onClick={() => { 
                      setUserDropdownOpen(false);
                      setIsDashboardOpen?.(true); 
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#52524E] hover:bg-[#FAF8F5] hover:text-[#1A1A18] transition-colors cursor-pointer w-full text-left"
                  >
                    Dashboard
                  </button>

                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout?.();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors border-t border-[#F3F4F6] mt-1 cursor-pointer w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => (onOpenAuth ? onOpenAuth('login') : setIsAuthModalOpen?.(true))}
                className="bg-[#EB5A0D] hover:bg-[#D44E08] text-white font-bold text-xs uppercase tracking-wider rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none cursor-pointer shadow-sm"
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

      {/* Category Sub-Navigation Bar (Tier 2 - Dynamic Dropdowns) */}
      <div 
        ref={navContainerRef}
        className="relative z-20 bg-[#F8F8F6] border-b border-[#E7E7E4] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#52524E] px-4 sm:px-8 py-2 flex items-center justify-center gap-4 sm:gap-8 overflow-visible font-['Open_Sans']"
      >
        {/* 1. UPCOMING TREKS */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('upcoming')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleToggleDropdown('upcoming')}
            className={`flex items-center gap-1.5 uppercase font-bold tracking-wider py-1 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'upcoming' ? 'text-[#EB5A0D]' : 'hover:text-[#EB5A0D]'}`}
            aria-expanded={activeDropdown === 'upcoming'}
          >
            <span>UPCOMING TREKS</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'upcoming' ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
          </button>

          {/* Dropdown Panel */}
          <div 
            className={`absolute top-full left-0 mt-2 min-w-[270px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl py-2 z-50 overflow-hidden transition-all duration-200 ease-out transform ${
              activeDropdown === 'upcoming' 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F8F8F6]">
              {STATIC_UPCOMING_ITEMS.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.url}
                  onClick={(e) => handleItemNavigate(e, item)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#FAF8F5] hover:text-[#EB5A0D] transition-colors group"
                >
                  <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{item.name}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold shrink-0">{item.duration}</span>
                </a>
              ))}
            </div>
            <div className="border-t border-[#F3F4F6] mt-1 pt-1">
              <a 
                href="#upcoming-treks" 
                onClick={(e) => handleItemNavigate(e, { url: '#upcoming-treks' })}
                className="block px-4 py-2 text-[11px] font-bold text-[#EB5A0D] uppercase tracking-wider hover:underline"
              >
                Explore All Live Expeditions →
              </a>
            </div>
          </div>
        </div>

        {/* 2. WESTERN GHATS */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('western')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleToggleDropdown('western')}
            className={`flex items-center gap-1.5 uppercase font-bold tracking-wider py-1 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'western' ? 'text-[#EB5A0D]' : 'hover:text-[#EB5A0D]'}`}
            aria-expanded={activeDropdown === 'western'}
          >
            <span>WESTERN GHATS</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'western' ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
          </button>

          {/* Dropdown Panel */}
          <div 
            className={`absolute top-full left-0 mt-2 min-w-[280px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl py-2 z-50 overflow-hidden transition-all duration-200 ease-out transform ${
              activeDropdown === 'western' 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F8F8F6]">
              {westernGhatsTreks.map((trek, idx) => (
                <a 
                  key={idx}
                  href={trek.url || "#upcoming-treks"}
                  onClick={(e) => handleItemNavigate(e, trek)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#FAF8F5] hover:text-[#EB5A0D] transition-colors group"
                >
                  <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{trek.name}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold shrink-0">{trek.duration || "Details →"}</span>
                </a>
              ))}
            </div>
            <div className="border-t border-[#F3F4F6] mt-1 pt-1">
              <a 
                href="#upcoming-treks" 
                onClick={(e) => handleItemNavigate(e, { url: '#upcoming-treks' })}
                className="block px-4 py-2 text-[11px] font-bold text-[#EB5A0D] uppercase tracking-wider hover:underline"
              >
                Explore All Western Ghats Trails →
              </a>
            </div>
          </div>
        </div>

        {/* 3. HIMALAYAN TRAILS */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('himalayan')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleToggleDropdown('himalayan')}
            className={`flex items-center gap-1.5 uppercase font-bold tracking-wider py-1 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'himalayan' ? 'text-[#EB5A0D]' : 'hover:text-[#EB5A0D]'}`}
            aria-expanded={activeDropdown === 'himalayan'}
          >
            <span>HIMALAYAN TRAILS</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'himalayan' ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
          </button>

          {/* Dropdown Panel */}
          <div 
            className={`absolute top-full left-0 mt-2 min-w-[280px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl py-2 z-50 overflow-hidden transition-all duration-200 ease-out transform ${
              activeDropdown === 'himalayan' 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F8F8F6]">
              {himalayanTreks.map((trek, idx) => (
                <a 
                  key={idx}
                  href={trek.url || "#upcoming-treks"}
                  onClick={(e) => handleItemNavigate(e, trek)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#FAF8F5] hover:text-[#EB5A0D] transition-colors group"
                >
                  <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{trek.name}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold shrink-0">{trek.duration || "Details →"}</span>
                </a>
              ))}
            </div>
            <div className="border-t border-[#F3F4F6] mt-1 pt-1">
              <a 
                href="#upcoming-treks" 
                onClick={(e) => handleItemNavigate(e, { url: '#upcoming-treks' })}
                className="block px-4 py-2 text-[11px] font-bold text-[#EB5A0D] uppercase tracking-wider hover:underline"
              >
                Explore All Himalayan Trails →
              </a>
            </div>
          </div>
        </div>

        {/* 4. INTERNATIONAL TREKS */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('international')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleToggleDropdown('international')}
            className={`flex items-center gap-1.5 uppercase font-bold tracking-wider py-1 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'international' ? 'text-[#EB5A0D]' : 'hover:text-[#EB5A0D]'}`}
            aria-expanded={activeDropdown === 'international'}
          >
            <span>INTERNATIONAL TREKS</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'international' ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
          </button>

          {/* Dropdown Panel */}
          <div 
            className={`absolute top-full left-0 mt-2 min-w-[280px] bg-white border border-[#E7E7E4] rounded-2xl shadow-xl py-2 z-50 overflow-hidden transition-all duration-200 ease-out transform ${
              activeDropdown === 'international' 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F8F8F6]">
              {internationalTreks.map((trek, idx) => (
                <a 
                  key={idx}
                  href={trek.url || "#upcoming-treks"}
                  onClick={(e) => handleItemNavigate(e, trek)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#FAF8F5] hover:text-[#EB5A0D] transition-colors group"
                >
                  <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">{trek.name}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold shrink-0">{trek.duration || "Details →"}</span>
                </a>
              ))}
            </div>
            <div className="border-t border-[#F3F4F6] mt-1 pt-1">
              <a 
                href="#upcoming-treks" 
                onClick={(e) => handleItemNavigate(e, { url: '#upcoming-treks' })}
                className="block px-4 py-2 text-[11px] font-bold text-[#EB5A0D] uppercase tracking-wider hover:underline"
              >
                Explore All International Treks →
              </a>
            </div>
          </div>
        </div>

        {/* Eco-Initiatives */}
        <a href="#advantage" className="hover:text-[#EB5A0D] transition-colors cursor-pointer uppercase font-bold py-1">
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
          className="hover:text-[#EB5A0D] transition-colors cursor-pointer uppercase font-bold py-1"
        >
          Blogs
        </a>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b border-autumn-bark/10 bg-autumn-mist/95 px-8 py-6 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200 overflow-y-auto max-h-[75vh] z-40 font-['Open_Sans']">
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
                className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/60 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none"
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
                className="w-full flex items-center justify-between text-left text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1 cursor-pointer"
              >
                <span>UPCOMING TREKS</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileUpcomingOpen ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
              </button>
              {mobileUpcomingOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  {STATIC_UPCOMING_ITEMS.map((item, idx) => (
                    <a 
                      key={idx}
                      href={item.url} 
                      onClick={(e) => handleItemNavigate(e, item)} 
                      className="text-autumn-bark/70 hover:text-[#EB5A0D] transition-colors flex items-center justify-between pr-2"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-[#9CA3AF] font-bold">{item.duration}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Western Ghats */}
            <div>
              <button 
                onClick={() => setMobileWesternOpen(!mobileWesternOpen)}
                className="w-full flex items-center justify-between text-left text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1 cursor-pointer"
              >
                <span>WESTERN GHATS</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileWesternOpen ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
              </button>
              {mobileWesternOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  {westernGhatsTreks.map((trek, idx) => (
                    <a 
                      key={idx}
                      href={trek.url || "#upcoming-treks"} 
                      onClick={(e) => handleItemNavigate(e, trek)} 
                      className="text-autumn-bark/70 hover:text-[#EB5A0D] transition-colors flex items-center justify-between pr-2"
                    >
                      <span>{trek.name}</span>
                      <span className="text-[10px] text-[#9CA3AF] font-bold">{trek.duration}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 3: Himalayan Trails */}
            <div>
              <button 
                onClick={() => setMobileHimalayanOpen(!mobileHimalayanOpen)}
                className="w-full flex items-center justify-between text-left text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1 cursor-pointer"
              >
                <span>HIMALAYAN TRAILS</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileHimalayanOpen ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
              </button>
              {mobileHimalayanOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  {himalayanTreks.map((trek, idx) => (
                    <a 
                      key={idx}
                      href={trek.url || "#upcoming-treks"} 
                      onClick={(e) => handleItemNavigate(e, trek)} 
                      className="text-autumn-bark/70 hover:text-[#EB5A0D] transition-colors flex items-center justify-between pr-2"
                    >
                      <span>{trek.name}</span>
                      <span className="text-[10px] text-[#9CA3AF] font-bold">{trek.duration}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 4: International Treks */}
            <div>
              <button 
                onClick={() => setMobileInternationalOpen(!mobileInternationalOpen)}
                className="w-full flex items-center justify-between text-left text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1 cursor-pointer"
              >
                <span>INTERNATIONAL TREKS</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileInternationalOpen ? 'rotate-180 text-[#EB5A0D]' : ''}`} />
              </button>
              {mobileInternationalOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2.5 text-xs border-l border-autumn-bark/10 ml-2">
                  {internationalTreks.map((trek, idx) => (
                    <a 
                      key={idx}
                      href={trek.url || "#upcoming-treks"} 
                      onClick={(e) => handleItemNavigate(e, trek)} 
                      className="text-autumn-bark/70 hover:text-[#EB5A0D] transition-colors flex items-center justify-between pr-2"
                    >
                      <span>{trek.name}</span>
                      <span className="text-[10px] text-[#9CA3AF] font-bold">{trek.duration}</span>
                    </a>
                  ))}
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
              className="text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1"
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
              className="text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1"
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
                className="text-base font-bold text-autumn-bark/85 hover:text-[#EB5A0D] py-1"
              >
                Careers
              </a>
            )}

            <hr className="my-2 border-autumn-bark/10" />

            {user ? (
              <div className="flex flex-col gap-3">
                <div className="bg-[#EBE3D3] border border-[#3A2A1E]/10 p-4 rounded-2xl flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB5A0D] text-md font-bold text-white shadow-md overflow-hidden shrink-0">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#3A2A1E] truncate">{user.name}</div>
                    <div className="text-xxs text-[#3A2A1E]/60 truncate">{user.email}</div>
                  </div>
                </div>
                {user && (
                  <>
                    {isAdminUser && (
                      <button 
                        onClick={() => {
                          window.location.hash = '#admin';
                          window.location.reload();
                        }}
                        className="bg-[#EB5A0D] hover:bg-[#D44E08] text-white font-bold py-3 w-full rounded-xl text-center text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center gap-2 shadow-sm mb-1.5"
                      >
                        <span>⚙️</span> ADMIN PORTAL (TREKS & BOOKINGS)
                      </button>
                    )}
                    {isDevOpsUser && (
                      <button 
                        onClick={() => {
                          window.location.hash = '#devops';
                          window.location.reload();
                        }}
                        className="bg-[#21262D] hover:bg-[#30363D] border border-stone-700 text-stone-200 font-bold py-3 w-full rounded-xl text-center text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center gap-2 shadow-sm mb-1.5"
                      >
                        <span>🛠️</span> DEVOPS CONSOLE (FLAGS & TOGGLES)
                      </button>
                    )}
                  </>
                )}
                <button 
                  onClick={() => {
                    setIsDashboardOpen?.(true);
                    setMobileMenuOpen?.(false);
                  }}
                  className="bg-white border border-[#E7E7E4] text-[#1A1A18] hover:bg-[#FAF8F5] font-bold py-3 w-full rounded-xl text-center text-sm uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer"
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
                className="bg-[#EB5A0D] hover:bg-[#D44E08] text-white font-bold py-3 w-full rounded-xl text-center text-sm uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer"
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
