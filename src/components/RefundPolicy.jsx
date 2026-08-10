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
  Heart,
  ChevronRight,
  Info
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
    <div className="min-h-screen bg-[#F3ECDD] text-[#3A2A1E] font-outfit pb-20 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#3A2A1E]/10 bg-[#F3ECDD]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2A1D14] flex items-center justify-center shadow-md border border-[#C1571F]/30">
            <img src="/assets/logo-dark.png" alt="BOOTpaths Logo" className="w-full h-full object-cover scale-105" />
          </div>
          <div>
            <h1 className="font-outfit text-xl font-bold tracking-tight text-[#3A2A1E]">
              Cancellation & Refund Policy
            </h1>
            <p className="text-[10px] text-[#3A2A1E]/50">Last Updated: August 3, 2026</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="h-11 px-5 rounded-xl bg-[#C1571F] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a44717] transition-all flex items-center gap-1.5"
        >
          <X className="h-4 w-4" />
          Close / Return
        </button>
      </header>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Nav Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start space-y-4">
          <div className="rounded-2xl border border-[#3A2A1E]/10 bg-[#EBE3D3] p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3A2A1E]/50 mb-4">
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
                        ? 'bg-[#C1571F] text-white shadow-[0_4px_12px_rgba(193,87,31,0.25)]'
                        : 'text-[#3A2A1E]/70 hover:bg-[#3A2A1E]/5 hover:text-[#3A2A1E]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="rounded-2xl border border-[#C1571F]/20 bg-[#C1571F]/5 p-5">
            <h4 className="text-xs font-bold text-[#C1571F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Trekker Guarantee
            </h4>
            <p className="text-[11px] leading-relaxed text-[#3A2A1E]/70">
              We design our cancellation timelines to align with forest permit allocations and local homestay deposits while remaining fair.
            </p>
          </div>
        </aside>

        {/* Detailed Content Column */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Mobile quick links pill container */}
          <div className="lg:hidden bg-[#EBE3D3] p-3 rounded-2xl border border-[#3A2A1E]/10 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth mb-4">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full bg-[#F3ECDD] border border-[#3A2A1E]/10 text-[10px] font-bold uppercase tracking-wider text-[#3A2A1E]/70 hover:text-[#C1571F]"
              >
                <ChevronRight className="h-3 w-3 text-[#C1571F]" />
                {sec.label.replace(/^\d+\.\s+/, '')}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#3A2A1E]/10 bg-[#EBE3D3] p-6 sm:p-8 shadow-sm space-y-10">
            {/* Intro */}
            <div className="space-y-4">
              <div className="inline-block bg-[#C1571F]/10 border border-[#C1571F]/20 text-[#C1571F] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Transparent Scheduling
              </div>
              <h2 className="font-outfit text-2xl font-black text-[#3A2A1E]">Cancellation, Refund & Replacement Policy</h2>
              <p className="text-xs leading-relaxed text-[#3A2A1E]/80">
                This document details the terms, schedules, credit options, and transfer conditions regarding trip cancellations and participant replacements.
              </p>
              <p className="text-xs leading-relaxed text-[#3A2A1E]/80">
                We understand how disappointing it is when a trek doesn't go as planned. That's why we follow a trekker-friendly and transparent cancellation policy, designed with empathy and fairness. Wherever possible, we focus on flexibility offering reschedules, credits, or support so that your journey doesn't end here, but simply gets postponed to the right time.
              </p>
            </div>

            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3A2A1E]/10 pb-2">
                <ShieldCheck className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">{SECTIONS[0].title}</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#3A2A1E]/80 list-decimal pl-5 leading-relaxed">
                <li>
                  Cancellation requests must be submitted in writing.
                </li>
                <li>
                  Refund eligibility and cancellation charges apply according to the published timelines for the specific trek category.
                </li>
                <li>
                  No refunds shall be issued for:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1.5 text-[#3A2A1E]/70">
                    <li>Voluntary withdrawal during an ongoing trek</li>
                    <li>Being turned back by leaders for medical or safety reasons</li>
                    <li>Unused itinerary services</li>
                    <li>No-shows</li>
                  </ul>
                </li>
                <li>
                  Processing fees, third-party vendor bookings, and government permits are non-refundable.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#3A2A1E]/10 pb-2">
                <Calendar className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">{SECTIONS[1].title}</h3>
              </div>
              
              <div className="space-y-6">
                {/* Timeline A */}
                <div className="space-y-3">
                  <h4 className="font-outfit text-sm font-bold text-[#3A2A1E]/90 flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#C1571F] text-white text-[10px] font-bold">A</span>
                    One-day / Two-day Treks (e.g., Brahmagiri, Silent Valley, Meesapulimala)
                  </h4>
                  <div className="overflow-hidden rounded-xl border border-[#3A2A1E]/10 bg-[#F3ECDD]/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#3A2A1E]/5 border-b border-[#3A2A1E]/10">
                          <th className="p-3 font-bold text-[#3A2A1E]/75">Cancellation Timeline</th>
                          <th className="p-3 font-bold text-[#C1571F]">Refund Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3A2A1E]/5 text-[#3A2A1E]/80">
                        <tr>
                          <td className="p-3">30+ days before trek departure date</td>
                          <td className="p-3 font-semibold text-emerald-600">Full refund (processing fee applicable)</td>
                        </tr>
                        <tr>
                          <td className="p-3">15+ days before trek departure date</td>
                          <td className="p-3 font-semibold">80% refund</td>
                        </tr>
                        <tr>
                          <td className="p-3">5+ days before trek departure date</td>
                          <td className="p-3 font-semibold">50% refund</td>
                        </tr>
                        <tr>
                          <td className="p-3">1 day before trek departure date</td>
                          <td className="p-3 font-semibold text-amber-600">20% refund</td>
                        </tr>
                        <tr className="bg-rose-500/5">
                          <td className="p-3">Last day / No show</td>
                          <td className="p-3 font-semibold text-rose-600">No refund</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timeline B */}
                <div className="space-y-3">
                  <h4 className="font-outfit text-sm font-bold text-[#3A2A1E]/90 flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#C1571F] text-white text-[10px] font-bold">B</span>
                    Special Treks (e.g., Agastyarkoodam - non-refundable Forest Department permits)
                  </h4>
                  <div className="rounded-xl border border-[#3A2A1E]/10 bg-[#F3ECDD]/30 p-4 text-xs space-y-2 text-[#3A2A1E]/80">
                    <p>• <strong>50% refund</strong> on the total cost excluding forest permit fees.</p>
                    <p>• Subject to the timeline percentages outlined in Section 2A.</p>
                    <p>• Special circumstances will be reviewed case-by-case.</p>
                  </div>
                </div>

                {/* Timeline C */}
                <div className="space-y-3">
                  <h4 className="font-outfit text-sm font-bold text-[#3A2A1E]/90 flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#C1571F] text-white text-[10px] font-bold">C</span>
                    Himalayan Treks
                  </h4>
                  <div className="overflow-hidden rounded-xl border border-[#3A2A1E]/10 bg-[#F3ECDD]/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#3A2A1E]/5 border-b border-[#3A2A1E]/10">
                          <th className="p-3 font-bold text-[#3A2A1E]/75">Cancellation Timeline</th>
                          <th className="p-3 font-bold text-[#C1571F]">Refund Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3A2A1E]/5 text-[#3A2A1E]/80">
                        <tr>
                          <td className="p-3">45+ days before trek departure date</td>
                          <td className="p-3 font-semibold text-emerald-600">90% refund</td>
                        </tr>
                        <tr>
                          <td className="p-3">30+ days before trek departure date</td>
                          <td className="p-3 font-semibold">70% refund</td>
                        </tr>
                        <tr>
                          <td className="p-3">15+ days before trek departure date</td>
                          <td className="p-3 font-semibold">50% refund</td>
                        </tr>
                        <tr className="bg-rose-500/5">
                          <td className="p-3">Within 15 days / No show</td>
                          <td className="p-3 font-semibold text-rose-600">No refund</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timeline D */}
                <div className="space-y-3">
                  <h4 className="font-outfit text-sm font-bold text-[#3A2A1E]/90 flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#C1571F] text-white text-[10px] font-bold">D</span>
                    International Treks
                  </h4>
                  <div className="rounded-xl border border-[#3A2A1E]/10 bg-[#F3ECDD]/30 p-4 text-xs text-[#3A2A1E]/80">
                    Refund requests are handled on a case-by-case basis to ensure fairness considering international logistics.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 / Highlight Box */}
            <section id="section-3" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3A2A1E]/10 pb-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">{SECTIONS[2].title}</h3>
              </div>
              
              <div className="rounded-2xl border border-[#C1571F]/30 bg-gradient-to-br from-[#C1571F]/10 to-transparent p-6 shadow-md space-y-4 relative overflow-hidden">
                {/* 50% Bonus Badge */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C1571F]/10 flex items-center justify-center rotate-12 pointer-events-none">
                  <span className="font-outfit font-black text-2xl text-[#C1571F]/20">+50%</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1571F]/15 text-[#C1571F]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C1571F]">Trekker Benefit</span>
                    <h4 className="font-outfit text-base font-black text-[#3A2A1E] mt-0.5">50% Bonus Future Trek Credit</h4>
                  </div>
                </div>
                
                <ul className="space-y-2.5 text-xs text-[#3A2A1E]/80 pl-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1571F] font-bold mt-0.5">•</span>
                    <strong>Bonus Credit:</strong> Participants choosing to convert their refund into future trek credits receive an additional 50% bonus value on their credit amount.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1571F] font-bold mt-0.5">•</span>
                    <strong>Validity:</strong> Credits remain valid for 12 months from the original cancelled trek date.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1571F] font-bold mt-0.5">•</span>
                    <strong>Transferability:</strong> Credits can be redeemed by the participant or their immediate family members (Parents, Children, Spouse).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3A2A1E]/10 pb-2">
                <RefreshCw className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#3A2A1E]">{SECTIONS[3].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#3A2A1E]/80">
                If you are unable to attend, you may substitute another person in your place under the following conditions:
              </p>
              <ul className="space-y-3 text-xs text-[#3A2A1E]/80 list-disc pl-5 leading-relaxed">
                <li>
                  <strong>30+ days before trek:</strong> 100% free replacement allowed.
                </li>
                <li>
                  <strong>15+ days before trek:</strong>
                  <ul className="list-circle pl-5 mt-1.5 space-y-1.5 text-[#3A2A1E]/70">
                    <li>One-day / Two-day treks: 10% additional processing fee applies</li>
                    <li>Himalayan treks: 25% additional processing fee applies</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* Support Card */}
            <section className="pt-4">
              <div className="rounded-2xl border-2 border-dashed border-[#C1571F]/30 bg-[#C1571F]/5 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-outfit text-base font-bold text-[#3A2A1E]">Need to cancel or substitute?</h4>
                  <p className="text-xs text-[#3A2A1E]/75 leading-relaxed max-w-sm">
                    Submit your ticket cancellation request or replacements details directly to our travel desk.
                  </p>
                </div>
                <a
                  href="mailto:support@bootpaths.com"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C1571F] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a44717] transition-all shrink-0"
                >
                  <Mail className="h-4 w-4" />
                  Email support@bootpaths.com
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
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-[#C1571F] text-white shadow-xl hover:bg-[#a44717] flex items-center justify-center transition-all animate-in fade-in duration-300 scale-100 hover:scale-105 active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
