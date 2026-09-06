import React from 'react';
import { MapPin, Clock, Compass, CheckCircle2 } from 'lucide-react';

export default function TrekCard({ trek, onGetDetails, onBookNow }) {
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

  return (
    <div className="group bg-white rounded-2xl border border-[#EBEBE8] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
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

        {/* Top Overlay Badge */}
        {(trek.tag || trek.slotsLeft) && (
          <div className="absolute top-3.5 left-3.5">
            <span className="bg-[#C1571F] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md shadow-md inline-block">
              {trek.tag || 'LIMITED SLOTS'}
            </span>
          </div>
        )}

        {/* Bottom Image Chips (Duration & Difficulty) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {trek.duration && (
              <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-white/80" />
                {trek.duration}
              </span>
            )}
            {trek.difficulty && (
              <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-white/80" />
                {trek.difficulty}
              </span>
            )}
          </div>
          {trek.slotsLeft !== undefined && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${Number(trek.slotsLeft) <= 5 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              {trek.slotsLeft} slots
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Trek Title */}
        <h3 className="text-lg md:text-xl font-bold text-[#111827] leading-snug group-hover:text-[#C1571F] transition-colors line-clamp-1">
          {trek.title}
        </h3>

        {/* Altitude & Location line */}
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1 mt-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
          <span className="truncate">{trek.location}</span>
          {trek.altitude && (
            <span className="shrink-0">• {trek.altitude}</span>
          )}
        </div>

        {/* Body Summary Paragraph */}
        <p className="text-xs md:text-[13px] text-[#374151] leading-relaxed line-clamp-4 font-normal mt-2">
          {trek.description || trek.summary || 'Experience pristine backcountry trails with professional guides and comprehensive logistics.'}
        </p>

        {/* Feature Checklist */}
        <div className="mt-4 pt-3 border-t border-[#EBEBE8] grid grid-cols-2 gap-2">
          {inclusionsList.slice(0, 4).map((inc, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="text-[11px] font-medium text-[#4B5563] truncate">{inc}</span>
            </div>
          ))}
        </div>

        {/* Footer (Price & Action Buttons) */}
        <div className="mt-5 pt-4 border-t border-[#EBEBE8] flex flex-col gap-3.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold block">
                PRICE STARTS AT
              </span>
              <div className="flex items-baseline mt-0.5">
                <span className="text-xl font-extrabold text-[#C1571F]">
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

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDetailsClick}
              className="bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center"
            >
              GET DETAILS
            </button>
            <button
              onClick={() => onBookNow && onBookNow(trek)}
              className="bg-[#C1571F] hover:bg-[#A84716] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
