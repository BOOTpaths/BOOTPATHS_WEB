import React, { useState } from 'react';
import { MapPin, Heart, CheckCircle2 } from 'lucide-react';

export default function TrekCard({ trek, onGetDetails, onBookNow }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleDetailsClick = () => {
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

    if (trek.id === 'silent-valley' || trek.slug === 'silent-valley' || trek.title?.toLowerCase().includes('silent valley')) {
      window.location.hash = '#silent-valley';
      return;
    }
  };

  const inclusionsList = (trek.inclusion && trek.inclusion.length > 0)
    ? trek.inclusion
    : (trek.inclusions && trek.inclusions.length > 0)
    ? trek.inclusions
    : ['Forest Permits', 'Certified Lead', 'Safety Gear', 'Meals Included'];

  const slotsCount = trek.slotsLeft !== undefined ? trek.slotsLeft : trek.slots;

  return (
    <div className="group bg-white rounded-2xl border border-[#EBEBE8] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Banner */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100">
        {trek.videoEmbed ? (
          <iframe 
            src={trek.videoEmbed} 
            className="h-full w-full object-cover border-0 pointer-events-none scale-[1.35]" 
            scrolling="no" 
            title={trek.title}
          />
        ) : trek.videoLocal ? (
          <video 
            src={trek.videoLocal} 
            className="h-full w-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : (
          <img
            src={trek.image}
            alt={trek.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Top Status Badge */}
        {(trek.tag || (slotsCount !== undefined && Number(slotsCount) <= 5)) && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#EB5A0D] text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase shadow-sm inline-block">
              {trek.tag || (Number(slotsCount) <= 5 ? 'LIMITED SLOTS' : 'POPULAR')}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md z-10 cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center border-none"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Compact Metadata Row */}
        <div className="flex items-center flex-wrap gap-2 text-[12px] text-[#6B7280] font-medium pt-1 pb-1 font-['Open_Sans']">
          {trek.duration && (
            <span className="inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EB5A0D] mr-1.5"></span>
              {trek.duration}
            </span>
          )}
          {trek.difficulty && (
            <span className="inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              {trek.difficulty}
            </span>
          )}
          {trek.altitude && (
            <span className="inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
              {trek.altitude}
            </span>
          )}
          {slotsCount !== undefined && (
            <span className="text-emerald-700 font-semibold ml-auto text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {slotsCount} slots left
            </span>
          )}
        </div>

        {/* Trek Title */}
        <h3 className="font-bold text-lg md:text-xl text-[#111827] uppercase tracking-tight mt-1 mb-1 font-['Open_Sans'] group-hover:text-[#EB5A0D] transition-colors line-clamp-1">
          {trek.title}
        </h3>

        {/* Location / One-line Hook */}
        <div className="text-xs text-[#6B7280] font-normal mb-2 line-clamp-1 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
          <span className="truncate">{trek.location || 'Western Ghats, India'}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2 mb-4 font-['Open_Sans']">
          {trek.description || trek.summary || 'Experience pristine backcountry trails with professional wilderness guides and full safety logistics.'}
        </p>

        {/* Inclusions checklist (compact 2-col) */}
        <div className="pt-2.5 border-t border-[#EBEBE8] grid grid-cols-2 gap-1.5 mb-4">
          {inclusionsList.slice(0, 4).map((inc, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="text-[11px] font-medium text-[#4B5563] truncate">{inc}</span>
            </div>
          ))}
        </div>

        {/* Footer (Price & Compact Action Buttons) */}
        <div className="mt-auto pt-3 border-t border-[#EBEBE8] flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold block">
                PRICE STARTS AT
              </span>
              <div className="flex items-baseline mt-0.5">
                <span className="text-xl font-extrabold text-[#EB5A0D]">
                  ₹{Number(trek.price || 0).toLocaleString('en-IN')}
                </span>
                {trek.originalPrice && (
                  <span className="text-xs text-[#9CA3AF] line-through ml-1.5">
                    ₹{Number(trek.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDetailsClick}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] text-center transition-colors cursor-pointer flex items-center justify-center bg-white"
            >
              GET DETAILS
            </button>
            <button
              onClick={() => onBookNow && onBookNow(trek)}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#EB5A0D] hover:bg-[#D44E08] text-white shadow-sm text-center transition-colors cursor-pointer flex items-center justify-center border-none"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
