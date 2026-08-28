/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import React from 'react';
import { Menu, X, LogOut, Shield } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-autumn-bark/10 bg-autumn-mist/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12">
        <a href="/#" className="flex items-center gap-2.5 select-none hover:opacity-95 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white border border-[#3E2723]/30 shadow-sm flex items-center justify-center overflow-hidden p-1">
            <img src="/logo.png" alt="BOOTpaths" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tight select-none">
            <span className="text-[#FF6B00]">BOOT</span>
            <span className="text-[#8B2626]">paths</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#upcoming-treks" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
            Upcoming Treks
          </a>

          <a href="#advantage" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
            Our Crew
          </a>
          <a href="#community" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
            Community
          </a>
          {isCareersEnabled && (
            <a href="#careers" className="font-outfit text-sm font-medium tracking-wide text-autumn-bark/80 transition-colors hover:text-autumn-maple">
              Careers
            </a>
          )}
        </nav>

        {/* Nav CTA / User Avatar */}
        <div className="hidden items-center gap-4 md:flex">
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
              className="border border-[#C1571F] text-[#C1571F] hover:bg-[#C1571F] hover:text-[#3A2A1E] font-bold text-xs uppercase tracking-wider rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/40 text-autumn-bark transition-colors hover:bg-[#EFE8D6] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full border-b border-autumn-bark/10 bg-autumn-mist/95 px-8 py-6 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-5">
            <a 
              href="#upcoming-treks" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
            >
              Upcoming Treks
            </a>

            <a 
              href="#advantage" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
            >
              Our Crew
            </a>
            <a 
              href="#community" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
            >
              Community
            </a>
            {isCareersEnabled && (
              <a 
                href="#careers" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-outfit text-lg font-medium text-autumn-bark/80 hover:text-autumn-maple"
              >
                Careers
              </a>
            )}
            <hr className="my-2 border-autumn-bark/10" />
            {user ? (
              <div className="flex flex-col gap-3">
                {/* User Profile Summary Badge */}
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
                {/* My Dashboard Button */}
                <button 
                  onClick={() => {
                    setIsDashboardOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#C1571F] text-white font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none"
                >
                  My Dashboard
                </button>
                {/* Sign Out Button */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#8C2B2A] font-semibold text-center w-full mt-2 text-xs uppercase tracking-wider transition-colors hover:text-[#732221]"
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
                className="bg-[#C1571F] text-[#3A2A1E] font-bold py-3 w-full rounded-xl text-center font-outfit text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#a44717] focus:outline-none"
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
