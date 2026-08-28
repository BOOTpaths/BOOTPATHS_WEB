/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useEffect, useState } from 'react';
import { 
  X, 
  ArrowUp, 
  Mail, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck, 
  Info,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-1', label: '1. General Conditions', title: '1. General Conditions', icon: ShieldCheck },
  { id: 'section-2', label: '2. Refund Timelines', title: '2. Refund Timelines by Category', icon: Calendar },
  { id: 'section-3', label: '3. Future Credits Policy', title: '3. Future Treks Credit Policy', icon: TrendingUp },
  { id: 'section-4', label: '4. Replacement Policy', title: '4. Replacement Policy', icon: RefreshCw },
];

export default function RefundPolicy({ onClose }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    const handleScroll = () => {
      // Toggle back to top visibility
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Sync active section based on scroll position
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#52524E] font-outfit pb-20 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E7E7E4] bg-[#F8F8F6]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A18] flex items-center justify-center shadow-sm border border-[#E7E7E4]">
            <img src="/logo.png" alt="BOOTpaths Logo" className="w-full h-full object-cover scale-105" />
          </div>
          <div>
            <h1 className="font-outfit text-xl font-bold tracking-tight text-[#1A1A18]">
              Cancellation & Refund Policy
            </h1>
            <p className="text-[10px] text-[#52524E]/50">Last Updated: August 3, 2026</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="h-11 px-5 rounded-xl bg-[#C1571F] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <X className="h-4 w-4" />
          Close / Return
        </button>
      </header>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Nav Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start space-y-4">
          <div className="rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#52524E]/55 mb-4">
              Policy Sections
            </h3>
            <nav className="flex flex-col gap-1.5">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#C1571F] text-white shadow-sm'
                        : 'text-[#52524E]/70 hover:bg-[#F8F8F6] hover:text-[#1A1A18]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-5 shadow-sm">
            <h4 className="text-xs font-bold text-[#C1571F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Trekker Guarantee
            </h4>
            <p className="text-[11px] leading-relaxed text-[#52524E]">
              We design our cancellation timelines to align with forest permit allocations and local homestay deposits while remaining fair.
            </p>
          </div>
        </aside>

        {/* Detailed Content Column */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Mobile quick links pill container */}
          <div className="lg:hidden bg-[#FFFFFF] p-3 rounded-2xl border border-[#E7E7E4] flex gap-2 overflow-x-auto no-scrollbar scroll-smooth mb-4 shadow-sm">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full bg-[#F8F8F6] border border-[#E7E7E4] text-[10px] font-bold uppercase tracking-wider text-[#52524E]/70 hover:text-[#C1571F]"
              >
                <ChevronRight className="h-3 w-3 text-[#C1571F]" />
                {sec.label.replace(/^\d+\.\s+/, '')}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm space-y-10">
            {/* General Policy Intro */}
            <div className="space-y-4">
              <h2 className="font-outfit text-2xl font-black text-[#1A1A18]">BOOTpaths Adventure Labs Rules of Retraction</h2>
              <p className="text-xs leading-relaxed text-[#52524E]">
                Wild expeditions necessitate booking local guides, securing government forest permits, setting up safety equipment, and ordering camp rations long before batch departures. Therefore, our cancellation rules are structured based on elapsed days between cancellation requests and expedition start dates.
              </p>
            </div>

            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <ShieldCheck className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[0].title}</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Written Notification Required:</strong> Cancellation requests must be explicitly submitted in writing by clicking "Request Cancel" on the Explorer dashboard or by sending an email to <span className="font-semibold text-autumn-maple">support@bootpaths.com</span> from your registered account.
                </li>
                <li>
                  <strong>Timestamp Calculation:</strong> The day on which the cancellation form is submitted online or the email request is received counts as the exact cancellation request timestamp.
                </li>
                <li>
                  <strong>Trek Exclusions:</strong> Permit fees, state booking taxes, state entry levies, and local convenience charges are non-refundable across all categories.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <Calendar className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[1].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52524E]">
                The standard refund percentages below apply based on how many days prior to the batch start date the cancellation is requested:
              </p>
              
              <div className="overflow-hidden rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs">
                <div className="grid grid-cols-2 bg-[#E7E7E4]/40 font-bold border-b border-[#E7E7E4] py-2.5 px-4 text-[#1A1A18]">
                  <div>Cancellation Window</div>
                  <div>Eligible Refund (Excluding Permits)</div>
                </div>
                <div className="divide-y divide-[#E7E7E4]">
                  <div className="grid grid-cols-2 py-2.5 px-4">
                    <div>30 days or more prior</div>
                    <div className="font-semibold text-emerald-600">90% Refund</div>
                  </div>
                  <div className="grid grid-cols-2 py-2.5 px-4">
                    <div>15 to 29 days prior</div>
                    <div className="font-semibold text-autumn-maple">50% Refund</div>
                  </div>
                  <div className="grid grid-cols-2 py-2.5 px-4">
                    <div>Less than 15 days prior</div>
                    <div className="font-semibold text-rose-600">No Refund (0%)</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[2].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52524E]">
                To provide flexibility, BOOTpaths offers a **Future Trek Credit** system for participants who cannot proceed with their original bookings:
              </p>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Validity Term:</strong> Trek credit vouchers are valid for exactly 12 months from their issue date and can be applied toward any live package on our site.
                </li>
                <li>
                  <strong>Trek Transferability:</strong> Vouchers can be transferred to friends or immediate family members upon submitting a verified request to our support crew.
                </li>
                <li>
                  <strong>Conversion Window:</strong> Bookings canceled between 15 to 30 days prior to batch departure can be converted to 100% Future Trek Credit instead of a 50% monetary refund.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <RefreshCw className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[3].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52524E]">
                If you cannot attend but wish to avoid cancellation fees, you can nominate a replacement candidate:
              </p>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Replacement Eligibility:</strong> Replacements are accepted up to 5 days prior to batch departure, provided the new candidate submits a completed medical fitness form.
                </li>
                <li>
                  <strong>Processing Fee:</strong> A flat administrative processing fee of ₹500 is charged to update state permits and guide logs.
                </li>
              </ul>
            </section>

            {/* Contact Card */}
            <section className="scroll-mt-24 pt-4">
              <div className="rounded-2xl border-2 border-dashed border-[#E7E7E4] bg-[#F8F8F6] p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-outfit text-base font-bold text-[#1A1A18]">Have questions about a refund?</h4>
                  <p className="text-xs text-[#52524E] leading-relaxed max-w-md">
                    Refunds are processed within 7 to 10 working days back to the original payment source. If you have queries, contact our finance crew.
                  </p>
                </div>
                <a
                  href="mailto:support@bootpaths.com"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C1571F] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all shrink-0 shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Email Finance
                </a>
              </div>
            </section>

          </div>
        </div>

      </div>

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-[#C1571F] text-white shadow-xl hover:bg-[#A84310] flex items-center justify-center transition-all animate-in fade-in duration-300 scale-100 hover:scale-105 active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
