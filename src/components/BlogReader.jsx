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

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56V14.9c0-1.32-.03-3.01-1.84-3.01-1.84 0-2.12 1.43-2.12 2.91v5.65h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
  </svg>
);

export default function BlogReader({ blog, onBack, allBlogs = [], onSelectBlog }) {
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
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
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

  // Filter other blogs from the same category for the Multi-Post Story Stream
  const relatedBlogs = allBlogs.filter(b => b.category === blog.category && b.id !== blog.id);

  return (
    <div className="bg-[#F8F8F6] text-[#1A1A18] font-outfit min-h-screen">
      
      {/* 1. Top Panoramic Hero Banner (Full-Bleed) */}
      <div className="w-full h-[320px] md:h-[440px] overflow-hidden">
        <img 
          src={blog.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'} 
          className="w-full h-full object-cover" 
          alt="Blog Topic Hero" 
        />
      </div>

      {/* 2. Main 3-Column Editorial Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* 3. Left Sidebar Column (lg:col-span-2 hidden lg:block sticky top-36) */}
        <aside className="hidden lg:block lg:col-span-2 sticky top-36 space-y-6">
          <div>
            <span className="text-xs font-black uppercase text-[#1A1A18] border-b-2 border-[#C1571F] pb-1 block">
              Blogs about {blog.category || 'Trail Insights'}
            </span>
          </div>

          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-widest text-[#52524E]/70 font-bold block mb-3">
              Share this story
            </span>
            <div className="flex flex-col gap-2">
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
                onClick={() => handleShare('linkedin')}
                className="h-9 w-9 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-all shadow-sm cursor-pointer"
                title="Share on LinkedIn"
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
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
          </div>
        </aside>

        {/* 4. Center Editorial Column (lg:col-span-7 space-y-12) */}
        <main className="lg:col-span-7 space-y-12">
          
          {/* Main Header Card container */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Breadcrumbs */}
            <nav className="text-xs text-[#64748B] mb-3 flex flex-wrap items-center gap-1.5 font-medium">
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

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black text-[#1A1A18] tracking-tight leading-tight mb-4 font-serif">
              {blog.title}
            </h1>

            {/* Author Byline & Inline Social Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E7E7E4]/60 mb-6 bg-[#F8F8F6]/50 px-4 rounded-xl">
              <div className="text-xs text-[#52524E] font-semibold">
                By <strong className="text-[#1A1A18] font-bold">{blog.author || 'BOOTpaths Lead'}</strong> • {formatDate(blog.date)}
              </div>

              {/* Inline Social Share */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="h-7 w-7 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="h-7 w-7 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm cursor-pointer"
                  title="Share on Facebook"
                >
                  <FacebookIcon className="h-3 w-3" />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="h-7 w-7 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#52524E] hover:text-[#C1571F] hover:border-[#C1571F] transition-all shadow-sm cursor-pointer"
                  title="Copy Link"
                >
                  <Link2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Editorial Content paragraphs */}
            <div className="text-[#334155] text-lg leading-relaxed space-y-6 font-normal font-outfit border-b border-[#E7E7E4] pb-8">
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

            {/* Back CTA */}
            <div className="mt-6 flex justify-between items-center">
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
          </div>

          {/* Article Feed / Multi-Post Story Stream Section */}
          {relatedBlogs.length > 0 && (
            <div className="space-y-10 pt-6">
              <h3 className="font-outfit text-xl font-black uppercase text-[#1A1A18] tracking-wide border-b border-[#E7E7E4] pb-3">
                More Stories on {blog.category}
              </h3>
              
              <div className="space-y-12">
                {relatedBlogs.map((post) => {
                  const excerpt = post.content 
                    ? (post.content.length > 180 ? post.content.substring(0, 180) + '...' : post.content)
                    : '';
                  
                  return (
                    <article key={post.id} className="group flex flex-col gap-5 pb-8 border-b border-[#E7E7E4] last:border-b-0">
                      <div>
                        {/* Sub-heading title */}
                        <h4 
                          onClick={() => onSelectBlog(post)}
                          className="text-2xl font-bold text-[#1A1A18] hover:text-[#C1571F] cursor-pointer transition-colors font-serif leading-snug"
                        >
                          {post.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-2 text-xxs uppercase tracking-wider text-[#52524E]/70 font-bold">
                          <span>By {post.author || 'BOOTpaths Lead'}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      {/* Excerpt paragraph */}
                      <p className="text-base text-[#475569] leading-relaxed">
                        {excerpt}
                      </p>

                      {/* Read full blog link */}
                      <div>
                        <button
                          onClick={() => onSelectBlog(post)}
                          className="text-sm font-bold text-[#C1571F] hover:underline hover:text-[#A84310] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          Read full blog ➔
                        </button>
                      </div>

                      {/* Inline scenic photograph with altitude/location caption tags */}
                      <div className="relative rounded-xl overflow-hidden border border-[#E7E7E4] bg-[#F8F8F6]">
                        <img 
                          src={post.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
                          alt={post.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="bg-stone-900/60 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 flex items-center justify-between">
                          <span>Altitude: 3,450 ft</span>
                          <span>Location: {post.category || 'Western Ghats'}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* 5. Right Sidebar Column (lg:col-span-3 space-y-8 sticky top-36) */}
        <aside className="lg:col-span-3 space-y-8 sticky top-36">
          
          {/* Author Profile Card */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 shadow-sm">
            {/* Centered circular author avatar image */}
            <div className="w-20 h-20 rounded-full mx-auto border-2 border-white shadow-md bg-[#E3A21E]/10 border-[#E3A21E]/30 text-[#E3A21E] flex items-center justify-center font-bold text-2xl uppercase overflow-hidden">
              {blog.author ? blog.author.substring(0, 1) : 'B'}
            </div>

            {/* Author Name in bold */}
            <h5 className="text-center font-bold text-base text-[#1A1A18] mt-3">
              {blog.author || 'BOOTpaths Explorer'}
            </h5>
            
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E3A21E] text-center block mt-0.5">
              {blog.authorBadge || 'Trek Lead'}
            </span>

            {/* About the author box */}
            <div className="bg-[#F8F8F6] p-4 rounded-xl text-xs text-[#52524E] leading-relaxed border border-[#E7E7E4] mt-4">
              <p>
                {blog.author === 'Sreelesh' || blog.author?.includes('Sreelesh')
                  ? "Sreelesh is a lead mountaineer, explorer, and wilderness first-aid certified expedition coordinator at BOOTpaths."
                  : `${blog.author || 'Our team member'} is a certified wilderness first-aid guide and dedicated trek leader with years of trail experience across the Himalayas and Western Ghats.`}
              </p>
            </div>
          </div>

          {/* "Upcoming Treks" Sticky List */}
          <div className="bg-white border border-[#E7E7E4] rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h4 className="text-lg font-extrabold text-[#1A1A18] border-b-2 border-[#C1571F] pb-1 inline-block">
                Upcoming Treks
              </h4>
            </div>
            
            <div className="space-y-4">
              {/* Trek 1: Netravathi */}
              <div className="group rounded-xl border border-[#E7E7E4] overflow-hidden bg-[#F8F8F6] p-3 flex flex-col gap-2 hover:border-[#C1571F]/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" 
                  alt="Netravathi Peak"
                  className="h-24 w-full object-cover rounded-lg"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-600">
                      2 Days • Moderate
                    </span>
                    <span className="text-[10px] font-bold text-[#1A1A18]">₹3,450</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#1A1A18] leading-snug group-hover:text-[#C1571F] transition-colors mt-1.5">
                    Netravathi Peak Trek
                  </h5>
                </div>
                <a 
                  href="#upcoming-treks"
                  className="h-8 w-full rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  View Dates
                </a>
              </div>

              {/* Trek 2: Brahmagiri */}
              <div className="group rounded-xl border border-[#E7E7E4] overflow-hidden bg-[#F8F8F6] p-3 flex flex-col gap-2 hover:border-[#C1571F]/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80" 
                  alt="Brahmagiri Coorg"
                  className="h-24 w-full object-cover rounded-lg"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-[#E3A21E]/10 border border-[#E3A21E]/35 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#C1571F]">
                      2 Days • Moderate
                    </span>
                    <span className="text-[10px] font-bold text-[#1A1A18]">₹3,750</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#1A1A18] leading-snug group-hover:text-[#C1571F] transition-colors mt-1.5">
                    Brahmagiri Coorg Trek
                  </h5>
                </div>
                <a 
                  href="#upcoming-treks"
                  className="h-8 w-full rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  View Dates
                </a>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
