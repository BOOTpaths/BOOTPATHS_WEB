import { useState } from 'react';
import { BookOpen, X, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function BlogSection({ blogs, onAddBlog, user, onOpenAuth }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Trail Stories');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filter published blogs for public view
  const publishedBlogs = blogs.filter(b => b.status === 'published');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleShareStoryClick = () => {
    if (!user) {
      onOpenAuth({ type: 'share_story' });
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) return setFormError('Article title is required.');
    if (!formCoverUrl.trim() || !formCoverUrl.startsWith('http')) {
      return setFormError('Please enter a valid cover photo URL starting with http/https.');
    }
    if (formContent.trim().length < 50) {
      return setFormError('Story content must be at least 50 characters.');
    }

    const newBlog = {
      id: `blog-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      coverUrl: formCoverUrl,
      author: user?.name || 'Guest Hiker',
      authorBadge: 'Community Hiker',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      content: formContent
    };

    onAddBlog(newBlog);
    setIsSubmitModalOpen(false);

    // Reset form
    setFormTitle('');
    setFormCategory('Trail Stories');
    setFormCoverUrl('');
    setFormContent('');

    showToast('Story submitted! Our team will review and publish it shortly.');
  };

  return (
    <section id="blog" className="relative bg-[#3A2A1E] py-24 px-6 md:px-12 text-[#F3ECDD] overflow-hidden">
      
      {/* Background Subtle Gradient Blobs for Ecotourism Depth */}
      <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#C1571F]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 h-[300px] w-[300px] rounded-full bg-[#E3A21E]/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C1571F]/20 pb-8 mb-16">
          <div>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#E3A21E]">
              Community Voices
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-[#F3ECDD] sm:text-4xl md:text-5xl">
              Tales from the Trail
            </h2>
            <p className="mt-4 max-w-xl text-sm text-[#F3ECDD]/70">
              Read organic stories, gear checklists, and mountaineering guides written by our certified crew and community explorers.
            </p>
          </div>

          <div>
            <button
              onClick={handleShareStoryClick}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#C1571F] hover:bg-[#a44717] text-white px-6 font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(193,87,31,0.25)] hover:shadow-[0_4px_25px_rgba(193,87,31,0.4)]"
            >
              <BookOpen className="h-4 w-4" />
              Share Your Story
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {publishedBlogs.length === 0 ? (
          <div className="text-center py-16 backdrop-blur-xl bg-[#3A2A1E]/40 border border-[#C1571F]/10 rounded-2xl">
            <p className="text-[#F3ECDD]/60">No published articles yet. Be the first to share your story!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publishedBlogs.map((post) => (
              <article 
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#C1571F]/20 bg-[#3A2A1E]/80 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-[#C1571F]/50 hover:shadow-2xl flex-1"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                  <img 
                    src={post.coverUrl} 
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-[#C1571F] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Meta Header */}
                    <div className="flex items-center gap-2 text-xxs uppercase tracking-wider text-[#F3ECDD]/50">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="text-[#E3A21E] font-bold px-1.5 py-0.5 rounded bg-[#E3A21E]/10 border border-[#E3A21E]/20">
                        {post.authorBadge}
                      </span>
                    </div>

                    <h3 className="mt-3 font-outfit text-lg font-bold leading-snug text-[#F3ECDD] group-hover:text-[#E3A21E] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-xs text-[#F3ECDD]/75 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#C1571F]/10 flex items-center justify-between">
                    <span className="text-xxs text-[#F3ECDD]/60 font-semibold">By {post.author}</span>
                    <button
                      onClick={() => setSelectedBlog(post)}
                      className="inline-flex items-center gap-1.5 font-outfit text-xxs font-bold uppercase tracking-wider text-[#C1571F] group-hover:text-[#E3A21E] transition-colors"
                    >
                      Read Full Story <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* ARTICLE SLIDE-OVER READER MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#C1571F]/30 bg-[#3A2A1E] text-[#F3ECDD] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Cover Header */}
            <div className="relative h-64 shrink-0">
              <img 
                src={selectedBlog.coverUrl} 
                alt={selectedBlog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2A1E] via-[#3A2A1E]/40 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block rounded-full bg-[#C1571F] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md mb-2">
                  {selectedBlog.category}
                </span>
                <h3 className="font-outfit text-xl sm:text-2xl font-black leading-tight text-[#F3ECDD] drop-shadow-md">
                  {selectedBlog.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed text-[#F3ECDD]/90">
              <div className="flex items-center gap-3 border-b border-[#C1571F]/10 pb-4 mb-4">
                <div className="h-9 w-9 rounded-full bg-[#E3A21E]/10 flex items-center justify-center border border-[#E3A21E]/30 text-[#E3A21E]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F3ECDD]">{selectedBlog.author}</div>
                  <div className="text-[10px] uppercase font-semibold text-[#E3A21E]/80 tracking-wider">
                    {selectedBlog.authorBadge} • Published {selectedBlog.date}
                  </div>
                </div>
              </div>

              <div className="whitespace-pre-line space-y-4">
                {selectedBlog.content}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#3A2A1E]/80 px-6 py-4 border-t border-[#C1571F]/10 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="h-10 px-6 rounded-lg bg-[#C1571F] hover:bg-[#a44717] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STORY SUBMISSION FORM MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#C1571F]/30 bg-[#3A2A1E] text-[#F3ECDD] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-[#2A1D14] p-5 flex justify-between items-center border-b border-[#C1571F]/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#C1571F]/10 flex items-center justify-center text-[#C1571F] border border-[#C1571F]/20">
                  <BookOpen className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-[#F3ECDD]">
                    Share Your Trail Story
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#E3A21E] font-semibold">
                    Submit Article for Moderation
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#F3ECDD]/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formError && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Article Title</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., A Scenic Escape to Silent Valley"
                  className="h-11 rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 px-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Category Select</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-11 rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 px-4 text-sm text-[#F3ECDD] outline-none focus:border-[#C1571F]/60 transition-colors cursor-pointer"
                >
                  <option value="Trail Stories">Trail Stories</option>
                  <option value="Gear & Packing">Gear & Packing</option>
                  <option value="Safety First">Safety First</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Cover Photo URL</label>
                <input 
                  type="text" 
                  value={formCoverUrl}
                  onChange={(e) => setFormCoverUrl(e.target.value)}
                  placeholder="Paste high-res Unsplash image URL..."
                  className="h-11 rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 px-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#F3ECDD]/60">Your Story Content</label>
                <textarea 
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Share details on base camps, trail features, packing checks, and overall vibes..."
                  rows="6"
                  className="rounded-lg border border-[#C1571F]/20 bg-[#2A1D14]/85 p-4 text-sm text-[#F3ECDD] placeholder-[#F3ECDD]/30 outline-none focus:border-[#C1571F]/60 transition-colors resize-none"
                />
              </div>

              <button type="submit" className="hidden" />
            </form>

            {/* Footer */}
            <div className="bg-[#2A1D14] p-5 border-t border-[#C1571F]/10 flex gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 text-[#F3ECDD]/80 font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel Submission
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg bg-[#C1571F] hover:bg-[#a44717] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                Submit Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#C1571F]/40 bg-[#3A2A1E] p-4 text-sm font-semibold text-[#F3ECDD] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle className="h-5 w-5 text-[#E3A21E] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
}
