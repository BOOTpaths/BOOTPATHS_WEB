import React from 'react';
import TrekCard from './TrekCard';
import { Compass, Plus } from 'lucide-react';

export default function UpcomingTreks({ 
  treks = [], 
  loading = false, 
  showAllTreks = false, 
  setShowAllTreks, 
  onGetDetails, 
  onBookNow 
}) {
  return (
    <section id="upcoming-treks" className="relative bg-[#EFE8D6]/10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-autumn-maple">
              Live Batches
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-autumn-bark sm:text-4xl md:text-5xl">
              Upcoming Western Ghats Trails
            </h2>
          </div>
          <p className="max-w-md text-sm text-autumn-bark/70 md:text-right">
            Fully approved routes with Forest Department clearance. Orderly batch structures with strict sizing of 12-15 trekkers max.
          </p>
        </div>
        
        <div className="mx-auto mt-6 h-1 w-full rounded-full bg-[#EFE8D6]">
          <div className="h-1 w-1/4 rounded-full bg-autumn-maple"></div>
        </div>

        {/* Grid Layout of Destination Cards */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-autumn-bark/10 border-t-[#C1571F] mb-4"></div>
            <p className="text-xs text-autumn-bark/60 uppercase tracking-widest font-bold">Loading Trails...</p>
          </div>
        ) : treks.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center p-8 py-16 text-center bg-[#EBE3D3]/40 rounded-3xl border border-[#3A2A1E]/10">
            <Compass className="h-16 w-16 text-[#C1571F] animate-pulse mb-4" />
            <h3 className="font-outfit text-lg font-black text-[#3A2A1E] uppercase tracking-wider">No Treks Currently Available</h3>
            <p className="text-xs text-[#3A2A1E]/60 max-w-sm mt-2">Check back soon for new wilderness pathways and seasonal bookings.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(showAllTreks ? treks : treks.slice(0, 4)).map((trek) => (
              <TrekCard
                key={trek.id}
                trek={trek}
                onGetDetails={onGetDetails}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}

        {/* Progressive Loading Toggle */}
        {treks.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllTreks && setShowAllTreks(!showAllTreks)}
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg border border-autumn-bark/10 bg-[#EFE8D6]/30 px-8 font-outfit text-sm font-bold uppercase tracking-wider text-autumn-bark backdrop-blur-sm transition-all duration-300 hover:border-autumn-maple/50 hover:bg-[#EFE8D6] hover:text-autumn-maple focus:outline-none cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showAllTreks ? 'Show Fewer Trails' : 'Explore More Experiences'}
                <Plus className={`h-4 w-4 transition-transform duration-300 ${showAllTreks ? 'rotate-45' : ''}`} />
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
