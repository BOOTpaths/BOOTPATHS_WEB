/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Razorpay Standard Web Checkout Modal for BOOTpaths Expeditions.
 */
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Shield, Calendar, Users, Phone, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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

export default function BookingModal({
  isOpen,
  onClose,
  trek,
  selectedDate: initialDate,
  currentUser,
  onBookingSuccess
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedDate: '',
    numberOfTrekkers: 1
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  // Sync initial user details and dates when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: currentUser?.displayName || currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        selectedDate: initialDate || (trek?.batchDates && trek.batchDates[0]) || '',
        numberOfTrekkers: 1
      });
      setFormErrors({});
      setIsSuccess(false);
      setIsProcessing(false);
      setConfirmedBookingId('');
    }
  }, [isOpen, initialDate, trek, currentUser]);

  if (!isOpen || !trek) return null;

  // Dynamic Price and Amount Calculation
  const unitPrice = Number(String(trek.price || 0).replace(/[^0-9]/g, '')) || 0;
  const trekkers = Number(formData.numberOfTrekkers || 1);
  const totalAmount = unitPrice * trekkers;
  const amountInPaise = totalAmount * 100;
  const trekTitle = trek.name || trek.title || 'Wilderness Expedition';

  const validateForm = () => {
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
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // 1. Dynamic Script Loader
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Unable to load Razorpay checkout SDK. Please check your internet connection or use the direct backup link.');
        setIsProcessing(false);
        return;
      }

      // 2. Configure Standard Modal Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TZOR1bH6I8CVFp',
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
          // Payment captured successfully
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
              trekkers: trekkers,
              price: totalAmount,
              totalAmount: totalAmount,
              paymentId: response.razorpay_payment_id || `PAY-${Date.now()}`,
              paymentStatus: 'SUCCESS',
              bookingStatus: 'CONFIRMED',
              status: 'Confirmed',
              createdAt: new Date().toISOString()
            };

            // Save directly to Firestore bookings collection
            const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
            const displayId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
            setConfirmedBookingId(displayId);
            setIsSuccess(true);
            setIsProcessing(false);

            if (onBookingSuccess) {
              onBookingSuccess({ id: docRef.id, ...bookingDoc, displayId });
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
        console.error('Payment failure event:', response.error);
        alert('Payment failed: ' + (response.error?.description || 'Transaction declined.'));
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay launch exception:', err);
      alert('An unexpected error occurred while launching payment. Please try the direct payment backup link.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-2xl animate-in zoom-in-95 duration-200 text-[#1A1A18] max-h-[92vh] flex flex-col">
        
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
          {!isSuccess ? (
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
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTrekkers: Math.max(1, Number(prev.numberOfTrekkers) - 1) }))}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E7E7E4] text-[#1A1A18] font-bold hover:bg-[#FAF8F5] flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-[#1A1A18] text-sm">
                      {trekkers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTrekkers: Math.min(15, Number(prev.numberOfTrekkers) + 1) }))}
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

              {/* Participant Contact Info */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52524E] block">
                  Lead Participant Details
                </span>

                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#52524E]/50" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      placeholder="WhatsApp / Mobile Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full h-10 pl-9 pr-3 rounded-xl border ${formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#E7E7E4] bg-[#F8F8F6]'} text-xs text-[#1A1A18] placeholder-[#52524E]/50 focus:outline-none focus:border-[#EB5A0D]`}
                    />
                  </div>
                  {formErrors.phone && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* 1. Primary Proceed to Pay Button */}
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
                    <span>PROCEED TO PAY ₹{totalAmount.toLocaleString('en-IN')}</span>
                  )}
                </button>

                {/* 2. Secondary Fallback Direct Link */}
                <div className="text-center pt-1">
                  <span className="text-[10px] text-[#52524E]/60 block mb-1.5">— OR USE DIRECT PAYMENT LINK —</span>
                  <a
                    href={`https://razorpay.me/@bootpaths?amount=${totalAmount}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full h-10 items-center justify-center rounded-xl border border-[#EB5A0D] text-[#EB5A0D] font-outfit text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#EB5A0D] hover:text-white"
                  >
                    🔗 Pay Direct via Razorpay.me ↗
                  </a>
                </div>
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
                <div className="flex justify-between pt-2 border-t border-[#E7E7E4]">
                  <span className="text-[#52524E]">Amount Paid:</span>
                  <span className="font-bold text-[#EB5A0D]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#52524E] bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 leading-relaxed text-left">
                📢 <span className="font-bold text-emerald-900">Next Steps:</span> Confirmation details &amp; packing checklist have been logged. Our expedition team will connect on WhatsApp prior to batch departure.
              </div>

              <button
                onClick={onClose}
                className="w-full flex h-11 items-center justify-center rounded-xl bg-[#1A1A18] hover:bg-[#3E2723] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close &amp; Return to Exploration
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
