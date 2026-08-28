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
  Search, 
  ArrowUp, 
  Mail, 
  Shield, 
  Compass, 
  Database, 
  Eye, 
  Lock, 
  UserCheck, 
  HelpCircle,
  FileText,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-1', label: '1. Information We Collect', title: '1. Information We Collect', icon: Database },
  { id: 'section-2', label: '2. How We Use Information', title: '2. How We Use Your Information', icon: Compass },
  { id: 'section-3', label: '3. Data Sharing & Disclosures', title: '3. Data Sharing & Third-Party Disclosures', icon: Eye },
  { id: 'section-4', label: '4. Media & Visual Rights', title: '4. Media & Visual Rights', icon: FileText },
  { id: 'section-5', label: '5. Data Security & Storage', title: '5. Data Security & Storage', icon: Lock },
  { id: 'section-6', label: '6. Your Rights & Choices', title: '6. Your Rights & Choices', icon: UserCheck },
  { id: 'section-7', label: '7. Contact Us', title: '7. Contact Us', icon: HelpCircle },
];

export default function PrivacyPolicy({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Helper component to render highlighted text occurrences
  const Highlight = ({ text }) => {
    if (!searchQuery) return <span>{text}</span>;
    
    // Escape regex characters
    const safeQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, idx) => 
          part.toLowerCase() === searchQuery.toLowerCase()
            ? <mark key={idx} className="bg-[#C1571F]/30 text-[#C1571F] font-bold px-0.5 rounded">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#52524E] font-outfit pb-20 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E7E7E4] bg-[#F8F8F6]/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A18] flex items-center justify-center shadow-sm border border-[#E7E7E4]">
            <img src="/assets/logo-dark.png" alt="BOOTpaths Logo" className="w-full h-full object-cover scale-105" />
          </div>
          <div>
            <h1 className="font-outfit text-xl font-bold tracking-tight text-[#1A1A18] flex items-center gap-1.5">
              <span>Privacy Policy</span>
              <span className="text-xs font-semibold text-[#52524E]/70">— BOOTpaths</span>
            </h1>
            <p className="text-[10px] text-[#52524E]/50">Last Updated: August 3, 2026</p>
          </div>
        </div>

        {/* Search and Close Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#52524E]/40" />
            <input
              type="text"
              placeholder="Search privacy terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-11 pl-9 pr-4 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:border-[#C1571F]/60 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 h-5 w-5 rounded-full bg-[#E7E7E4]/50 text-xs flex items-center justify-center hover:bg-[#E7E7E4]"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="h-11 px-5 rounded-xl bg-[#C1571F] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
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
                        : 'text-[#52524E]/80 hover:bg-[#F8F8F6] hover:text-[#1A1A18]'
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
              <Shield className="h-4 w-4" />
              Trekker Guarantee
            </h4>
            <p className="text-[11px] leading-relaxed text-[#52524E]">
              We secure your vital parameters, emergency routes, and identification data using standard database encryption models.
            </p>
          </div>
        </aside>

        {/* Detailed Privacy Content */}
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
            {/* Intro */}
            <div className="space-y-4">
              <h2 className="font-outfit text-2xl font-black text-[#1A1A18]">Privacy & Data Policy Declaration</h2>
              <p className="text-xs leading-relaxed text-[#52524E]">
                <Highlight text="At BOOTpaths, accessible from our website and mobile platforms, one of our main priorities is the privacy and safety of our trekkers and participants. This Privacy Policy outlines the types of information we collect, how we use it, how we protect it, and your rights regarding your personal data." />
              </p>
              <p className="text-xs leading-relaxed text-[#52524E] font-semibold bg-[#F8F8F6] p-4 rounded-xl border-l-4 border-[#C1571F] border-t border-r border-b border-[#E7E7E4]/50">
                <Highlight text="By registering for, booking, or participating in any trek, expedition, or outdoor activity organized by BOOTpaths, you consent to the practices described in this policy." />
              </p>
            </div>

            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <Database className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[0].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52524E]">
                <Highlight text="We collect information to provide safe, organized, and seamless trekking experiences. The types of data gathered include:" />
              </p>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Personal Identification & Contact Details:</strong> <Highlight text="Full Name, Age, Gender, Date of Birth, email address, phone number, physical address, and Emergency contact details." />
                </li>
                <li>
                  <strong>Health & Medical Data:</strong> <Highlight text="Health Declarations regarding physical fitness, pre-existing medical conditions, past surgeries, active medical treatments, allergies, or dietary requirements. Vital statistics collected during treks (pulse rate, blood pressure, SpO2 levels)." />
                </li>
                <li>
                  <strong>Government IDs & Permits:</strong> <Highlight text="Aadhaar, Passport, Voter ID, or Driving License for Forest Department permits, border checkpoints, or local administration clearances." />
                </li>
                <li>
                  <strong>Media & Visual Content:</strong> <Highlight text="Photographs, video footage, and audio recordings captured during treks or events." />
                </li>
                <li>
                  <strong>Financial Information:</strong> <Highlight text="Payment records, UPI transaction IDs, or bank details required for bookings, refunds, or issuing trek credits." />
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <Compass className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[1].title}</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Safety & Medical Screening:</strong> <Highlight text="Evaluating physical fitness suitability, identifying medical risks, and providing assistance during medical emergencies or evacuations." />
                </li>
                <li>
                  <strong>Permits & Logistics:</strong> <Highlight text="Submitting mandatory trekker manifests to government agencies, Forest Departments, police, and local authorities." />
                </li>
                <li>
                  <strong>Trek Operations & Communication:</strong> <Highlight text="Sending itinerary updates, gear lists, pickup points, guide assignments, and safety advisories." />
                </li>
                <li>
                  <strong>Emergency Assistance:</strong> <Highlight text="Coordinating with local rescue teams, medical facilities, hospital staff, helicopter evacuation services, and insurance providers." />
                </li>
                <li>
                  <strong>Marketing & Community Documentation:</strong> <Highlight text="Sharing photos, promotional videos, and trek highlights across digital and print media unless explicitly opted out." />
                </li>
                <li>
                  <strong>Customer Support & Refunds:</strong> <Highlight text="Processing cancellations, calculating refund eligibility, managing 12-month future trek credits, and verifying replacement requests." />
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <Eye className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[2].title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52524E]">
                <Highlight text="We do not sell, rent, or trade personal information. We share data only with:" />
              </p>
              <ul className="space-y-2 text-xs text-[#52524E] list-disc pl-5">
                <li><Highlight text="Forest Departments & Local Authorities for entry passes and adventure permits." /></li>
                <li><Highlight text="Emergency Services & Medical Providers to facilitate rescue operations and medical treatment." /></li>
                <li><Highlight text="Insurance Companies for processing medical or evacuation claims." /></li>
                <li><Highlight text="Service Partners (guides, transport vendors, homestays) strictly on a need-to-know basis." /></li>
                <li><Highlight text="Legal Compliance when required by law enforcement or court orders." /></li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <FileText className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[3].title}</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Grant of Permission:</strong> <Highlight text="Unless explicitly declined in writing prior to the trek, participants grant BOOTpaths permission to use photographs and videos for promotional and documentation purposes." />
                </li>
                <li>
                  <strong>Media Opt-Out:</strong> <Highlight text="Participants can opt out of marketing media by notifying BOOTpaths in writing via email before the trek start date." />
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <Lock className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[4].title}</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-[#52524E] list-disc pl-5">
                <li><Highlight text="We implement administrative, physical, and electronic security measures to safeguard personal and health data." /></li>
                <li><Highlight text="Health declarations and IDs are retained only as long as necessary to complete the trek, fulfill legal obligations, and process claims." /></li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E7E7E4] pb-2">
                <UserCheck className="h-4.5 w-4.5 text-[#C1571F]" />
                <h3 className="font-outfit text-lg font-bold text-[#1A1A18]">{SECTIONS[5].title}</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#52524E] list-disc pl-5">
                <li>
                  <strong>Access & Correction:</strong> <Highlight text="Request access to or correction of personal details or health declarations." />
                </li>
                <li>
                  <strong>Opt-Out of Marketing:</strong> <Highlight text="Opt out of promotional emails, newsletters, or social media photo publications." />
                </li>
                <li>
                  <strong>Withdrawal of Consent:</strong> <Highlight text="Withdraw consent at any time (may impact participation if mandatory safety info is withheld)." />
                </li>
              </ul>
            </section>

            {/* Section 7 / Contact Card */}
            <section id="section-7" className="scroll-mt-24">
              <div className="rounded-2xl border-2 border-dashed border-[#E7E7E4] bg-[#F8F8F6] p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-outfit text-base font-bold text-[#1A1A18]">Need to discuss your data?</h4>
                  <p className="text-xs text-[#52524E] leading-relaxed max-w-md">
                    If you want to request data deletion, withdraw media permission, or have questions regarding medical declarations, contact our compliance officer.
                  </p>
                </div>
                <a
                  href="mailto:support@bootpaths.com"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C1571F] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all shrink-0 shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
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
