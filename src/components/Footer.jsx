/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Universal Footer Component for BOOTpaths.
 */
import React from 'react';

const Youtube = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Facebook = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer({ onOpenPolicy, isCareersEnabled = true }) {
  return (
    <footer className="border-t border-autumn-bark/10 bg-autumn-mist py-16 px-6 md:px-12 text-autumn-bark/70 text-xs">
      <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-6">
          <a href="#" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="BOOTpaths" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>
          <p className="text-xs text-autumn-bark/50 leading-relaxed max-w-sm">
            We guide adventurers to unexplored peaks and premium trails across Western Ghats, The Himalayan and International treks and Expeditions. Fully vetted batches, certified mountain leads, and environment first.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a 
              href="https://www.instagram.com/bootpaths/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.youtube.com/@BOOTpaths2025" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a 
              href="https://www.facebook.com/share/19rS7r9DJZ/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Links 1 */}
        <div className="space-y-4">
          <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Popular Trails</h4>
          <ul className="space-y-2.5 text-autumn-bark/50">
            <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Netravathi Peak Trek</a></li>
            <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Brahmagiri Coorg Trek</a></li>
            <li><a href="#upcoming-treks" className="hover:text-autumn-maple transition-colors">Vellagavi Village Trek</a></li>
          </ul>
        </div>

        {/* Links 2 */}
        <div className="space-y-4">
          <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Company Info</h4>
          <ul className="space-y-2.5 text-autumn-bark/50">
            <li><a href="#advantage" className="hover:text-autumn-maple transition-colors">Our Crew & Advantage</a></li>
            <li><a href="#community" className="hover:text-autumn-maple transition-colors">Community Stories</a></li>
            {isCareersEnabled && (
              <li><a href="#careers" className="hover:text-autumn-maple transition-colors">Careers for Leads</a></li>
            )}
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-autumn-bark/80">Get in Touch</h4>
          <ul className="space-y-2.5 text-autumn-bark/50">
            <li>Email: <a href="mailto:lead@bootpaths.com" className="hover:text-autumn-maple transition-colors">lead@bootpaths.com</a></li>
            <li>WhatsApp Support: <a href="https://wa.me/918848998470" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 8848998470</a></li>
            <li>WhatsApp Support: <a href="https://wa.me/919895452187" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 9895452187</a></li>
            <li>WhatsApp Support: <a href="https://wa.me/919446102200" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">+91 9446102200</a></li>
            <li>Instagram DM: <a href="https://www.instagram.com/bootpaths/" target="_blank" rel="noreferrer" className="hover:text-autumn-maple transition-colors">@bootpaths</a></li>
          </ul>
        </div>

      </div>

      <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-autumn-bark/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs text-autumn-bark/40">
        <div>
          &copy; {new Date().getFullYear()} BOOTpaths Adventure Labs. All rights reserved.
        </div>
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => onOpenPolicy ? onOpenPolicy('terms') : null}
            className="hover:text-autumn-bark/70 cursor-pointer bg-transparent border-none p-0 text-xxs font-medium"
          >
            Terms of Service
          </button>
          <button 
            type="button" 
            onClick={() => onOpenPolicy ? onOpenPolicy('privacy') : null}
            className="hover:text-autumn-bark/70 cursor-pointer bg-transparent border-none p-0 text-xxs font-medium"
          >
            Privacy Policy
          </button>
          <button 
            type="button" 
            onClick={() => onOpenPolicy ? onOpenPolicy('refund') : null}
            className="hover:text-autumn-bark/70 cursor-pointer bg-transparent border-none p-0 text-xxs font-medium"
          >
            Cancellation &amp; Refund Policy
          </button>
        </div>
      </div>
    </footer>
  );
}
