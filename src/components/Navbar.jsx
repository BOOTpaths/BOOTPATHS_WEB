/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import React from 'react';

export default function ProfileDropdown({ user, userRole, handleLogout, setIsDashboardOpen }) {
  return (
    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-2 shadow-sm z-50">
      <div className="px-3 py-1.5 border-b border-[#E7E7E4] text-[10px] text-[#52524E] uppercase tracking-widest font-bold">
        {user.email}
      </div>
      {(userRole === 'developer' || user?.role === 'developer' || user?.email === 'vzentura2026@gmail.com') && (
        <button 
          onClick={() => { window.location.hash = '#dev-ops'; }}
          className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2"
        >
          🛠️ DEVELOPER CONSOLE
        </button>
      )}
      {userRole === 'admin' && (
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
  );
}
