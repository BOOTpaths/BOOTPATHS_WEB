/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { ArrowLeft, Link2 } from 'lucide-react';

// Custom Social SVG Icons
const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.006c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

export default function BlogReader({ blog, onBack }) {
  if (!blog) return null;

  const shareUrl = window.location.href;
  const shareTitle = blog.title;

  const handleShare = (platform) => {
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(shareUrl);
      alert('Instagram does not support direct link sharing. The link has been copied to your clipboard. You can paste it in your story or bio!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Article link copied to clipboard!');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  const paragraphs = blog.content ? blog.content.split('\n\n').filter(p => p.trim()) : [];

  return (
    <div className="bg-[#F8F8F6] text-[#1A1A18] font-outfit min-h-screen">
      
      {/* 1. Hero Header Banner (Top Full-Bleed Section) */}
      <div className="w-full relative bg-[#E7E7E4]">
        <img 
          src={blog.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'} 
          alt={blog.title}
          className="w-full h-[450px] md:h-[550px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-stone-900/20 pointer-events-none"></div>
      </div>

      {/* 2. Editorial Content Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
        
        {/* 5. Top Left Floating Share Pill (Desktop Only) */}
        <div className="hidden lg:flex flex-col items-center gap-3 absolute -left-16 top-16 sticky top-48 z-10">
          <span className="text-[9px] uppercase tracking-widest text-[#52524E]/60 font-bold block [writing-mode:vertical-lr] select-none mb-1">
            SHARE
          </span>
          <button 
            onClick={() => handleShare('whatsapp')}
            className="h-9 w-9 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm cursor-pointer"
            title="Share on WhatsApp"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            className="h-9 w-9 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm cursor-pointer"
            title="Share on Facebook"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => handleShare('twitter')}
            className="h-9 w-9 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all shadow-sm cursor-pointer"
            title="Share on X"
          >
            <TwitterIcon className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={handleCopyLink}
            className="h-9 w-9 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm cursor-pointer"
            title="Copy Link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 3. Left / Center Column (lg:col-span-8) */}
        <main className="lg:col-span-8 bg-white border border-[#E7E7E4] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm relative">
          
          {/* Category Breadcrumb */}
          <nav className="text-sm text-[#52524E] mb-4 flex flex-wrap items-center gap-1.5 font-medium">
            <a 
              href="#blogs" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#C1571F] transition-colors"
            >
              Category
            </a>
            <span>»</span>
            <a 
              href="#blogs" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#C1571F] transition-colors"
            >
              Trek Insights & Experiences
            </a>
            <span>»</span>
            <span className="text-[#C1571F] font-semibold">{blog.category || 'Trail Guide'}</span>
          </nav>

          {/* Article Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A18] tracking-tight leading-tight mb-5 font-outfit">
            {blog.title}
          </h1>

          {/* Author & Date Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E7E7E4]/60 mb-6 bg-[#F8F8F6]/50 px-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-[#52524E] font-medium">
              <span>By <strong className="text-[#1A1A18] font-bold">{blog.author || 'BOOTpaths Lead'}</strong></span>
              <span className="text-[#E7E7E4]">•</span>
              <span>{formatDate(blog.date)}</span>
            </div>

            {/* Inline Share Icons beside the author name */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm cursor-pointer"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm cursor-pointer"
                title="Share on Facebook"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all shadow-sm cursor-pointer"
                title="Share on X"
              >
                <TwitterIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={handleCopyLink}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm cursor-pointer"
                title="Copy Link"
              >
                <Link2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Article Content Body */}
          <div className="text-[#334155] text-lg leading-relaxed space-y-6 font-normal font-outfit border-b border-[#E7E7E4] pb-10">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p key={idx} className="whitespace-pre-wrap">
                  {para}
                </p>
              ))
            ) : (
              <p>{blog.content}</p>
            )}
          </div>

          {/* Bottom Back Action */}
          <div className="mt-8 pt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C1571F] hover:text-[#A84310] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all stories
            </button>
          </div>
        </main>

        {/* 4. Right Sidebar (lg:col-span-4 sticky top-36) */}
        <aside className="lg:col-span-4 space-y-8 sticky top-36">
          
          {/* Author Profile Card */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            
            {/* Large circular author photo / avatar badge */}
            <div className="h-20 w-20 rounded-full bg-[#E3A21E]/10 border border-[#E3A21E]/30 text-[#E3A21E] flex items-center justify-center font-bold text-2xl uppercase mb-3 shadow-inner">
              {blog.author ? blog.author.substring(0, 1) : 'B'}
            </div>

            {/* Bold author name below the photo */}
            <h5 className="font-bold text-[#1A1A18] text-base leading-tight">
              {blog.author || 'BOOTpaths Explorer'}
            </h5>
            
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#E3A21E] block mt-1">
              {blog.authorBadge || 'Trek Lead'}
            </span>

            {/* About the author box */}
            <div className="w-full text-xs text-[#52524E] leading-relaxed mt-4 pt-4 border-t border-[#E7E7E4]/50">
              <p>
                {blog.author === 'Sreelesh' || blog.author?.includes('Sreelesh')
                  ? "Sreelesh is a lead mountaineer, explorer, and wilderness first-aid certified expedition coordinator at BOOTpaths."
                  : `${blog.author || 'Our team member'} is a certified wilderness first-aid guide and dedicated trek leader with years of trail experience across the Himalayas and Western Ghats.`}
              </p>
            </div>
          </div>

          {/* Upcoming Treks Widget */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] uppercase tracking-widest text-[#52524E]/70 font-bold mb-4 pb-2 border-b border-[#E7E7E4]/60">
              Upcoming Expeditions
            </h4>
            <div className="space-y-4">
              {/* Trek 1: Netravathi */}
              <div className="group rounded-xl border border-[#E7E7E4] overflow-hidden bg-[#F8F8F6] p-3 flex flex-col gap-2.5 hover:border-[#C1571F]/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" 
                  alt="Netravathi Peak"
                  className="h-24 w-full object-cover rounded-lg"
                />
                <div>
                  <span className="inline-block rounded-full bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                    Filling Fast
                  </span>
                  <h5 className="text-xs font-bold text-[#1A1A18] leading-snug group-hover:text-[#C1571F] transition-colors">
                    Netravathi Peak Weekend Trek
                  </h5>
                  <span className="text-[10px] text-[#52524E] block mt-0.5">2 Days • Western Ghats</span>
                </div>
                <a 
                  href="#upcoming-treks"
                  className="h-8 w-full rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  View Trek
                </a>
              </div>

              {/* Trek 2: Brahmagiri */}
              <div className="group rounded-xl border border-[#E7E7E4] overflow-hidden bg-[#F8F8F6] p-3 flex flex-col gap-2.5 hover:border-[#C1571F]/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80" 
                  alt="Brahmagiri Coorg"
                  className="h-24 w-full object-cover rounded-lg"
                />
                <div>
                  <span className="inline-block rounded-full bg-[#E3A21E]/10 border border-[#E3A21E]/35 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#C1571F] mb-1">
                    Limited Slots
                  </span>
                  <h5 className="text-xs font-bold text-[#1A1A18] leading-snug group-hover:text-[#C1571F] transition-colors">
                    Brahmagiri Coorg Expedition
                  </h5>
                  <span className="text-[10px] text-[#52524E] block mt-0.5">2 Days • Western Ghats</span>
                </div>
                <a 
                  href="#upcoming-treks"
                  className="h-8 w-full rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  View Trek
                </a>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
