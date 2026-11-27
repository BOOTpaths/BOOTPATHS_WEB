import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function TrekCard({ trek, onGetDetails, onOpenTrekPreview, onBookNow }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState(trek.image || trek.coverImage || trek.thumbnail || '/placeholder-trek.jpg');

  const isHidden = trek.isVisible === false || trek.isHidden === true || trek.status === 'draft' || trek.status === 'hidden';

  const handleDetailsClick = (e) => {
    if (e) e.stopPropagation();
    if (isHidden) {
      return;
    }

    if (onOpenTrekPreview) {
      onOpenTrekPreview(trek);
      return;
    }

    if (onGetDetails) {
      onGetDetails(trek);
      return;
    }
  };

  // Multi-batch support & earliest upcoming active batch
  const allDates = trek.batchDates && Array.isArray(trek.batchDates) && trek.batchDates.length > 0 
    ? trek.batchDates 
    : (trek.dates ? (Array.isArray(trek.dates) ? trek.dates : [trek.dates]) : (trek.date ? [trek.date] : []));
  const activeBatchDate = allDates.length > 0 ? allDates[0] : (trek.date || null);
  const slotsCount = Number(trek.availableSlots ?? trek.slotsLeft ?? trek.slots ?? 0);

  const handleBookClick = (e) => {
    if (e) e.stopPropagation();
    if (isHidden) {
      return;
    }

    if (slotsCount <= 0) {
      // Check if there is another upcoming batch date
      const alternativeBatch = (allDates.length > 1) ? allDates[1] : null;
      if (alternativeBatch && onBookNow) {
        onBookNow(trek, alternativeBatch);
        return;
      }
      // If completely full, trigger request callback
      const callbackBtn = document.getElementById('request-callback-btn') || document.querySelector('[data-action="request-callback"]');
      if (callbackBtn) {
        callbackBtn.click();
        return;
      }
    }

    if (onBookNow) {
      onBookNow(trek, activeBatchDate);
    }
  };

  const tagText = trek.tag || (slotsCount !== undefined && Number(slotsCount) <= 5 && Number(slotsCount) > 0 ? 'LIMITED SLOTS' : null);
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

        {/* Bottom Gradient Scrim + Live Next Date & Slots Overlay */}
        <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Bottom-Left: Next Batch Date */}
          <div className="inline-flex items-center gap-1.5 text-white text-xs font-bold tracking-tight drop-shadow-sm min-w-0 truncate">
            <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">
              {activeBatchDate ? `Next: ${activeBatchDate}` : 'Dates TBA'}
            </span>
          </div>

          {/* Bottom-Right: Live Available Slots Pill */}
          {(() => {
            if (slotsCount <= 0) {
              return (
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/15 text-stone-200 text-[11px] font-bold">
                  Batch full
                </span>
              );
            }
            if (slotsCount <= 5) {
              return (
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-orange-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
                  {slotsCount} {slotsCount === 1 ? 'slot' : 'slots'} left
                </span>
              );
            }
            return (
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
                {slotsCount} slots left
              </span>
            );
          })()}
        </div>
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
              type="button"
              onClick={handleDetailsClick} 
              className="flex-1 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center font-['Open_Sans'] border border-stone-200"
            >
              GET INFO
            </button>
            <button 
              type="button"
              onClick={handleBookClick} 
              className="flex-1 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-bold uppercase tracking-wider rounded-lg bg-[#EB5A0D] hover:bg-[#D44E08] text-white shadow-sm transition-colors cursor-pointer text-center border-none font-['Open_Sans']"
            >
              BOOK NOW
            </button>
          </>
        )}
      </div>
    </div>
  );
}
