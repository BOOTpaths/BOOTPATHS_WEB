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
  Printer, 
  AlertTriangle, 
  Heart, 
  ShieldAlert, 
  Compass, 
  Users, 
  Leaf, 
  CloudLightning, 
  Scale, 
  CheckCircle,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'sec-1', label: '1. Assumption of Risk', title: 'Nature of Adventure Activities & Assumption of Risk', icon: AlertTriangle },
  { id: 'sec-2', label: '2. Medical Fitness', title: 'Medical Fitness & Health Declaration', icon: Heart },
  { id: 'sec-3', label: '3. Insurance & Evac', title: 'Travel Insurance & Emergency Evacuation', icon: ShieldAlert },
  { id: 'sec-4', label: '4. Itinerary Authority', title: 'Itinerary Changes & Operational Authority', icon: Compass },
  { id: 'sec-5', label: '5. Code of Conduct', title: 'Participant Code of Conduct', icon: Users },
  { id: 'sec-6', label: '6. Eco-Commitment', title: 'Environmental Commitment & Sustainable Trekking Policy', icon: Leaf },
  { id: 'sec-7', label: '7. Force Majeure', title: 'Force Majeure & Unforeseen Events', icon: CloudLightning },
  { id: 'sec-8', label: '8. Liability Limit', title: 'Limitation of Liability & Indemnity', icon: Scale },
  { id: 'sec-9', label: '9. Declaration', title: 'Declaration & Acceptance of Terms', icon: CheckCircle },
];

export default function TermsOfService({ onClose, isFullPage = false }) {
  const [activeSection, setActiveSection] = useState('sec-1');

  useEffect(() => {
    const handleScroll = () => {
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

    if (isFullPage) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFullPage]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const contentMarkup = (
    <div className="space-y-12 pr-2">
      {/* Section 1 */}
      <section id="sec-1" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            1. Nature of Adventure Activities & Assumption of Risk
          </h2>
        </div>
        
        <div className="bg-[#F8F8F6] border border-[#E7E7E4] rounded-xl p-4 text-xs leading-relaxed text-[#52524E]">
          <p className="font-bold text-[#C1571F] uppercase mb-1">Warning: Inherent Wilderness Risks</p>
          Trekking, climbing, camping, and expedition activities organized by BOOTpaths occur in rugged, remote, and unpredictable environments. By registering, you explicitly acknowledge and assume all inherent hazards.
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>1.1 Inherent Hazards:</strong> These include, but are not limited to, slips, trips, falls on slick rocks or scree, extreme temperature fluctuations, torrential monsoons, sudden lightning strikes, flash floods, attacks by wild animals, and insect bites.
          </p>
          <p>
            <strong>1.2 Altitude Illnesses:</strong> High-altitude treks present severe physiological risks including Acute Mountain Sickness (AMS), High Altitude Pulmonary Edema (HAPE), and High Altitude Cerebral Edema (HACE).
          </p>
          <p>
            <strong>1.3 Remote Medical Limitations:</strong> Expeditions operate in remote areas where standard cellular networks are unavailable. Professional medical facilities, rescue teams, and emergency evacuations can be delayed by hours or days due to terrain limitations and weather conditions.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            2. Medical Fitness & Health Declaration
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>2.1 Physical Conditioning:</strong> Participants are required to maintain a physical conditioning standard appropriate to their selected trek's difficulty rating. You declare that you are in good physical and mental health.
          </p>
          <p>
            <strong>2.2 Mandatory Vitals Check:</strong> BOOTpaths guides will perform periodic blood pressure and pulse oximeter oxygen saturation (SpO2) readings. If a participant's SpO2 level falls below standard safety levels, the guide reserves complete authority to order an immediate descent.
          </p>
          <p>
            <strong>2.3 Safety Turn-Backs:</strong> The lead guide's decision to order a participant to return is final. Any participant who refuses a safety turn-back order operates at their own personal liability, and BOOTpaths support systems are legally terminated for that individual.
          </p>
          <p>
            <strong>2.4 Pre-existing Conditions:</strong> You must disclose all pre-existing medical conditions, including asthma, cardiac conditions, diabetes, epilepsy, and severe allergies (especially to insect bites or medications) in your participant profile before departure.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            3. Travel Insurance & Emergency Evacuation
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>3.1 Mandatory Coverage:</strong> Trekkers must hold a valid personal accident and wilderness travel insurance policy covering high-altitude trekking, search and rescue operations, and emergency medical repatriation.
          </p>
          <p>
            <strong>3.2 Evacuation Costs:</strong> All charges associated with helicopter rescue, forest department evacuation teams, ambulance services, and emergency hospital admissions are the exclusive financial responsibility of the participant.
          </p>
          <p>
            <strong>3.3 Claim Assistance:</strong> BOOTpaths will provide official incident logs and coordinates to support insurance claims but will not advance funds for evacuation logistics.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <Compass className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            4. Itinerary Changes & Operational Authority
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>4.1 Route Flexibility:</strong> Wild trails are subject to unpredictable conditions. Forest fires, landslide warnings, sudden bridge collapses, or permit cancellations by regional forest officers can necessitate dynamic route adjustments.
          </p>
          <p>
            <strong>4.2 Operational Discretion:</strong> The expedition leader holds sole operational authority. They may adjust campsite locations, change ascent paths, or cancel trail access at any stage if they deem it necessary to ensure team safety.
          </p>
          <p>
            <strong>4.3 Compensation Exclusion:</strong> No refunds, credits, or compensation adjustments will be provided for modifications made to itineraries due to safety concerns, natural events, or regulatory actions.
          </p>
          <p>
            <strong>4.4 Forest Permits:</strong> Some routes require strict lottery-based forest department permits. In the event a permit is cancelled by authority officials, BOOTpaths will pivot to an alternative route of equivalent grade.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            5. Participant Code of Conduct
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>5.1 Safety & Leadership:</strong> Participants must strictly follow all instructions issued by the designated guide. Deviating from the marked trail without explicit approval is strictly prohibited.
          </p>
          <p>
            <strong>5.2 Discipline & Behaviour:</strong> Zero tolerance is maintained for the consumption of alcohol, narcotics, or psychotropic substances during treks. Disruptive behaviour, harassment, or actions endangering other participants will result in immediate expulsion from the batch without refund.
          </p>
          <p>
            <strong>5.3 Equipment Responsibility:</strong> Equipment loaned to participants (e.g. Decathlon Quechua tents, sleeping bags, liners, helmets, safety harnesses) must be returned in good condition. The replacement cost of any damaged or lost equipment will be charged to the participant before final check-out.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <Leaf className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            6. Environmental Commitment & Sustainable Trekking Policy
          </h2>
        </div>

        <div className="bg-[#F8F8F6] border border-[#E7E7E4] rounded-xl p-4 text-xs leading-relaxed text-[#52524E]">
          <p className="font-bold text-[#C1571F] uppercase mb-1">Leave No Trace (LNT) Mandate</p>
          BOOTpaths is a zero-waste adventure organization. Littering, collecting wild plants or stones, feeding wildlife, or washing utensils inside natural water bodies is strictly prohibited. Violations will result in a penalty fee matching local forest authority fines.
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>6.1 Waste Management:</strong> All non-biodegradable waste generated by participants (wrappers, plastics, wet wipes) must be packed in personal waste bags and carried back to base camps.
          </p>
          <p>
            <strong>6.2 Cultural Sensitivity:</strong> Trails cross villages and sacred forest groves. Respect local customs, dress modestly, do not take photographs of locals without permission, and strictly adhere to silent zones.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="sec-7" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <CloudLightning className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            7. Force Majeure & Unforeseen Events
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            BOOTpaths is not liable for itinerary modifications, delays, cancellations, or failure to perform obligations caused by acts of God, war, hostilities, strikes, government regulations, landslide warnings, sudden trail blockages, floods, pandemics, or other severe forces beyond our control. In Force Majeure situations, bookings will be converted to a future trek credit voucher valid for 1 year, subject to operational availability.
          </p>
        </div>
      </section>

      {/* Section 8 */}
      <section id="sec-8" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            8. Limitation of Liability & Indemnity
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            <strong>8.1 Indemnification:</strong> You agree to indemnify, defend, and hold harmless BOOTpaths, its directors, employees, expedition leads, and local guiding crew against any claims, losses, or expenses resulting from personal injury, illness, AMS, death, property damage, or delays.
          </p>
          <p>
            <strong>8.2 Maximum Recovery:</strong> In any legal scenario, the maximum financial liability of BOOTpaths is strictly capped at the registration amount paid by the participant for the specific trek event.
          </p>
          <p>
            <strong>8.3 Legal Jurisdiction:</strong> Any dispute, claim, or difference arising under these terms shall be subject to the exclusive jurisdiction of the regional courts where BOOTpaths Adventure Labs is registered.
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section id="sec-9" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F8F6] text-[#C1571F] border border-[#E7E7E4]">
            <CheckCircle className="h-5 w-5" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-[#1A1A18]">
            9. Declaration & Acceptance of Terms
          </h2>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#52524E]">
          <p>
            By ticking the check-box during reservation, registering, or submitting a deposit payment, you confirm that you have read, understood, and voluntarily agree to all conditions outlined in this contract. You certify that all medical declarations are true, and you proceed on this wilderness expedition entirely at your own risk.
          </p>
        </div>
      </section>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] text-[#52524E] font-outfit pb-16">
        {/* Navigation bar header */}
        <header className="sticky top-0 z-40 w-full border-b border-[#E7E7E4] bg-[#F8F8F6]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A18] flex items-center justify-center shadow-sm border border-[#E7E7E4]">
              <img src="/logo.png" alt="BOOTpaths Logo" className="w-full h-full object-cover scale-105" />
            </div>
            <div className="flex items-baseline">
              <span className="text-[#1A1A18] font-extrabold text-xl tracking-tight">BOOT</span>
              <span className="text-[#C1571F] font-extrabold text-xl tracking-tight">paths</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E7E7E4] bg-[#FFFFFF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#52524E] hover:bg-[#F8F8F6] transition-all"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C1571F] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all shadow-sm"
            >
              Close / Return
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick-Nav sidebar */}
          <aside className="lg:col-span-3 sticky top-24 self-start space-y-4">
            <div className="rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#52524E]/70 mb-4">
                Jump to Policy
              </h3>
              <nav className="flex flex-col gap-1.5">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
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
              <h4 className="text-xs font-bold text-[#C1571F] uppercase tracking-wider mb-2">Need Clarification?</h4>
              <p className="text-[11px] leading-relaxed text-[#52524E]">
                For custom corporate adventure contracts or queries regarding specific medical clearance terms, reach out at info@bootpaths.com.
              </p>
            </div>
          </aside>

          {/* Detailed Content */}
          <div className="lg:col-span-9 rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] p-8 shadow-sm print:shadow-none print:border-none print:bg-white print:p-0">
            <div className="border-b border-[#E7E7E4] pb-6 mb-8 text-center lg:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Official Contract</span>
              <h1 className="font-outfit text-3xl font-black text-[#1A1A18] mt-1">Participant Terms of Service</h1>
              <p className="text-xs text-[#52524E]/50 mt-1">Last Updated: August 2026</p>
            </div>

            {contentMarkup}
          </div>
        </main>
      </div>
    );
  }

  // Slide-over Modal Layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-955/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full md:w-3/5 lg:w-1/2 h-full bg-[#F8F8F6] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-labelledby="tos-title"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#F8F8F6] border-b border-[#E7E7E4] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#C1571F] block">Registration Waiver</span>
            <h2 id="tos-title" className="font-outfit text-lg font-bold text-[#1A1A18]">Terms of Service</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              title="Print Policy"
              className="p-2 rounded-lg border border-[#E7E7E4] bg-[#FFFFFF] hover:bg-[#F8F8F6] text-[#52524E] transition-all"
            >
              <Printer className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#E7E7E4]/50 text-[#52524E]/70 hover:bg-[#E7E7E4] hover:text-[#1A1A18] transition-all border border-[#E7E7E4]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Nav Slider */}
        <div className="bg-[#FFFFFF] px-6 py-2.5 border-b border-[#E7E7E4] flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-[#F8F8F6] border border-[#E7E7E4] text-[10px] font-bold uppercase tracking-wider text-[#52524E]/70 hover:border-[#C1571F]/50 hover:text-[#C1571F] transition-all"
            >
              <ChevronRight className="h-3 w-3 text-[#C1571F]" />
              {sec.label.replace(/^\d+\.\s+/, '')}
            </button>
          ))}
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12">
          {contentMarkup}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-10 bg-[#FFFFFF] border-t border-[#E7E7E4] px-6 py-4 flex items-center justify-between">
          <p className="text-[10px] text-[#52524E]/50">
            Please print/save a copy for your records.
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#C1571F] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#A84310] transition-all shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
