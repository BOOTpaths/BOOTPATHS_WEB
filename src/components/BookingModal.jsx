/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Razorpay Standard Web Checkout Modal for BOOTpaths Expeditions.
 * Supports Lead Trekker + Dynamic Co-Trekker Roster Pattern.
 */
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Shield, Calendar, Users, Phone, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, doc, getDoc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db, auth } from '../config/firebase';

const HEALTH_ASSESSMENT_OPTIONS = [
  "Fit and prepared for high-altitude trek",
  "Reasonably fit; need basic guidance",
  "Has health concerns to discuss",
  "On regular medication",
  "Have special needs / support required",
  "Other"
];

const ID_TYPE_OPTIONS = [
  "Aadhaar Card",
  "Passport",
  "Driving Licence",
  "Voter ID"
];

const DIETARY_OPTIONS = [
  "Standard Veg",
  "Non-Veg",
  "Jain / Pure Veg",
  "Vegan"
];

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other"
];

/**
 * Dynamically injects and loads the Razorpay standard checkout script.
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec";

/**
 * Resolves reliable Trek Title across multiple property keys and objects with robust fallback.
 */
const getResolvedTrekTitle = (candidateObj) => {
  const candidate =
    candidateObj?.trekTitle ||
    candidateObj?.title ||
    candidateObj?.trekName ||
    candidateObj?.name ||
    candidateObj?.destination ||
    candidateObj?.packageTitle ||
    "";

  const trimmed = String(candidate || "").trim();
  return trimmed.length > 0 ? trimmed : "Agasthyarkoodam Wilderness Trek";
};

/**
 * Dispatches verified booking and Hiker Vital Profile credentials directly to Google Sheets Webhook.
 * Sends both root lead fields and full multi-trekker roster array.
 */
const syncBookingToGoogleSheet = async (bookingData) => {
  const GOOGLE_SHEETS_WEBHOOK_URL =
    "https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec";

  // 1. Pull saved Hiker Profile safely from localStorage
  let profile = {};
  try {
    const rawProfile = localStorage.getItem("bootpaths_hiker_profile");
    if (rawProfile) {
      profile = JSON.parse(rawProfile);
    }
  } catch (err) {
    console.warn("Failed to parse local profile:", err);
  }

  // 2. Resolve exact Trek Title
  const resolvedTrekTitle =
    bookingData?.trekTitle ||
    bookingData?.title ||
    bookingData?.destination ||
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('trek') : null) ||
    "Agasthyarkoodam Wilderness Trek";

  // 3. Construct unified Lead info matching Apps Script properties precisely
  const resolvedHealth =
    profile.healthAssessment === "Other:" && profile.healthOtherDetails
      ? `Other: ${profile.healthOtherDetails.trim()}`
      : (profile.healthAssessment || profile.fitnessLevel || "Fit and prepared for high-altitude trek");

  const resolvedIdCard =
    profile.idCardNumber ||
    (profile.idType && profile.idNumber ? `${profile.idType}: ${profile.idNumber}` : (profile.idNumber || profile.govId || "N/A"));

  // 4. Format multi-trekker roster array
  const rawTrekkers = Array.isArray(bookingData.trekkers) && bookingData.trekkers.length > 0
    ? bookingData.trekkers
    : [];

  const formattedTrekkers = rawTrekkers.map((t, idx) => {
    const isLead = idx === 0;
    const tHealth = t.healthAssessment === "Other:" && t.healthOtherDetails
      ? `Other: ${t.healthOtherDetails.trim()}`
      : (t.healthAssessment || (isLead ? resolvedHealth : "Fit and prepared for high-altitude trek"));

    const tId = t.idType && t.idNumber
      ? `${t.idType}: ${t.idNumber}`
      : (t.idNumber || t.idCardNumber || (isLead ? resolvedIdCard : "N/A"));

    const tName = t.fullName || t.name || (isLead ? (profile.fullName || bookingData.payerName || auth.currentUser?.displayName || "Lead Trekker") : `Trekker #${idx + 1}`);

    return {
      fullName: tName,
      name: tName,
      age: t.age !== undefined && t.age !== "" ? t.age : (isLead ? (profile.age || "N/A") : "N/A"),
      gender: t.gender || (isLead ? (profile.gender || "N/A") : "Male"),
      whatsapp: t.whatsapp || (isLead ? (profile.whatsapp || bookingData.payerPhone || "N/A") : (profile.whatsapp || bookingData.payerPhone || "N/A")),
      email: t.email || (isLead ? (profile.email || bookingData.payerEmail || auth.currentUser?.email || "N/A") : "N/A"),
      idType: t.idType || "Aadhaar Card",
      idNumber: t.idNumber || "",
      idCard: tId,
      idCardNumber: tId,
      dietary: t.dietary || (isLead ? (profile.dietary || "Standard Veg") : "Standard Veg"),
      healthAssessment: tHealth,
      fitnessLevel: tHealth,
      emergencyName: isLead ? (profile.emergencyName || "N/A") : (t.emergencyName || profile.emergencyName || "N/A"),
      emergencyPhone: isLead ? (profile.emergencyPhone || "N/A") : (t.emergencyPhone || profile.emergencyPhone || "N/A"),
      isLead: isLead,
      role: isLead ? "Lead Trekker" : `Co-Trekker #${idx + 1}`
    };
  });

  const payload = {
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    bookingId: bookingData.bookingId || `BP-${Math.floor(100000 + Math.random() * 900000)}`,
    fullName: profile.fullName || bookingData.payerName || auth.currentUser?.displayName || "Trek Participant",
    email: profile.email || bookingData.payerEmail || auth.currentUser?.email || "N/A",
    age: profile.age !== undefined && profile.age !== "" ? profile.age : "N/A",
    gender: profile.gender || "N/A",
    whatsapp: profile.whatsapp || profile.contactMobile || bookingData.payerPhone || "N/A",
    hometown: profile.hometown || "N/A",
    dietary: profile.dietary || "Standard Veg",
    fitnessLevel: resolvedHealth,
    healthAssessment: resolvedHealth,
    idCardNumber: resolvedIdCard,
    emergencyName: profile.emergencyName || "N/A",
    emergencyPhone: profile.emergencyPhone || "N/A",
    trekTitle: resolvedTrekTitle,
    batchDate: bookingData.batchDate || bookingData.selectedDate || "Upcoming Batch",
    trekkersCount: Number(bookingData.trekkersCount || (formattedTrekkers.length > 0 ? formattedTrekkers.length : 1)),
    amountPaid: Number(bookingData.amountPaid || bookingData.payableAmount || 1),
    status: "CONFIRMED",
    trekkers: formattedTrekkers.length > 0 ? formattedTrekkers : [
      {
        fullName: profile.fullName || bookingData.payerName || "Lead Trekker",
        name: profile.fullName || bookingData.payerName || "Lead Trekker",
        age: profile.age || "N/A",
        gender: profile.gender || "N/A",
        whatsapp: profile.whatsapp || bookingData.payerPhone || "N/A",
        email: profile.email || bookingData.payerEmail || "N/A",
        idCardNumber: resolvedIdCard,
        dietary: profile.dietary || "Standard Veg",
        healthAssessment: resolvedHealth,
        role: "Lead Trekker",
        isLead: true
      }
    ]
  };

  console.log("🚀 Sending Verified Multi-Trekker Payload to Google Sheets:", payload);

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    console.log("✅ Google Sheet sync request transmitted successfully.");
  } catch (error) {
    console.error("❌ Google Sheet sync error:", error);
  }
};

export default function BookingModal({
  isOpen,
  onClose,
  trek,
  selectedDate: initialDate,
  currentUser,
  onBookingSuccess,
  onOpenProfileModal
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedDate: '',
    numberOfTrekkers: 1
  });

  const [trekkerCount, setTrekkerCount] = useState(1);
  const [trekkersList, setTrekkersList] = useState([]); // Co-trekkers (length = trekkerCount - 1)
  const [leadProfile, setLeadProfile] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('IDLE'); // 'IDLE' | 'SUCCESS' | 'FAILED'
  const [paymentError, setPaymentError] = useState(null);

  // Sync initial user details, profile, and dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        let nameVal = currentUser?.displayName || currentUser?.name || '';
        let emailVal = currentUser?.email || '';
        let phoneVal = currentUser?.phone || '';
        let cachedProf = {};

        try {
          const cached = localStorage.getItem("bootpaths_hiker_profile");
          if (cached) cachedProf = JSON.parse(cached);
        } catch (e) {
          console.warn("Cached profile parse error:", e);
        }

        let fullProf = { ...cachedProf };

        if (currentUser?.uid && !currentUser.uid.startsWith('guest-')) {
          try {
            const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
            if (userSnap.exists()) {
              const data = userSnap.data();
              const prof = data.profile || data;
              fullProf = { ...fullProf, ...prof };
            }
          } catch (err) {
            console.warn('User profile fetch in BookingModal notice:', err);
          }
        }

        if (fullProf.fullName) nameVal = fullProf.fullName;
        if (fullProf.email) emailVal = fullProf.email;
        if (fullProf.whatsapp || fullProf.mobile || fullProf.phone) {
          phoneVal = fullProf.whatsapp || fullProf.mobile || fullProf.phone;
        }

        setLeadProfile(fullProf);
        setTrekkerCount(1);
        setTrekkersList([]);

        setFormData({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          selectedDate: initialDate || (trek?.batchDates && trek.batchDates[0]) || '',
          numberOfTrekkers: 1
        });
      };

      loadProfile();
      setFormErrors({});
      setIsSuccess(false);
      setIsProcessing(false);
      setConfirmedBookingId('');
      setPaymentStatus('IDLE');
      setPaymentError(null);
    }
  }, [isOpen, initialDate, trek, currentUser]);

  if (!isOpen || !trek) return null;

  // Dynamic Price and Amount Calculation
  const unitPrice = Number(String(trek.price || 0).replace(/[^0-9]/g, '')) || 0;
  const trekkers = Number(trekkerCount || formData.numberOfTrekkers || 1);
  const totalAmount = unitPrice * trekkers;
  const amountInPaise = totalAmount * 100;
  const trekTitle = getResolvedTrekTitle(trek);

  const handleUpdateTrekkersCount = (newCount) => {
    const targetCount = Math.max(1, Math.min(15, Number(newCount) || 1));
    setTrekkerCount(targetCount);
    setFormData(prev => ({ ...prev, numberOfTrekkers: targetCount }));

    const coTrekkerCount = targetCount - 1;
    setTrekkersList(prev => {
      if (prev.length === coTrekkerCount) return prev;
      if (prev.length < coTrekkerCount) {
        const added = [];
        for (let i = prev.length; i < coTrekkerCount; i++) {
          added.push({
            fullName: "",
            age: "",
            gender: "Male",
            idType: "Aadhaar Card",
            idNumber: "",
            dietary: "Standard Veg",
            healthAssessment: "Fit and prepared for high-altitude trek"
          });
        }
        return [...prev, ...added];
      }
      return prev.slice(0, coTrekkerCount);
    });
  };

  const updateTrekker = (index, field, value) => {
    setTrekkersList(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });
  };

  const handleLeadFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateLeadForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = '10-digit mobile number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPay = async (e) => {
    if (e) e.preventDefault();
    if (!validateLeadForm()) return;

    // 1. Validation Gate on Co-Trekkers
    for (let i = 0; i < trekkersList.length; i++) {
      const t = trekkersList[i];
      if (!t.fullName || !t.fullName.trim() || !t.age || !t.idNumber || !t.idNumber.trim()) {
        alert(`Please enter all required details for Trekker #${i + 2} before proceeding to payment.`);
        return;
      }
    }

    // 2. Enforce Booking Gate Check: Mandatory Hiker Vital Profile for Lead Trekker
    try {
      let prof = {};
      try {
        const cached = localStorage.getItem("bootpaths_hiker_profile");
        if (cached) prof = JSON.parse(cached);
      } catch (e) {
        console.warn("Cached profile read error:", e);
      }

      const activeUser = auth.currentUser || currentUser;
      if (activeUser?.uid && !activeUser.uid.startsWith('guest-')) {
        const userSnap = await getDoc(doc(db, 'users', activeUser.uid));
        if (userSnap.exists()) {
          const data = userSnap.data() || {};
          const firestoreProf = data.profile || data;
          prof = { ...firestoreProf, ...prof };
        }
      }

      const hasAge = Boolean(prof.age && Number(prof.age) >= 10);
      const hasGender = Boolean(prof.gender && String(prof.gender).trim().length > 0);
      const hasHealth = Boolean((prof.healthAssessment || prof.fitnessLevel) && String(prof.healthAssessment || prof.fitnessLevel).trim().length > 0);
      const hasGovtId = Boolean((prof.idCardNumber || prof.idNumber || prof.govId)?.trim());
      const hasEmergency = Boolean(
        (prof.emergencyName || prof.emergencyContact || prof.emergencyContactName)?.trim() &&
        (prof.emergencyPhone || prof.emergencyContactPhone)?.trim()
      );

      const isComplete = hasAge && hasGender && hasHealth && hasGovtId && hasEmergency;

      if (!isComplete) {
        alert("⚠️ Mandatory Hiker Profile Incomplete\n\nPlease complete all Hiker Vital Profile details (Age, Gender, Health Assessment, Govt ID, Emergency Contact) before proceeding to pay.");
        if (onOpenProfileModal) {
          onOpenProfileModal();
        }
        return;
      }
    } catch (err) {
      console.warn('Profile validation check notice:', err);
    }

    // 3. Build Full Roster (Lead + Co-Trekkers)
    const leadTrekker = {
      fullName: formData.name || leadProfile.fullName || currentUser?.displayName || "Lead Trekker",
      name: formData.name || leadProfile.fullName || currentUser?.displayName || "Lead Trekker",
      email: formData.email || leadProfile.email || currentUser?.email || "N/A",
      whatsapp: formData.phone || leadProfile.whatsapp || "N/A",
      age: leadProfile.age || "N/A",
      gender: leadProfile.gender || "Male",
      idType: leadProfile.idType || "Aadhaar Card",
      idNumber: leadProfile.idNumber || leadProfile.idCardNumber || "",
      idCardNumber: leadProfile.idCardNumber || (leadProfile.idType && leadProfile.idNumber ? `${leadProfile.idType}: ${leadProfile.idNumber}` : leadProfile.idNumber || "N/A"),
      dietary: leadProfile.dietary || "Standard Veg",
      healthAssessment: leadProfile.healthAssessment || "Fit and prepared for high-altitude trek",
      emergencyName: leadProfile.emergencyName || "N/A",
      emergencyPhone: leadProfile.emergencyPhone || "N/A",
      role: "Lead Trekker",
      isLead: true
    };

    const coTrekkersFormatted = trekkersList.map((t, idx) => ({
      fullName: t.fullName.trim(),
      name: t.fullName.trim(),
      age: t.age,
      gender: t.gender || "Male",
      idType: t.idType || "Aadhaar Card",
      idNumber: t.idNumber.trim(),
      idCardNumber: `${t.idType || "Aadhaar Card"}: ${t.idNumber.trim()}`,
      dietary: t.dietary || "Standard Veg",
      healthAssessment: t.healthAssessment || "Fit and prepared for high-altitude trek",
      role: `Co-Trekker #${idx + 2}`,
      isLead: false
    }));

    const resolvedTrekkers = [leadTrekker, ...coTrekkersFormatted];

    setIsProcessing(true);

    try {
      const sysControls = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('bootpaths_system_controls') || '{}') : {};
      const isReadOnly = sysControls.readOnly === true;
      const isMockCheckout = sysControls.mockCheckout === true;

      if (isReadOnly) {
        alert('Platform is currently in Read-Only Maintenance Mode. New bookings are temporarily paused.');
        setIsProcessing(false);
        return;
      }

      if (isMockCheckout) {
        setTimeout(async () => {
          try {
            const bookingDoc = {
              trekId: trek.id || 'trek-entry',
              trekName: trekTitle,
              title: trekTitle,
              userName: formData.name,
              userEmail: formData.email,
              userPhone: formData.phone,
              date: formData.selectedDate || 'Scheduled Batch',
              batchDate: formData.selectedDate || 'Scheduled Batch',
              trekkersCount: trekkers,
              trekkers: resolvedTrekkers,
              trekkersList: resolvedTrekkers,
              price: totalAmount,
              totalAmount: totalAmount,
              paymentId: `MOCK-PAY-${Date.now()}`,
              paymentStatus: 'SUCCESS (Dev Mode)',
              bookingStatus: 'CONFIRMED',
              status: 'Confirmed',
              isDemo: true,
              createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
            const displayId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
            setConfirmedBookingId(displayId);
            setIsSuccess(true);
            setIsProcessing(false);

            try {
              const activeTrekTitle = getResolvedTrekTitle(trek);

              await syncBookingToGoogleSheet({
                bookingId: displayId,
                trekTitle: activeTrekTitle,
                batchDate: formData.selectedDate || 'Scheduled Batch',
                trekkersCount: trekkers,
                amountPaid: totalAmount,
                payerName: currentUser?.displayName || formData.name,
                payerEmail: currentUser?.email || formData.email,
                payerPhone: formData.phone,
                trekkers: resolvedTrekkers
              });
            } catch (syncErr) {
              console.warn('Mock Google Sheet sync notice:', syncErr);
            }

            if (onBookingSuccess) {
              onBookingSuccess({ id: docRef.id, ...bookingDoc, displayId });
            }
          } catch (err) {
            console.warn('Mock booking write notice:', err);
            const displayId = `BP-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
            setConfirmedBookingId(displayId);
            setIsSuccess(true);
            setIsProcessing(false);
          }
        }, 600);
        return;
      }

      // Dynamic Script Loader
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Unable to load Razorpay checkout SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // Configure Standard Modal Options
      const razorpayKey = (import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TcJLNqT26Th7Rg').trim();
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: 'INR',
        name: 'BOOTpaths Expeditions',
        description: `${trekTitle} Booking (${trekkers} ${trekkers === 1 ? 'Trekker' : 'Trekkers'})`,
        image: '/logo.png',
        prefill: {
          name: formData.name || '',
          email: formData.email || '',
          contact: formData.phone || ''
        },
        notes: {
          trekId: trek.id || 'trek-entry',
          trekName: trekTitle,
          batchDate: formData.selectedDate || 'Scheduled Batch',
          numTrekkers: String(trekkers)
        },
        theme: {
          color: '#EB5A0D'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment dismissed by user.');
            setIsProcessing(false);
          }
        },
        handler: async function (response) {
          console.log("Live Payment Success:", response.razorpay_payment_id);
          try {
            const displayId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
            const bookingDoc = {
              displayId,
              bookingId: displayId,
              trekId: trek.id || 'trek-entry',
              trekName: trekTitle,
              title: trekTitle,
              userName: formData.name,
              userEmail: formData.email,
              userPhone: formData.phone,
              date: formData.selectedDate || 'Scheduled Batch',
              batchDate: formData.selectedDate || 'Scheduled Batch',
              trekkersCount: trekkers,
              trekkers: resolvedTrekkers,
              trekkersList: resolvedTrekkers,
              price: totalAmount,
              totalAmount: totalAmount,
              paymentId: response.razorpay_payment_id || `PAY-${Date.now()}`,
              paymentStatus: 'SUCCESS',
              bookingStatus: 'CONFIRMED',
              status: 'CONFIRMED',
              paymentMode: 'LIVE',
              createdAt: new Date().toISOString()
            };

            let savedBookingId = displayId;

            // Atomic Firestore Transaction
            if (trek?.id) {
              try {
                await runTransaction(db, async (transaction) => {
                  const trekRef = doc(db, 'packages', trek.id);
                  const trekSnap = await transaction.get(trekRef);

                  if (trekSnap.exists()) {
                    const data = trekSnap.data();
                    const currentSlots = Number(data.availableSlots ?? data.slotsLeft ?? 10);
                    const newSlots = Math.max(0, currentSlots - trekkers);

                    transaction.update(trekRef, {
                      availableSlots: newSlots,
                      slotsLeft: newSlots
                    });
                  }

                  const newBookingRef = doc(collection(db, 'bookings'));
                  savedBookingId = newBookingRef.id;
                  transaction.set(newBookingRef, { ...bookingDoc, id: newBookingRef.id });
                });
              } catch (txErr) {
                console.warn('Transaction write notice, using standard fallback:', txErr);
                const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
                savedBookingId = docRef.id;
              }
            } else {
              const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
              savedBookingId = docRef.id;
            }

            setConfirmedBookingId(displayId);
            setPaymentStatus('SUCCESS');
            setIsSuccess(true);
            setIsProcessing(false);

            // Automated Email Dispatch via EmailJS
            try {
              const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_bootpaths';
              const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_booking_conf';
              const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';

              const bookingDetails = {
                booking_id: displayId,
                to_name: formData.name,
                to_email: formData.email,
                to_phone: formData.phone,
                trek_title: trekTitle,
                batch_date: formData.selectedDate || 'Scheduled Batch',
                trekkers_count: trekkers,
                amount_paid: totalAmount,
                payment_id: response.razorpay_payment_id
              };

              if (emailPublicKey && emailPublicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                emailjs.send(
                  emailServiceId,
                  emailTemplateId,
                  bookingDetails,
                  emailPublicKey
                ).then(() => {
                  console.log('Confirmation email sent successfully.');
                }).catch((err) => {
                  console.error('Email dispatch error:', err);
                });
              }
            } catch (emailErr) {
              console.error('EmailJS invocation error:', emailErr);
            }

            // Dispatch Booking & Multi-Trekker Roster to Google Sheets Webhook
            try {
              const activeTrekTitle = getResolvedTrekTitle(trek);

              await syncBookingToGoogleSheet({
                bookingId: displayId,
                trekTitle: activeTrekTitle,
                batchDate: formData.selectedDate || 'Scheduled Batch',
                trekkersCount: trekkers,
                amountPaid: totalAmount,
                payerName: currentUser?.displayName || formData.name,
                payerEmail: currentUser?.email || formData.email,
                payerPhone: formData.phone,
                trekkers: resolvedTrekkers
              });
            } catch (sheetErr) {
              console.warn('Google Sheet webhook sync notice:', sheetErr);
            }

            if (onBookingSuccess) {
              onBookingSuccess({ id: savedBookingId, ...bookingDoc, displayId });
            }
          } catch (error) {
            console.error('Firestore booking write failed:', error);
            alert(`Payment captured (${response.razorpay_payment_id}), but saving confirmation encountered an error. Support has been notified.`);
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("Payment Failed:", response.error);
        setPaymentStatus('FAILED');
        setIsProcessing(false);
        setPaymentError({
          code: response.error?.code || 'PAYMENT_FAILED',
          description: response.error?.description || 'Your transaction could not be completed. Any deducted funds will be refunded by your bank within 3-5 business days.',
          source: response.error?.source,
          step: response.error?.step,
          reason: response.error?.reason
        });
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay launch exception:', err);
      setPaymentStatus('FAILED');
      setPaymentError({
        code: 'GATEWAY_ERROR',
        description: 'An unexpected error occurred while launching payment. Please try again or check your network.'
      });
      setIsProcessing(false);
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus('IDLE');
    setPaymentError(null);
    handleProceedToPay();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full ${trekkers > 1 ? 'max-w-2xl' : 'max-w-lg'} transition-all duration-300 overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-2xl animate-in zoom-in-95 duration-200 text-[#1A1A18] max-h-[92vh] flex flex-col`}>

        {/* Header */}
        <div className="bg-[#F8F8F6] px-6 py-4 flex items-center justify-between border-b border-[#E7E7E4] shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="BOOTpaths"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#EB5A0D] block">
                Razorpay Standard Web Checkout
              </span>
              <h3 className="font-outfit text-base font-bold text-[#1A1A18] leading-tight">
                {trekTitle}
              </h3>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {paymentStatus === 'FAILED' ? (
            /* Dedicated Payment Failed Screen */
            <div className="text-center py-6 px-4 animate-in fade-in duration-300 space-y-4">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-red-200">
                ✕
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 block">
                  Transaction Incomplete
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-0.5 font-outfit">
                  Payment Failed
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1.5">
                  {paymentError?.description || "Your transaction could not be completed. Any deducted funds will be refunded by your bank within 3-5 business days."}
                </p>
              </div>

              <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-xl text-xs font-mono text-stone-500 border border-[#E7E7E4] dark:border-stone-700">
                Error Ref: {paymentError?.code || "PAYMENT_CANCELLED"}
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="w-full flex h-11 items-center justify-center rounded-xl bg-[#EB5A0D] hover:bg-[#D44E08] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Try Payment Again
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentStatus('IDLE');
                    setPaymentError(null);
                  }}
                  className="w-full py-2 px-4 text-[#52524E] hover:text-[#1A1A18] text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel &amp; Back to Details
                </button>
              </div>
            </div>
          ) : !isSuccess && paymentStatus !== 'SUCCESS' ? (
            <form onSubmit={handleProceedToPay} className="space-y-4">
              {/* Trek & Bill Summary Card */}
              <div className="rounded-xl bg-[#F8F8F6] border border-[#E7E7E4] p-4 space-y-2">
                <div className="flex items-center justify-between text-[#52524E]">
                  <span>Package Base Price:</span>
                  <span className="font-bold text-[#1A1A18]">₹{unitPrice.toLocaleString('en-IN')} / trekker</span>
                </div>

                {/* Batch Date Selector */}
                {trek.batchDates && trek.batchDates.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E7E4]">
                    <span className="flex items-center gap-1.5 text-[#52524E]">
                      <Calendar className="h-3.5 w-3.5 text-[#EB5A0D]" /> Batch Date:
                    </span>
                    <select
                      value={formData.selectedDate}
                      onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                      className="bg-white border border-[#E7E7E4] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1A1A18] focus:outline-none focus:border-[#EB5A0D]"
                    >
                      {trek.batchDates.map((bDate, idx) => (
                        <option key={idx} value={bDate}>{bDate}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Trekkers Count Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E7E7E4]">
                  <span className="flex items-center gap-1.5 text-[#52524E]">
                    <Users className="h-3.5 w-3.5 text-[#EB5A0D]" /> Number of Trekkers:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateTrekkersCount(trekkerCount - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E7E7E4] text-[#1A1A18] font-bold hover:bg-[#FAF8F5] flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-[#1A1A18] text-sm">
                      {trekkerCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateTrekkersCount(trekkerCount + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E7E7E4] text-[#1A1A18] font-bold hover:bg-[#FAF8F5] flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Calculated Amount */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E7E7E4] font-outfit">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A18]">
                    Total Payable:
                  </span>
                  <span className="text-xl font-black text-[#EB5A0D]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Lead Participant Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#52524E] block">
                    Lead Trekker Details (Trekker #1)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    Auto-filled from Profile
                  </span>
                </div>

                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#52524E]/50" />
                    <input
                      type="text"
                      placeholder="Full Legal Name (Lead Payer) *"
                      required
                      value={formData.name}
                      onChange={(e) => handleLeadFieldChange('name', e.target.value)}
                      className={`w-full h-10 pl-9 pr-3 rounded-xl border ${formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-[#E7E7E4] bg-[#F8F8F6]'} text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:border-[#EB5A0D]`}
                    />
                  </div>
                  {formErrors.name && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.name}</span>}
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#52524E]/50" />
                    <input
                      type="email"
                      placeholder="Email Address (for Tickets & Receipts) *"
                      required
                      value={formData.email}
                      onChange={(e) => handleLeadFieldChange('email', e.target.value)}
                      className={`w-full h-10 pl-9 pr-3 rounded-xl border ${formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E7E7E4] bg-[#F8F8F6]'} text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:border-[#EB5A0D]`}
                    />
                  </div>
                  {formErrors.email && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.email}</span>}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#52524E]/50" />
                    <input
                      type="tel"
                      placeholder="WhatsApp / Mobile Number *"
                      required
                      value={formData.phone}
                      onChange={(e) => handleLeadFieldChange('phone', e.target.value)}
                      className={`w-full h-10 pl-9 pr-3 rounded-xl border ${formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#E7E7E4] bg-[#F8F8F6]'} text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:border-[#EB5A0D]`}
                    />
                  </div>
                  {formErrors.phone && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Dynamic Co-Trekkers Form Cards */}
              {trekkersList.map((trekker, index) => (
                <div key={index} className="mt-4 p-4 border border-[#E7E7E4] rounded-xl bg-[#F8F8F6] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#EB5A0D]">
                      Trekker #{index + 2} Credentials
                    </h4>
                    <span className="text-[10px] text-[#52524E] bg-white border border-[#E7E7E4] px-2 py-0.5 rounded-md font-medium">
                      Required for Forest Permit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Legal Name *"
                      required
                      value={trekker.fullName}
                      onChange={(e) => updateTrekker(index, "fullName", e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E7E7E4] bg-white text-[#1A1A18] rounded-lg focus:outline-none focus:border-[#EB5A0D]"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Age *"
                        min="10"
                        max="80"
                        required
                        value={trekker.age}
                        onChange={(e) => updateTrekker(index, "age", e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E7E7E4] bg-white text-[#1A1A18] rounded-lg focus:outline-none focus:border-[#EB5A0D]"
                      />
                      <select
                        value={trekker.gender}
                        onChange={(e) => updateTrekker(index, "gender", e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E7E7E4] rounded-lg bg-white text-[#1A1A18] focus:outline-none focus:border-[#EB5A0D]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={trekker.idType}
                        onChange={(e) => updateTrekker(index, "idType", e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E7E7E4] rounded-lg bg-white text-[#1A1A18] focus:outline-none focus:border-[#EB5A0D]"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving Licence">Driving Licence</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                      <input
                        type="text"
                        placeholder="ID Number *"
                        required
                        value={trekker.idNumber}
                        onChange={(e) => updateTrekker(index, "idNumber", e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E7E7E4] bg-white text-[#1A1A18] rounded-lg focus:outline-none focus:border-[#EB5A0D]"
                      />
                    </div>

                    <select
                      value={trekker.healthAssessment}
                      onChange={(e) => updateTrekker(index, "healthAssessment", e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E7E7E4] rounded-lg bg-white text-[#1A1A18] focus:outline-none focus:border-[#EB5A0D]"
                    >
                      <option value="Fit and prepared for high-altitude trek">Fit and prepared for high-altitude trek</option>
                      <option value="Reasonably fit; need basic guidance">Reasonably fit; need basic guidance</option>
                      <option value="Has health concerns to discuss">Has health concerns to discuss</option>
                      <option value="On regular medication">On regular medication</option>
                      <option value="Have special needs / support required">Have special needs / support required</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ))}

              {/* Action Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#EB5A0D] hover:bg-[#D44E08] font-outfit text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Initiating Checkout...</span>
                    </>
                  ) : (
                    <span>SECURE RESERVATION • ₹{totalAmount.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success Screen */
            <div className="py-6 text-center animate-in fade-in duration-300 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                  Payment Confirmed
                </span>
                <h3 className="font-outfit text-xl font-black text-[#1A1A18] mt-0.5">
                  Trek Reserved Successfully!
                </h3>
                <p className="text-xs text-[#52524E] mt-1 font-mono font-bold">
                  Reference: {confirmedBookingId}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F8F6] border border-[#E7E7E4] p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#52524E]">Trek:</span>
                  <span className="font-bold text-[#1A1A18]">{trekTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52524E]">Date:</span>
                  <span className="font-bold text-[#1A1A18]">{formData.selectedDate || 'Upcoming Batch'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52524E]">Trekkers:</span>
                  <span className="font-bold text-[#1A1A18]">{trekkers} {trekkers === 1 ? 'Person' : 'Persons'}</span>
                </div>

                {trekkersList.length > 0 && (
                  <div className="pt-2 border-t border-[#E7E7E4]/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#52524E] block">
                      Registered Roster:
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-[#52524E]">
                      <span>1. {formData.name || leadProfile.fullName || 'Lead Trekker'} (Lead)</span>
                      <span className="font-mono text-[10px] text-[#1A1A18] font-medium">Permit Verified</span>
                    </div>
                    {trekkersList.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-[#52524E]">
                        <span>{idx + 2}. {t.fullName || `Trekker #${idx + 2}`}</span>
                        <span className="font-mono text-[10px] text-[#1A1A18] font-medium">{t.idType}: {t.idNumber}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-[#E7E7E4]">
                  <span className="text-[#52524E]">Amount Paid:</span>
                  <span className="font-bold text-[#EB5A0D]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#52524E] bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 leading-relaxed text-left">
                📢 <span className="font-bold text-emerald-900">Next Steps:</span> A confirmation summary and forest permit pass details have been dispatched to your registered email and WhatsApp. Our mountaineering crew will contact you shortly.
              </div>

              {/* WhatsApp Confirmation & Ticket Button */}
              <a
                href={`https://wa.me/91${(() => {
                  const raw = (formData.phone || '').replace(/\D/g, '');
                  if (raw.startsWith('91') && raw.length === 12) return raw.slice(2);
                  return raw;
                })()}?text=${encodeURIComponent(
                  `🏔️ *BOOTpaths Expeditions — Booking Confirmation*\n\n` +
                  `Hello ${formData.name || currentUser?.displayName || 'Trekker'},\n` +
                  `Your reservation for *${trekTitle}* is confirmed!\n\n` +
                  `• *Booking ID:* ${confirmedBookingId}\n` +
                  `• *Batch Date:* ${formData.selectedDate || 'Upcoming Batch'}\n` +
                  `• *Trekkers:* ${trekkers}\n` +
                  `• *Amount Paid:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
                  `• *Status:* CONFIRMED\n\n` +
                  `A receipt has also been dispatched to your email. See you on the trail!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>💬</span> Get Confirmation Ticket on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full flex h-11 items-center justify-center rounded-xl bg-[#1A1A18] hover:bg-[#3E2723] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CLOSE &amp; BACK TO SITE
              </button>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-[#F8F8F6] px-6 py-2.5 border-t border-[#E7E7E4] flex items-center justify-center gap-2 text-[10px] text-[#52524E] font-medium shrink-0">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span>256-bit Encrypted Banking &amp; UPI via Razorpay Secure</span>
        </div>

      </div>
    </div>
  );
}
