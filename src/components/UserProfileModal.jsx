/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Hiker Vital Profile Modal Component.
 */
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User, Phone, Mail, MapPin, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const HEALTH_ASSESSMENT_OPTIONS = [
  "Fit and prepared for high-altitude trek",
  "Reasonably fit; need basic guidance",
  "Has health concerns to discuss",
  "On regular medication",
  "Have special needs / support required",
  "Other:"
];

const ID_TYPE_OPTIONS = [
  "Aadhaar Card",
  "Passport",
  "Driving Licence",
  "Voter ID"
];

const parseProfileData = (data = {}) => {
  let healthAssessment = data.healthAssessment || '';
  let healthOtherDetails = data.healthOtherDetails || '';
  
  if (!healthAssessment && data.fitnessLevel) {
    if (data.fitnessLevel.startsWith('Other:')) {
      healthAssessment = 'Other:';
      healthOtherDetails = data.fitnessLevel.replace(/^Other:\s*/, '').trim();
    } else if (HEALTH_ASSESSMENT_OPTIONS.includes(data.fitnessLevel)) {
      healthAssessment = data.fitnessLevel;
    } else {
      healthAssessment = 'Other:';
      healthOtherDetails = data.fitnessLevel;
    }
  }

  if (!HEALTH_ASSESSMENT_OPTIONS.includes(healthAssessment)) {
    if (healthAssessment) {
      healthOtherDetails = healthAssessment;
      healthAssessment = 'Other:';
    } else {
      healthAssessment = 'Fit and prepared for high-altitude trek';
    }
  }

  let idType = data.idType || '';
  let idNumber = data.idNumber || '';
  const rawIdCard = data.idCardNumber || data.govId || '';

  if (!idType || !idNumber) {
    let found = false;
    for (const t of ID_TYPE_OPTIONS) {
      if (rawIdCard.toLowerCase().startsWith(t.toLowerCase() + ':')) {
        idType = t;
        idNumber = rawIdCard.slice(t.length + 1).trim();
        found = true;
        break;
      }
    }
    if (!found) {
      idType = idType || 'Aadhaar Card';
      idNumber = idNumber || rawIdCard;
    }
  }

  return {
    healthAssessment,
    healthOtherDetails,
    idType,
    idNumber
  };
};

export default function UserProfileModal({ isOpen, onClose, user, onProfileSaved }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    whatsapp: '',
    hometown: '',
    dietary: 'Standard Veg',
    healthAssessment: 'Fit and prepared for high-altitude trek',
    healthOtherDetails: '',
    fitnessLevel: 'Fit and prepared for high-altitude trek',
    idType: 'Aadhaar Card',
    idNumber: '',
    idCardNumber: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load from localStorage first
    let initialData = {};
    try {
      const cached = localStorage.getItem('bootpaths_hiker_profile');
      if (cached) {
        initialData = JSON.parse(cached);
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    const currentUser = auth.currentUser || user;
    if (currentUser) {
      const parsedCached = parseProfileData(initialData);
      setForm((prev) => ({
        ...prev,
        fullName: initialData.fullName || currentUser.displayName || currentUser.name || '',
        email: initialData.email || currentUser.email || '',
        age: initialData.age || '',
        gender: initialData.gender || '',
        whatsapp: initialData.whatsapp || initialData.mobile || '',
        hometown: initialData.hometown || '',
        dietary: initialData.dietary || 'Standard Veg',
        healthAssessment: parsedCached.healthAssessment,
        healthOtherDetails: parsedCached.healthOtherDetails,
        fitnessLevel: initialData.fitnessLevel || parsedCached.healthAssessment,
        idType: parsedCached.idType,
        idNumber: parsedCached.idNumber,
        idCardNumber: initialData.idCardNumber || '',
        emergencyName: initialData.emergencyName || initialData.emergencyContact || '',
        emergencyPhone: initialData.emergencyPhone || ''
      }));

      // Fetch latest from Firestore
      if (currentUser.uid && !currentUser.uid.startsWith('guest-')) {
        getDoc(doc(db, 'users', currentUser.uid))
          .then((snap) => {
            if (snap.exists()) {
              const data = snap.data();
              const prof = data.profile || data;
              const parsedFirestore = parseProfileData(prof);
              setForm((prev) => ({
                ...prev,
                fullName: prof.fullName || prev.fullName,
                email: prof.email || prev.email,
                age: prof.age || prev.age,
                gender: prof.gender || prev.gender,
                whatsapp: prof.whatsapp || prof.mobile || prev.whatsapp,
                hometown: prof.hometown || prev.hometown,
                dietary: prof.dietary || prev.dietary,
                healthAssessment: parsedFirestore.healthAssessment || prev.healthAssessment,
                healthOtherDetails: parsedFirestore.healthOtherDetails || prev.healthOtherDetails,
                fitnessLevel: prof.fitnessLevel || parsedFirestore.healthAssessment || prev.fitnessLevel,
                idType: parsedFirestore.idType || prev.idType,
                idNumber: parsedFirestore.idNumber || prev.idNumber,
                idCardNumber: prof.idCardNumber || prev.idCardNumber,
                emergencyName: prof.emergencyName || prof.emergencyContact || prev.emergencyName,
                emergencyPhone: prof.emergencyPhone || prev.emergencyPhone
              }));
              try {
                localStorage.setItem('bootpaths_hiker_profile', JSON.stringify(prof));
              } catch (err) {
                console.warn('Cache error:', err);
              }
            }
          })
          .catch((err) => console.warn('Firestore profile load error:', err));
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!auth.currentUser) {
      alert('Please log in to save your hiker profile.');
      return;
    }

    if (form.healthAssessment === 'Other:' && !form.healthOtherDetails?.trim()) {
      alert('Please provide details for your health assessment selection.');
      return;
    }

    if (!form.idNumber?.trim()) {
      alert('Please enter your Govt ID document number.');
      return;
    }

    setIsSaving(true);
    setSavedSuccess(false);

    const resolvedFitnessLevel = form.healthAssessment === "Other:" && form.healthOtherDetails?.trim()
      ? `Other: ${form.healthOtherDetails.trim()}`
      : form.healthAssessment;

    const formattedIdCard = `${form.idType || "Aadhaar Card"}: ${form.idNumber.trim()}`;

    const profileData = {
      fullName: form.fullName?.trim() || "",
      email: form.email?.trim() || auth.currentUser.email || "",
      age: Number(form.age) || 0,
      gender: form.gender || "",
      whatsapp: form.whatsapp?.trim() || "",
      hometown: form.hometown?.trim() || "",
      dietary: form.dietary || "Standard Veg",
      healthAssessment: form.healthAssessment || "Fit and prepared for high-altitude trek",
      healthOtherDetails: form.healthOtherDetails?.trim() || "",
      fitnessLevel: resolvedFitnessLevel,
      idType: form.idType || "Aadhaar Card",
      idNumber: form.idNumber.trim(),
      idCardNumber: formattedIdCard,
      emergencyName: form.emergencyName?.trim() || "",
      emergencyPhone: form.emergencyPhone?.trim() || "",
      isProfileComplete: Boolean(
        form.fullName?.trim() &&
        form.email?.trim() &&
        form.age &&
        Number(form.age) >= 10 &&
        form.gender &&
        form.whatsapp?.trim() &&
        form.hometown?.trim() &&
        form.dietary &&
        form.healthAssessment &&
        (form.healthAssessment !== "Other:" || form.healthOtherDetails?.trim()) &&
        form.idNumber.trim() &&
        form.emergencyName?.trim() &&
        form.emergencyPhone?.trim()
      ),
      updatedAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...profileData,
        profile: profileData,
        name: profileData.fullName || auth.currentUser.displayName
      }, { merge: true });

      // 2. Cache in localStorage for instant checkout access
      localStorage.setItem("bootpaths_hiker_profile", JSON.stringify(profileData));

      setSavedSuccess(true);
      if (onProfileSaved) {
        onProfileSaved(profileData);
      }
      alert("Hiker credentials saved successfully!");
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-2xl animate-in zoom-in-95 duration-200 text-[#1A1A18] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F8F8F6] px-6 py-4 flex items-center justify-between border-b border-[#E7E7E4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#C1571F]/10 flex items-center justify-center text-[#C1571F]">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold text-[#1A1A18] leading-tight">
                Hiker Vital Profile
              </h3>
              <span className="text-[10px] text-[#52524E]">
                Mandatory for permits and expedition manifests
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#FFFFFF] border border-[#E7E7E4] text-[#52524E] hover:text-[#1A1A18] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Official Name (as on Govt ID)"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  required
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="e.g. 26"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary / Other">Non-binary / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Hometown / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.hometown}
                  onChange={(e) => setForm({ ...form, hometown: e.target.value })}
                  placeholder="e.g. Bengaluru / Kochi"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Dietary Preference <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.dietary}
                  onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                >
                  <option value="Standard Veg">Standard Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Jain / Pure Veg">Jain / Pure Veg</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className={form.healthAssessment === 'Other:' ? 'sm:col-span-2' : ''}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Health Assessment <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.healthAssessment}
                  onChange={(e) => setForm({ ...form, healthAssessment: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                >
                  {HEALTH_ASSESSMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {form.healthAssessment === 'Other:' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={form.healthOtherDetails}
                      onChange={(e) => setForm({ ...form, healthOtherDetails: e.target.value })}
                      placeholder="Please specify your health details / condition..."
                      className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  ID Card Number (Govt ID) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <select
                      required
                      value={form.idType}
                      onChange={(e) => setForm({ ...form, idType: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                    >
                      {ID_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      value={form.idNumber}
                      onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                      placeholder="Enter Document / Card Number"
                      className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#C1571F]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Emergency Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.emergencyName}
                  onChange={(e) => setForm({ ...form, emergencyName: e.target.value })}
                  placeholder="Emergency contact person"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#52524E] mb-1">
                  Emergency Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  placeholder="10-digit emergency number"
                  className="w-full h-10 px-3 rounded-xl border border-[#E7E7E4] bg-[#FFFFFF] text-xs focus:outline-none focus:border-[#C1571F]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex h-11 items-center justify-center rounded-xl bg-[#C1571F] hover:bg-[#A84310] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'SAVE HIKER CREDENTIALS'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

