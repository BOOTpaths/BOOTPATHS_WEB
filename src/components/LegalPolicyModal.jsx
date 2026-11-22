/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Legal Policy Modal - Universal Overlay for Terms of Service, Privacy Policy, and Cancellation & Refund Policy.
 */
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Heart, 
  ShieldAlert, 
  Compass, 
  Users, 
  Leaf, 
  CloudLightning, 
  Scale, 
  CheckCircle,
  Database,
  Lock,
  UserCheck,
  Calendar,
  TrendingUp,
  Mail,
  Info
} from 'lucide-react';

export default function LegalPolicyModal({ isOpen, onClose, policy, activePolicy }) {
  // If neither activePolicy nor policy is defined, or isOpen is explicitly false, do not render
  if (!activePolicy && !policy) return null;
  if (isOpen === false) return null;

  const initialRaw = (activePolicy || policy || 'terms').toLowerCase();
  const normalizePolicy = (val) => {
    if (!val) return 'terms';
    const s = val.toLowerCase();
    if (s.includes('priv')) return 'privacy';
    if (s.includes('ref') || s.includes('canc')) return 'refund';
    return 'terms';
  };

  const [currentTab, setCurrentTab] = useState(() => normalizePolicy(initialRaw));

  useEffect(() => {
    setCurrentTab(normalizePolicy(activePolicy || policy));
  }, [activePolicy, policy]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#F8F8F6] rounded-3xl border border-[#E7E7E4] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-policy-modal-title"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#F8F8F6] border-b border-[#E7E7E4] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E7E7E4] flex items-center justify-center text-[#C1571F] shadow-xs">
              {currentTab === 'terms' && <FileText className="h-5 w-5" />}
              {currentTab === 'privacy' && <ShieldCheck className="h-5 w-5" />}
              {currentTab === 'refund' && <RefreshCw className="h-5 w-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F] block">
                Official Wilderness Protocol
              </span>
              <h2 id="legal-policy-modal-title" className="font-outfit text-lg font-black text-[#1A1A18] tracking-tight">
                {currentTab === 'terms' && 'Participant Terms of Service'}
                {currentTab === 'privacy' && 'Privacy & Data Protection Policy'}
                {currentTab === 'refund' && 'Cancellation & Refund Policy'}
              </h2>
            </div>
          </div>

          {/* Quick Tab Switcher + Action Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#E7E7E4] shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentTab('terms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'terms'
                    ? 'bg-[#C1571F] text-white shadow-xs'
                    : 'text-[#52524E] hover:text-[#1A1A18] hover:bg-[#F8F8F6]'
                }`}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('privacy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'privacy'
                    ? 'bg-[#C1571F] text-white shadow-xs'
                    : 'text-[#52524E] hover:text-[#1A1A18] hover:bg-[#F8F8F6]'
                }`}
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('refund')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'refund'
                    ? 'bg-[#C1571F] text-white shadow-xs'
                    : 'text-[#52524E] hover:text-[#1A1A18] hover:bg-[#F8F8F6]'
                }`}
              >
                Refunds
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              title="Print Policy"
              className="p-2 rounded-xl bg-white border border-[#E7E7E4] text-[#52524E] hover:text-[#1A1A18] hover:bg-[#F8F8F6] transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close Policy Modal"
              className="p-2 rounded-xl bg-white border border-[#E7E7E4] text-[#52524E] hover:text-[#1A1A18] hover:bg-[#F8F8F6] transition-colors cursor-pointer shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FFFFFF] space-y-8">
          {/* TAB 1: TERMS OF SERVICE */}
          {currentTab === 'terms' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#E7E7E4] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">BOOTpaths Contract</span>
                <h3 className="font-outfit text-2xl font-black text-[#1A1A18] tracking-tight mt-0.5">
                  Wilderness Expedition Terms & Conditions
                </h3>
                <p className="text-xs text-[#52524E] mt-1">Last Updated: August 2026 • Effective for all active expeditions</p>
              </div>

              {/* 1. Assumption of Risk */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>1. Nature of Adventure Activities & Assumption of Risk</h4>
                </div>
                <div className="bg-[#F8F8F6] border border-[#E7E7E4] rounded-xl p-4 text-xs leading-relaxed text-[#52524E]">
                  <p className="font-bold text-[#C1571F] uppercase mb-1">Inherent Wilderness Risks</p>
                  Trekking, climbing, camping, and expedition activities organized by BOOTpaths occur in rugged, remote, and unpredictable environments. By registering, you explicitly acknowledge and assume all inherent hazards.
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>1.1 Inherent Hazards:</strong> Slips, falls on scree, extreme temperature swings, torrential monsoons, sudden lightning, flash floods, wildlife encounters, and insect bites.</p>
                  <p><strong>1.2 Altitude Illnesses:</strong> High-altitude treks present severe risks including Acute Mountain Sickness (AMS), High Altitude Pulmonary Edema (HAPE), and Cerebral Edema (HACE).</p>
                  <p><strong>1.3 Remote Medical Limitations:</strong> Expeditions operate outside standard cellular networks. Evacuation and emergency response can be delayed by hours or days depending on terrain.</p>
                </div>
              </section>

              {/* 2. Medical Fitness */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Heart className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>2. Medical Fitness & Health Declaration</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>2.1 Physical Conditioning:</strong> Participants must maintain fitness levels appropriate to the trek's difficulty rating and certify they are in sound health.</p>
                  <p><strong>2.2 Mandatory Vitals Check:</strong> BOOTpaths leads perform SpO2 oxygen saturation and vitals readings. If readings drop below safety thresholds, the lead reserves sole authority to order descent.</p>
                  <p><strong>2.3 Pre-existing Conditions:</strong> All cardiac history, asthma, diabetes, allergies, or chronic medication must be accurately declared in your vital profile.</p>
                </div>
              </section>

              {/* 3. Insurance & Evacuation */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>3. Travel Insurance & Emergency Evacuation</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>3.1 Mandatory Coverage:</strong> Trekkers must hold personal wilderness travel insurance covering search, rescue, and high-altitude emergency transport.</p>
                  <p><strong>3.2 Evacuation Costs:</strong> All helicopter rescue, forest team evacuation, and medical clinic costs are the exclusive financial responsibility of the participant.</p>
                </div>
              </section>

              {/* 4. Operational Authority & Route Flexibility */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Compass className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>4. Operational Authority & Route Flexibility</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>4.1 Operational Discretion:</strong> The expedition leader holds complete authority to alter trails, campsite locations, or turn back batches to preserve safety.</p>
                  <p><strong>4.2 Force Majeure:</strong> Natural events, landslides, or government forest permit cancellations cannot be compensated via monetary refunds, but will convert to valid trek credit.</p>
                </div>
              </section>

              {/* 5. Code of Conduct & LNT */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Leaf className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>5. Code of Conduct & Leave No Trace (LNT)</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>5.1 Zero Waste:</strong> BOOTpaths enforces strict Leave No Trace guidelines. All plastics and wrappers must be carried back to base camp.</p>
                  <p><strong>5.2 Substance Ban:</strong> Zero tolerance for narcotics, alcohol, or illicit substances on trails. Violators face immediate expulsion without refund.</p>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {currentTab === 'privacy' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#E7E7E4] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Data Governance</span>
                <h3 className="font-outfit text-2xl font-black text-[#1A1A18] tracking-tight mt-0.5">
                  Privacy Policy & PII Protection Standards
                </h3>
                <p className="text-xs text-[#52524E] mt-1">Last Updated: August 2026 • Compliant with Indian IT Act & DPDP Rules</p>
              </div>

              {/* 1. Information We Collect */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Database className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>1. Information We Collect</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>1.1 Personal Identity:</strong> Name, contact details, emergency phone number, and age for permit processing.</p>
                  <p><strong>1.2 Government IDs:</strong> Aadhaar, Passport, or Driving Licence numbers required by Forest Departments for access clearance.</p>
                  <p><strong>1.3 Health Declarations:</strong> Blood group, allergies, and altitude fitness assessments for expedition team safety.</p>
                </div>
              </section>

              {/* 2. PII Masking & Security Standards */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Lock className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>2. PII Masking & Security Architecture</h4>
                </div>
                <div className="bg-[#F8F8F6] border border-[#E7E7E4] rounded-xl p-4 text-xs leading-relaxed text-[#52524E]">
                  <p className="font-bold text-emerald-700 uppercase mb-1">Strict Identity Masking Active</p>
                  Government ID values are automatically masked (e.g. <span className="font-mono font-bold">XXXX-XXXX-1234</span>) before being displayed on screens or exported into synchronization sheets. Raw unmasked identity documents are never exposed in public application states.
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>2.1 Transmission Security:</strong> All API requests, authentication, and payments use TLS 1.3 encryption and Razorpay PCI-DSS Level 1 certified gateways.</p>
                  <p><strong>2.2 Third-Party Sharing:</strong> Data is shared exclusively with relevant Forest Department check-posts, local rescue services, and insurance providers during active expeditions.</p>
                </div>
              </section>

              {/* 3. Your Rights & Contacts */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <UserCheck className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>3. Data Rights & Inquiries</h4>
                </div>
                <p className="text-xs text-[#52524E] leading-relaxed">
                  You may request data correction, profile deletion, or media opt-outs at any time by contacting our compliance crew at <a href="mailto:support@bootpaths.com" className="text-[#C1571F] font-bold underline">support@bootpaths.com</a>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: CANCELLATION & REFUND POLICY */}
          {currentTab === 'refund' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#E7E7E4] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C1571F]">Reservation Rules</span>
                <h3 className="font-outfit text-2xl font-black text-[#1A1A18] tracking-tight mt-0.5">
                  Cancellation & Refund Policy
                </h3>
                <p className="text-xs text-[#52524E] mt-1">Last Updated: August 2026 • Governs all wilderness passes & batch slots</p>
              </div>

              {/* Refund Tier Table */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Calendar className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>1. Standard Refund Timelines by Category</h4>
                </div>
                <p className="text-xs text-[#52524E]">
                  Refund percentages are calculated strictly based on the elapsed time between your cancellation submission and the expedition batch date:
                </p>

                <div className="overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#F8F8F6] text-xs shadow-xs">
                  <div className="grid grid-cols-2 bg-[#E7E7E4]/50 font-bold border-b border-[#E7E7E4] py-3 px-4 text-[#1A1A18]">
                    <div>Cancellation Notice Period</div>
                    <div>Eligible Refund (Excl. Govt Permits)</div>
                  </div>
                  <div className="divide-y divide-[#E7E7E4]">
                    <div className="grid grid-cols-2 py-3 px-4 items-center">
                      <div className="font-medium text-[#1A1A18]">30 days or more prior to departure</div>
                      <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-200">90% Monetary Refund</div>
                    </div>
                    <div className="grid grid-cols-2 py-3 px-4 items-center">
                      <div className="font-medium text-[#1A1A18]">15 to 29 days prior to departure</div>
                      <div className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit border border-amber-200">50% Monetary Refund</div>
                    </div>
                    <div className="grid grid-cols-2 py-3 px-4 items-center">
                      <div className="font-medium text-[#1A1A18]">Less than 15 days prior to departure</div>
                      <div className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded w-fit border border-rose-200">Non-Refundable (0%)</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trail Wallet & Credit Bonus */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <TrendingUp className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>2. Trail Wallet Credit Option (110% Value)</h4>
                </div>
                <div className="bg-[#F8F8F6] border border-[#E7E7E4] rounded-xl p-4 text-xs leading-relaxed text-[#52524E]">
                  <p className="font-bold text-[#C1571F] uppercase mb-1">Opt for Bonus Trail Credit</p>
                  Instead of standard cash refunds, trekkers can choose to receive their refund credited instantly to their BOOTpaths Trail Wallet with a **10% extra bonus value**, valid for 12 months across all live mountain expeditions.
                </div>
              </section>

              {/* Replacement & Transfers */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <RefreshCw className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>3. Trekker Replacement Policy</h4>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-[#52524E]">
                  <p><strong>3.1 Replacement Window:</strong> You may transfer your pass to another eligible trekker up to 5 days before departure by updating your co-trekker manifest.</p>
                  <p><strong>3.2 Administrative Fee:</strong> A nominal processing fee of ₹500 applies to re-issue forest gate permits and guide roster logs.</p>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="sticky bottom-0 z-20 bg-[#F8F8F6] border-t border-[#E7E7E4] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#52524E]/70 font-medium">
            BOOTpaths Adventure Labs • Certified Mountain Leadership Standards
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#C1571F] hover:bg-[#A84310] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

