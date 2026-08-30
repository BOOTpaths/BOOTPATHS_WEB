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
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sticky Column (lg:col-span-2 - Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-2 sticky top-32 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C1571F] font-bold block mb-1">
              Category
            </span>
            <span className="text-xs font-bold text-[#52524E] bg-white border border-[#E7E7E4] px-3 py-1.5 rounded-lg inline-block shadow-sm">
              {blog.category || 'Trail Guide'}
            </span>
          </div>

          <div className="pt-4 border-t border-[#E7E7E4]">
            <span className="text-[10px] uppercase tracking-widest text-[#52524E]/70 font-bold block mb-3">
              Share this story
            </span>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="h-10 w-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm cursor-pointer"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="h-10 w-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm cursor-pointer"
                title="Share on Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="h-10 w-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all shadow-sm cursor-pointer"
                title="Share on X"
              >
                <TwitterIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleShare('instagram')}
                className="h-10 w-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#E1306C] hover:border-[#E1306C] transition-all shadow-sm cursor-pointer"
                title="Share on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={handleCopyLink}
                className="h-10 w-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm cursor-pointer"
                title="Copy Link"
              >
                <Link2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Center Main Editorial Column (lg:col-span-7) */}
        <main className="lg:col-span-7 bg-white border border-[#E7E7E4] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Breadcrumb navigation */}
          <nav className="text-[10px] sm:text-xs uppercase tracking-wider text-[#52524E]/70 font-semibold mb-6 flex flex-wrap items-center gap-1.5 border-b border-[#E7E7E4]/50 pb-4">
            <a 
              href="#blogs" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#C1571F] transition-colors"
            >
              Home
            </a>
            <span>»</span>
            <a 
              href="#blogs" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#C1571F] transition-colors"
            >
              Blogs
            </a>
            <span>»</span>
            <span className="text-[#C1571F] font-bold">{blog.category || 'Trail Guide'}</span>
          </nav>

          {/* Article Header */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A18] tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Byline Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E7E7E4]/60 mb-6 bg-[#F8F8F6]/50 px-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#C1571F]/10 border border-[#C1571F]/20 text-[#C1571F] flex items-center justify-center font-bold text-sm uppercase">
                {blog.author ? blog.author.substring(0, 2) : 'BP'}
              </div>
              <div>
                <div className="text-xs font-bold text-[#1A1A18]">
                  By {blog.author || 'BOOTpaths Lead'}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-[#52524E]/80 font-bold mt-0.5">
                  {blog.authorBadge || 'Trek Lead'} • {formatDate(blog.date)}
                </div>
              </div>
            </div>

            {/* Mobile & Sidebar Secondary Share Icon list */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#52524E]/60 mr-1.5 lg:hidden">Share:</span>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm cursor-pointer lg:hidden"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="h-8 w-8 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm cursor-pointer"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
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

          {/* Featured Hero Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#E7E7E4] shadow-sm mb-8 bg-[#F8F8F6]">
            <img 
              src={blog.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Rich Editorial Body Content */}
          <div className="text-base sm:text-lg leading-relaxed text-[#334155] space-y-6 font-normal font-outfit border-b border-[#E7E7E4] pb-10">
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

          {/* Bottom Back Button */}
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

        {/* Right Sticky Sidebar (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-8 sticky top-32">
          
          {/* Author Bio Card */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] uppercase tracking-widest text-[#52524E]/70 font-bold mb-4 pb-2 border-b border-[#E7E7E4]/60">
              About the Author
            </h4>
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-[#E3A21E]/10 border border-[#E3A21E]/30 text-[#E3A21E] flex items-center justify-center font-bold text-base shrink-0">
                {blog.author ? blog.author.substring(0, 1) : 'B'}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#1A1A18] leading-tight">
                  {blog.author || 'BOOTpaths Explorer'}
                </h5>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E3A21E] block mt-0.5">
                  {blog.authorBadge || 'Trek Lead'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#52524E] leading-relaxed mt-4 pt-3 border-t border-[#E7E7E4]/50">
              {blog.author === 'Sreelesh' || blog.author?.includes('Sreelesh')
                ? "Sreelesh is a lead mountaineer, explorer, and wilderness first-aid certified expedition coordinator at BOOTpaths."
                : `${blog.author || 'Our team member'} is a certified wilderness first-aid guide and dedicated trek leader with years of trail experience across the Himalayas and Western Ghats.`}
            </p>
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
