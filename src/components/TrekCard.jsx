import React from 'react';
import { MapPin, Calendar, Compass } from 'lucide-react';

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

    if (trek.id === 'silent-valley' || trek.title?.toLowerCase().includes('silent valley')) {
      window.location.hash = '#silent-valley';
      return;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E7E7E4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <img
          src={trek.image}
          alt={trek.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {trek.tag && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border backdrop-blur-md ${trek.tagColor || 'bg-[#C1571F]/20 text-[#C1571F] border-[#C1571F]/40'}`}>
              {trek.tag}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 rounded-xl bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          {trek.slotsLeft} slots remaining
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xxs font-bold uppercase tracking-wider text-[#C1571F]">
          <MapPin className="h-3.5 w-3.5" />
          <span>{trek.location}</span>
        </div>

        <h3 className="mt-2 font-outfit text-lg font-bold text-[#1A1A18] line-clamp-1">
          {trek.title}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-[#E7E7E4] py-3 text-xs text-[#52524E]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#C1571F]" />
            <span>{trek.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#C1571F]" />
            <span>{trek.difficulty}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xxs uppercase tracking-wider text-[#52524E]/60 block">Price Starts At</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              {trek.originalPrice && (
                <span className="text-xs text-[#52524E]/50 line-through font-semibold">₹{trek.originalPrice}</span>
              )}
              <span className="text-lg font-bold text-[#C1571F]">₹{trek.price}</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleDetailsClick}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#6E7042] text-[#3A2A1E] font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#6E7042]/10 cursor-pointer"
          >
            Get Details
          </button>
          <button
            onClick={() => onBookNow && onBookNow(trek)}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#C1571F] text-white font-outfit text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-[#a44717] hover:shadow-[0_4px_12px_rgba(193,87,31,0.2)] cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
