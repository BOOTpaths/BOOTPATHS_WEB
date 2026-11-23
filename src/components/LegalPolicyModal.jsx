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
  const [refundCategory, setRefundCategory] = useState('kerala');

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
                  Cancellation &amp; Refund Policy
                </h3>
                <p className="text-xs text-[#52524E] mt-1">Last Updated: November 2026 • 5-Tier Regional Cancellation &amp; Replacement Framework</p>
              </div>

              {/* 1. Regional 5-Tier Refund Policy */}
              <section className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <Calendar className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>1. Standard Cancellation &amp; Refund Slabs (Select Category)</h4>
                </div>
                <p className="text-xs text-[#52524E]">
                  Refund percentages are calculated strictly based on the elapsed time between your cancellation submission and the expedition batch date:
                </p>

                {/* Regional Category Selector Tabs */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { id: 'kerala', label: '1–2 Day Kerala', badge: 'KERALA' },
                    { id: 'karnataka', label: 'Karnataka', badge: 'KARNATAKA' },
                    { id: 'himalayan', label: 'Himalayan', badge: 'HIMALAYAN' },
                    { id: 'international', label: 'International', badge: 'INTERNATIONAL' },
                    { id: 'special', label: 'Special Permit', badge: 'SPECIAL PERMIT' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setRefundCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        refundCategory === cat.id
                          ? 'bg-[#1A1A18] text-white border-[#1A1A18] shadow-xs'
                          : 'bg-[#F8F8F6] text-[#52524E] border-[#E7E7E4] hover:bg-white hover:text-[#1A1A18]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Active Policy Card */}
                {(() => {
                  const POLICIES = {
                    kerala: {
                      title: "1-Day / 2-Day Kerala Treks Cancellation Policy",
                      badge: "KERALA EXPEDITIONS",
                      slabs: [
                        { window: "30+ days before trek", refund: "95% of the Trek Fee" },
                        { window: "15+ days before trek", refund: "80% of the Trek Fee" },
                        { window: "7+ days before trek", refund: "50% Refund" },
                        { window: "Within 7 days", refund: "No Refund" }
                      ]
                    },
                    karnataka: {
                      title: "Karnataka Treks Cancellation Policy",
                      badge: "KARNATAKA EXPEDITIONS",
                      slabs: [
                        { window: "30+ days before trek", refund: "90% of the Trek Fee" },
                        { window: "15+ days before trek", refund: "70% of the Trek Fee" },
                        { window: "7+ days before trek", refund: "40% of the Trek Fee" },
                        { window: "Within 7 days", refund: "No Refund" }
                      ]
                    },
                    himalayan: {
                      title: "Himalayan Treks Cancellation Policy",
                      badge: "HIMALAYAN EXPEDITIONS",
                      slabs: [
                        { window: "45+ days before trek", refund: "90% of the Trek Fee" },
                        { window: "30+ days before trek", refund: "70% of the Trek Fee" },
                        { window: "15+ days before trek", refund: "50% of the Trek Fee" },
                        { window: "Within 15 days / No show", refund: "No Refund" }
                      ]
                    },
                    international: {
                      title: "International Treks Cancellation Policy",
                      badge: "INTERNATIONAL SUMMITS",
                      slabs: [
                        { window: "45+ days before trek", refund: "85% of the Trek Fee" },
                        { window: "30+ days before trek", refund: "75% of the Trek Fee" },
                        { window: "15+ days before trek", refund: "50% of the Trek Fee" },
                        { window: "Within 15 days / No show", refund: "No Refund" }
                      ]
                    },
                    special: {
                      title: "Special Permit Treks Cancellation Policy",
                      badge: "FOREST PERMIT RESTRICTED",
                      note: "Forest Department entry permits are strictly non-refundable once issued.",
                      slabs: [
                        { window: "30+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
                        { window: "15+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
                        { window: "7+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
                        { window: "Within 7 days", refund: "No Refund" }
                      ]
                    }
                  };
                  const activePol = POLICIES[refundCategory] || POLICIES.kerala;

                  return (
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
                      <div className="px-5 py-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400">{activePol.badge}</span>
                          <h5 className="text-sm md:text-base font-bold mt-0.5">{activePol.title}</h5>
                        </div>
                        <span className="text-[11px] text-stone-300">Transparent Refund Terms</span>
                      </div>

                      <div className="p-5 space-y-4">
                        {activePol.note && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                            ⚠️ {activePol.note}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {activePol.slabs.map((s, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">{s.window}</div>
                              <div className="text-xs font-bold text-stone-900 mt-1">{s.refund}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </section>

              {/* 2. BOOTpaths Wallet Money Policy */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <TrendingUp className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>2. BOOTpaths Wallet Money Policy (+50% Additional Value)</h4>
                </div>
                <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200/70 text-xs text-stone-700 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5 text-xs">
                    <span>💳</span>
                    <span>Bonus Credit Carry-Forward Guarantee</span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>Participants opting to carry forward their refund receive <strong>50% additional value</strong> as wallet credit.</li>
                    <li><strong>Credit Validity:</strong> 12 months from the original cancelled trek date.</li>
                    <li><strong>Applicable For:</strong> Self participation or Immediate Family (Parents / Children / Spouse).</li>
                  </ul>
                </div>
              </section>

              {/* 3. Participant Replacement Policy */}
              <section className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#1A1A18] font-bold text-base border-b border-[#E7E7E4] pb-2">
                  <RefreshCw className="h-4.5 w-4.5 text-[#C1571F]" />
                  <h4>3. Participant Replacement Policy</h4>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 text-xs">
                    <span>🔄</span>
                    <span>Replacement &amp; Manifest Transfer Windows</span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li><strong>30+ days before trek:</strong> 100% replacement allowed (no extra fee).</li>
                    <li><strong>15+ days before trek (1–2 Day Treks):</strong> 10% additional charges.</li>
                    <li><strong>15+ days before trek (Himalayan Treks):</strong> 25% additional charges.</li>
                  </ul>
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

