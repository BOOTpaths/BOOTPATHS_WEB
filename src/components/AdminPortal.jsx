/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 * Zero-Billing Dual-Mode Banner Management Component
 */
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Upload, Image as ImageIcon, Link as LinkIcon, Check, RefreshCw, Trash2, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminPortal({ onReturnToSite }) {
  const [bannerUrl, setBannerUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bootpaths_hero_banner') || '';
    }
    return '';
  });
  const [inputUrl, setInputUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Subscribe to real-time hero banner changes from Firestore app_settings/hero_banner
  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('bootpaths_hero_banner') : null;
    if (cached) setBannerUrl(cached);

    const unsub = onSnapshot(doc(db, 'app_settings', 'hero_banner'), (snap) => {
      if (snap.exists() && snap.data()?.imageUrl) {
        const url = snap.data().imageUrl;
        setBannerUrl(url);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bootpaths_hero_banner', url);
        }
      }
    }, (err) => {
      console.warn('Hero banner snapshot notice:', err);
    });

    return () => unsub();
  }, []);

  const saveBanner = async (url) => {
    if (!url) return;
    try {
      setSaving(true);
      setStatusMessage({ type: 'info', text: 'Saving banner to Firestore (Zero Billing Mode)...' });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('bootpaths_hero_banner', url);
      }

      await setDoc(doc(db, 'app_settings', 'hero_banner'), {
        imageUrl: url,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin@bootpaths.com',
        mode: url.startsWith('data:') ? 'base64_canvas_compressed' : 'direct_url'
      }, { merge: true });

      setBannerUrl(url);
      setStatusMessage({ type: 'success', text: 'Hero banner updated successfully!' });
    } catch (err) {
      console.error('Failed to save banner:', err);
      setStatusMessage({ type: 'error', text: `Failed to save banner: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleApplyUrl = async (e) => {
    e?.preventDefault();
    if (!inputUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid image URL.' });
      return;
    }
    const cleanUrl = inputUrl.trim();
    await saveBanner(cleanUrl);
    setInputUrl('');
  };

  const handleFileUpload = (e) => {
    const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select an image file (JPG, PNG, WebP).' });
      return;
    }

    setStatusMessage({ type: 'info', text: 'Optimizing and compressing image via HTML5 Canvas...' });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        // Resize & compress to prevent exceeding Firestore doc limit (max 1MB)
        const canvas = document.createElement('canvas');
        const maxWidth = 1920;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);

        // Update local state and save to Firestore
        setBannerUrl(compressedDataUrl);
        await saveBanner(compressedDataUrl);
      };
      img.onerror = () => {
        setStatusMessage({ type: 'error', text: 'Failed to process image file.' });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = async () => {
    if (!window.confirm('Reset hero banner to default system background?')) return;
    try {
      setSaving(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bootpaths_hero_banner');
      }
      await setDoc(doc(db, 'app_settings', 'hero_banner'), {
        imageUrl: '',
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin@bootpaths.com'
      }, { merge: true });
      setBannerUrl('');
      setStatusMessage({ type: 'success', text: 'Reset banner to default system media.' });
    } catch (err) {
      console.error('Reset banner error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#FFFFFF] border border-[#E7E7E4] rounded-3xl shadow-sm text-autumn-bark font-sans space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E7E4] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
            <Sparkles className="h-3 w-3" />
            <span>Zero-Billing Dual-Mode Storage Active</span>
          </div>
          <h2 className="font-outfit text-2xl font-black text-autumn-bark">
            Hero Banner Management
          </h2>
          <p className="text-xs text-autumn-bark/70 mt-1">
            Update main site hero background using direct URL links or client-side compressed local file upload (bypasses Firebase Cloud Storage billing).
          </p>
        </div>

        {onReturnToSite && (
          <button 
            onClick={onReturnToSite}
            className="h-9 px-4 rounded-xl border border-autumn-bark/20 hover:bg-[#F8F8F6] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Main Site</span>
          </button>
        )}
      </div>

      {/* Status Notifications */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition-all ${
          statusMessage.type === 'error' 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-700' 
            : statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-bold'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-900 font-semibold'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : statusMessage.type === 'success' ? (
            <Check className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <RefreshCw className="h-5 w-5 shrink-0 animate-spin text-amber-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Current Hero Banner Live Preview */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-autumn-bark/60">
          Live Banner Preview
        </label>
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#E7E7E4] bg-stone-900 shadow-inner group">
          {bannerUrl ? (
            <>
              <img 
                src={bannerUrl} 
                alt="Current Hero Banner Preview" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg w-fit border border-white/20">
                  {bannerUrl.startsWith('data:') ? 'Local Base64 Compressed' : 'External Direct URL'}
                </span>
              </div>
              <button 
                onClick={handleResetDefault}
                className="absolute top-4 right-4 h-9 px-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                title="Reset to Default"
              >
                <Trash2 className="h-4 w-4" />
                <span>Reset Banner</span>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
              <ImageIcon className="h-12 w-12 text-stone-500 mb-2 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider">Default Media Mode Active</p>
              <p className="text-[10px] text-stone-500 mt-1 max-w-sm">No custom hero image set in Firestore. Default video/image rotation is active.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dual Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Method 1: Direct Image URL Field */}
        <div className="p-5 rounded-2xl border border-[#E7E7E4] bg-[#F8F8F6] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-autumn-bark font-bold text-sm">
              <LinkIcon className="h-4 w-4 text-[#C1571F]" />
              <span>Method 1: Direct Image URL</span>
            </div>
            <p className="text-xs text-autumn-bark/60 mt-1">
              Paste link from Unsplash, Imgur, Cloudinary, or GitHub raw repository.
            </p>
          </div>

          <form onSubmit={handleApplyUrl} className="space-y-3">
            <input 
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full h-11 px-4 rounded-xl border border-[#E7E7E4] bg-white text-xs text-autumn-bark placeholder-autumn-bark/40 focus:outline-none focus:ring-1 focus:ring-[#C1571F] focus:border-[#C1571F] transition-all"
            />
            <button
              type="submit"
              disabled={saving || !inputUrl.trim()}
              className="w-full h-11 rounded-xl bg-[#C1571F] hover:bg-[#A84310] font-outfit text-xs font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>Apply URL</span>
            </button>
          </form>
        </div>

        {/* Method 2: Local File Upload (Canvas Base64) */}
        <div className="p-5 rounded-2xl border border-[#E7E7E4] bg-[#F8F8F6] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-autumn-bark font-bold text-sm">
              <Upload className="h-4 w-4 text-[#C1571F]" />
              <span>Method 2: Upload from PC (JPG/PNG)</span>
            </div>
            <p className="text-xs text-autumn-bark/60 mt-1">
              Automatically optimizes &amp; converts image to Base64 (bypasses Firebase Storage).
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileUpload(e);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragOver 
                ? 'border-[#C1571F] bg-orange-50/50 scale-[0.99]' 
                : 'border-[#E7E7E4] bg-white hover:border-[#C1571F]/60'
            }`}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <Upload className="h-6 w-6 text-[#C1571F]" />
            <span className="text-xs font-bold text-autumn-bark uppercase tracking-wider">
              {saving ? 'Processing Image...' : 'Click or Drag Image Here'}
            </span>
            <span className="text-[10px] text-autumn-bark/50">Auto-compressed JPG/PNG &lt; 1MB</span>
          </div>
        </div>

      </div>

    </div>
  );
}
