/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import React from 'react';
import { Menu, X, LogOut, Shield, Search, ChevronDown } from 'lucide-react';

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

export default function Navbar({
  isCareersEnabled,
  user,
  userRole,
  handleLogout,
  setIsDashboardOpen,
  setIsAuthModalOpen,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  const [showAnnouncement, setShowAnnouncement] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mobileUpcomingOpen, setMobileUpcomingOpen] = React.useState(false);
  const [mobileWesternOpen, setMobileWesternOpen] = React.useState(false);
  const [mobileHimalayanOpen, setMobileHimalayanOpen] = React.useState(false);
  const [mobileInternationalOpen, setMobileInternationalOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Top Announcement Strip */}
      {showAnnouncement && (
        <div className="bg-[#C1571F] text-white text-xs font-medium py-1.5 px-4 flex justify-between items-center z-50">
          <div className="flex-1 text-center font-outfit">
            <span>🌲 Netravathi & Brahmagiri Weekend Slots Open — Limited Batches Available! </span>
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

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
            <span className="absolute left-3.5 text-autumn-bark/40">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search treks by region, difficulty, season..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/40 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none focus:bg-[#EFE8D6]/80 focus:border-[#C1571F]/50 transition-all font-outfit"
            />
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
              onClick={(e) => { e.preventDefault(); document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="font-outfit text-sm font-semibold tracking-wide text-autumn-bark/80 hover:text-[#C1571F] transition-colors"
            >
              Blogs
            </a>

            {/* Nav CTA / User Avatar */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5 rounded-full border border-autumn-bark/10 bg-[#EFE8D6]/60 p-1.5 pr-4 transition-all duration-200 hover:border-autumn-maple/50 hover:bg-[#EFE8D6] focus:outline-none focus:ring-2 focus:ring-autumn-maple">
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
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2"
                    >
                      🛠️ DEVELOPER CONSOLE
                    </button>
                  )}
                  {user && userRole === 'admin' && (
                    <button 
                      onClick={() => { window.location.hash = '#admin'; }}
                      className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider bg-[#C1571F] text-white hover:bg-[#a34718] transition-colors flex items-center gap-1.5"
                    >
                      ⚙️ ADMIN PORTAL
                    </button>
                  )}
                  <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-autumn-maple hover:bg-autumn-maple/10 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left rounded px-3 py-2 mt-1 text-xs font-outfit font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="border border-[#C1571F] text-[#C1571F] hover:bg-[#C1571F] hover:text-[#3A2A1E] font-bold text-xs uppercase tracking-wider rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/40 text-autumn-bark transition-colors hover:bg-[#EFE8D6] md:hidden shrink-0 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

        {/* Community & Stories */}
        <a 
          href="#blogs" 
          onClick={(e) => { e.preventDefault(); document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="hover:text-[#C1571F] transition-colors cursor-pointer uppercase font-bold"
        >
          Blogs
        </a>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b border-autumn-bark/10 bg-autumn-mist/95 px-8 py-6 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200 overflow-y-auto max-h-[70vh] z-40">
          <nav className="flex flex-col gap-5">
            {/* Search Input for Mobile */}
            <div className="relative w-full">
              <span className="absolute left-3.5 top-3 text-autumn-bark/40">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search treks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-full bg-[#EFE8D6]/60 border border-autumn-bark/10 text-autumn-bark placeholder:text-autumn-bark/40 focus:outline-none font-outfit"
              />
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
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">All Live Batches</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Weekend Treks</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Premium Small Batches</a>
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
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Netravathi Peak Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Brahmagiri Coorg Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Vellagavi Village Trek</a>
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
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Kedarkantha Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Hampta Pass Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Roopkund Trek</a>
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
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Mt. Kilimanjaro Expedition</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Everest Base Camp Trek</a>
                  <a href="#upcoming-treks" onClick={() => setMobileMenuOpen(false)} className="text-autumn-bark/70 hover:text-autumn-maple transition-colors">Annapurna Circuit</a>
                </div>
              )}
            </div>

            <a 
              href="#advantage" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1"
            >
              Eco-Initiatives
            </a>

            <a 
              href="#blogs" 
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false); 
                document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              className="font-outfit text-base font-bold text-autumn-bark/85 hover:text-autumn-maple py-1"
            >
              Blogs
            </a>

            {isCareersEnabled && (
              <a 
                href="#careers" 
                onClick={() => setMobileMenuOpen(false)}
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
                    setIsDashboardOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#C1571F] text-white font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none cursor-pointer"
                >
                  My Dashboard
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#8C2B2A] font-semibold text-center w-full mt-2 text-xs uppercase tracking-wider transition-colors hover:text-[#732221] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="bg-[#C1571F] text-[#3A2A1E] font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none cursor-pointer"
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
