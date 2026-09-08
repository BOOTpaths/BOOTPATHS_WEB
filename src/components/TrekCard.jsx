import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function TrekCard({ trek, onGetDetails, onBookNow }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState(trek.image || trek.coverImage || trek.thumbnail || '/placeholder-trek.jpg');

  const isHidden = trek.isVisible === false || trek.isHidden === true || trek.status === 'draft' || trek.status === 'hidden';

  const handleDetailsClick = (e) => {
    if (e) e.stopPropagation();
    if (isHidden) {
      return;
    }

    if (onGetDetails) {
      onGetDetails(trek);
      return;
    }

    const detailsUrl = trek.detailsUrl || trek.details_url;
    if (detailsUrl && detailsUrl.trim()) {
      const trimmed = detailsUrl.trim();
      if (trimmed.startsWith('/treks/') || trimmed.startsWith('treks/')) {
        const fullUrl = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        window.open(fullUrl, '_blank');
        return;
      }
      if (trimmed.startsWith('#')) {
        window.location.hash = trimmed;
        return;
      }
    }

    const trekTitle = (trek.name || trek.title || '').toLowerCase();
    if (trek.id === 'silent-valley' || trek.slug === 'silent-valley' || trekTitle.includes('silent valley')) {
      window.location.hash = '#silent-valley';
      return;
    }
  };

  const handleBookClick = (e) => {
    if (e) e.stopPropagation();
    if (isHidden) {
      return;
    }

    if (onBookNow) {
      onBookNow(trek);
    }
  };

  const slotsCount = trek.slotsLeft !== undefined ? trek.slotsLeft : trek.slots;
  const tagText = trek.tag || (slotsCount !== undefined && Number(slotsCount) <= 5 ? 'LIMITED SLOTS' : null);
  const trekName = trek.name || trek.title || 'Wilderness Trail';

  return (
    <div 
      onClick={handleDetailsClick}
      className={`group bg-white border border-[#E7E7E4] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full ${isHidden ? 'bg-slate-50/40 cursor-default' : 'cursor-pointer'}`}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 rounded-t-xl">
        {trek.videoEmbed ? (
          <iframe 
            src={trek.videoEmbed} 
            className={`h-full w-full object-cover border-0 pointer-events-none scale-[1.35] ${isHidden ? 'filter grayscale-[25%] opacity-90' : ''}`} 
            scrolling="no" 
            title={trekName}
          />
        ) : trek.videoLocal ? (
          <video 
            src={trek.videoLocal} 
            className={`h-full w-full object-cover ${isHidden ? 'filter grayscale-[25%] opacity-90' : ''}`} 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : (
          <img
            src={imgSrc}
            alt={trekName}
            onError={() => setImgSrc('/placeholder-trek.jpg')}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHidden ? 'filter grayscale-[25%] opacity-90' : 'group-hover:scale-105'}`}
          />
        )}

        {/* Top Status Tag */}
        {isHidden ? (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded shadow-sm z-10 backdrop-blur-sm">
            DRAFT / HIDDEN
          </span>
        ) : tagText ? (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#EB5A0D] text-white px-2 py-0.5 rounded shadow-sm z-10">
            {tagText}
          </span>
        ) : null}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Save to Wishlist"
          className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white text-slate-700 w-7 h-7 rounded-full flex items-center justify-center shadow-sm z-10 cursor-pointer transition-transform duration-200 hover:scale-110 border-none"
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1">
        {/* Compact Metadata Line */}
        <div className="px-4 pt-3 pb-1 flex items-center flex-wrap gap-1.5 text-[11px] text-[#6B7280] font-medium font-['Open_Sans']">
          <span>{trek.duration || "3 Days"}</span>
          <span>•</span>
          <span>{trek.difficulty || "Moderate"}</span>
          <span>•</span>
          <span>{trek.altitude || "2,383m"}</span>
        </div>

        {/* Trek Title */}
        <h3 
          className={`px-4 font-bold text-sm md:text-base text-[#1A1A18] tracking-tight uppercase line-clamp-1 mt-1 font-['Open_Sans'] transition-colors ${isHidden ? 'text-slate-600' : 'group-hover:text-[#EB5A0D]'}`} 
          title={trekName}
        >
          {trekName}
        </h3>

        {/* One-Line Hook / Short Teaser */}
        <p className="px-4 text-xs text-[#52524E] line-clamp-2 mt-1 mb-3 leading-relaxed font-['Open_Sans']">
          {trek.shortDescription || trek.description || trek.summary || "Explore untouched evergreen trails and scenic wilderness."}
        </p>
      </div>

      {/* Compact Button Actions (Bottom Row) */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2 mt-auto">
        {isHidden ? (
          <div className="w-full">
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-1.5 opacity-90 select-none font-['Open_Sans']"
              title="This expedition is currently closed or in draft mode"
            >
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span>Currently Unavailable</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1 font-medium font-['Open_Sans']">
              Trail registrations temporarily suspended
            </p>
          </div>
        ) : (
          <>
            <button 
              onClick={handleDetailsClick} 
              className="flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-center bg-white font-['Open_Sans']"
            >
              GET INFO
            </button>
            <button 
              onClick={handleBookClick} 
              className="flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-[#EB5A0D] hover:bg-[#D44E08] text-white shadow-sm transition-colors cursor-pointer text-center border-none font-['Open_Sans']"
            >
              BOOK NOW
            </button>
          </>
        )}
      </div>
    </div>
  );
}
