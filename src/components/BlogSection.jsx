/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useRef, useEffect } from 'react';
import { BookOpen, X, Sparkles, AlertCircle, CheckCircle, ArrowRight, Upload, Trash2 } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export default function BlogSection({ blogs: propBlogs, onAddBlog, user, onOpenAuth }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Trail Stories');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [formContent, setFormContent] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [liveBlogs, setLiveBlogs] = useState([]);
  
  const fileInputRef = useRef(null);

  // Subscribe to live published blogs from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'blogs'), where('status', '==', 'published'));
      const unsub = onSnapshot(q, (snapshot) => {
        const fetched = [];
        snapshot.forEach(d => {
          fetched.push({ id: d.id, ...d.data() });
        });
        setLiveBlogs(fetched);
      }, (err) => {
        console.warn('Blogs Firestore Notice:', err.message);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Blogs Listener Fallback:', err.message);
    }
  }, []);

  // Filter published blogs for public view
  const publishedBlogs = liveBlogs.filter(b => b.status === 'published');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormCoverImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormCoverImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitStory = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) return setFormError('Story title is required.');
    if (!formCoverImage) return setFormError('Cover image is required.');
    if (formContent.trim().length < 50) {
      return setFormError('Story content must be at least 50 characters.');
    }

    setIsSubmitting(true);

    const newBlog = {
      title: formTitle,
      category: formCategory,
      coverUrl: formCoverImage,
      author: user?.name || 'Guest Hiker',
      authorBadge: 'Community Hiker',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      content: formContent,
      submittedAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'blogs'), newBlog);
      newBlog.id = docRef.id;
    } catch (err) {
      console.warn('Firestore Notice, using fallback ID:', err.message);
      newBlog.id = `blog-${Date.now()}`;
    }

    if (onAddBlog) onAddBlog(newBlog);
    setIsSubmitModalOpen(false);
    setIsSubmitting(false);

    // Reset form
    setFormTitle('');
    setFormCategory('Trail Stories');
    setFormCoverImage('');
    setFormContent('');

    showToast('Story submitted! Our team will review and publish it shortly.');
  };

  return (
    <section id="community" className="scroll-mt-36 relative bg-[#F8F8F6] py-24 px-6 md:px-12 text-[#1A1A18] overflow-hidden border-t border-[#C1571F]/15">
      
      {/* Background Subtle Gradient Blobs for Ecotourism Depth */}
      <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#C1571F]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 h-[300px] w-[300px] rounded-full bg-[#E3A21E]/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C1571F]/20 pb-8 mb-16">
          <div>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#C1571F]">
              Community Voices
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-[#1A1A18] sm:text-4xl md:text-5xl">
              Tales from the Trail
            </h2>
            <p className="mt-4 max-w-xl text-sm text-[#52524E]">
              Read organic stories, gear checklists, and mountaineering guides written by our certified crew and community explorers.
            </p>
          </div>

          <div>
            <button
              onClick={handleShareStoryClick}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-[#FFFFFF] font-bold px-6 font-outfit text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              Share Your Story
            </button>
          </div>
        </div>

        {(publishedBlogs || []).length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#E7E7E4] rounded-2xl shadow-sm">
            <p className="text-[#52524E] font-bold">Be the first to share a trail story!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(publishedBlogs || []).map((post) => (
              <article 
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-sm transition-all duration-300 hover:border-[#C1571F]/30 hover:shadow-md flex-1"
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
                    <div className="flex items-center gap-2 text-xxs uppercase tracking-wider text-stone-600/70">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="text-[#C1571F] font-bold px-1.5 py-0.5 rounded bg-[#C1571F]/10 border border-[#C1571F]/20">
                        {post.authorBadge}
                      </span>
                    </div>

                    <h3 className="mt-3 font-outfit text-lg font-bold leading-snug text-[#3A2A1E] group-hover:text-[#C1571F] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-xs text-[#52524E] line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E7E7E4] flex items-center justify-between">
                    <span className="text-xxs text-[#52524E] font-semibold">By {post.author}</span>
                    <button
                      onClick={() => setSelectedBlog(post)}
                      className="inline-flex items-center gap-1.5 font-outfit text-xxs font-bold uppercase tracking-wider text-[#C1571F] group-hover:text-[#A84310] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-955/20 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] text-[#1A1A18] shadow-sm animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Cover Header */}
            <div className="relative h-64 shrink-0">
              <img 
                src={selectedBlog.coverUrl} 
                alt={selectedBlog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/10 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-[#FFFFFF]/80 hover:bg-[#E7E7E4] text-[#1A1A18] transition-colors border border-[#E7E7E4] shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block rounded-full bg-[#C1571F] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md mb-2">
                  {selectedBlog.category}
                </span>
                <h3 className="font-outfit text-xl sm:text-2xl font-black leading-tight text-[#1A1A18] drop-shadow-sm">
                  {selectedBlog.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed text-[#52524E]">
              <div className="flex items-center gap-3 border-b border-[#E7E7E4] pb-4 mb-4">
                <div className="h-9 w-9 rounded-full bg-[#E3A21E]/10 flex items-center justify-center border border-[#E3A21E]/30 text-[#E3A21E]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A18]">{selectedBlog.author}</div>
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
            <div className="bg-[#F8F8F6] px-6 py-4 border-t border-[#E7E7E4] flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="h-10 px-6 rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STORY SUBMISSION FORM MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/20 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] text-[#1A1A18] shadow-sm animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-[#F8F8F6] p-5 flex justify-between items-center border-b border-[#E7E7E4] shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-autumn-maple/10 flex items-center justify-center text-autumn-maple border border-autumn-maple/20">
                  <BookOpen className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-[#1A1A18]">
                    Share Your Trail Story
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-autumn-maple font-semibold block mt-0.5">
                    Submit Article for Moderation
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#E7E7E4] text-[#52524E] hover:text-[#1A1A18] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formError && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#52524E]">Article Title</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., A Scenic Escape to Silent Valley"
                  className="h-11 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] px-4 text-sm text-[#1A1A18] placeholder-[#52524E]/50 outline-none focus:border-autumn-maple/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#52524E]">Category Select</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-11 rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] px-4 text-sm text-[#1A1A18] outline-none focus:border-autumn-maple/60 transition-colors cursor-pointer"
                >
                  <option value="Trail Stories">Trail Stories</option>
                  <option value="Gear & Packing">Gear & Packing</option>
                  <option value="Safety First">Safety First</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#52524E]">Cover Image</label>
                
                {formCoverImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-[#E7E7E4] bg-[#F8F8F6] p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={formCoverImage} 
                        alt="Preview" 
                        className="h-14 w-20 object-cover rounded-lg border border-[#E7E7E4]"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A18]">Selected Image</span>
                        <span className="text-[10px] text-[#52524E]/50 block">Ready to upload</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormCoverImage('')}
                      className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors"
                      title="Remove Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragOver 
                        ? 'border-autumn-maple bg-[#F8F8F6]/80 scale-[0.99]' 
                        : 'border-[#E7E7E4] bg-[#F8F8F6] hover:border-autumn-maple/50'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-[#C1571F]" />
                    <div className="text-xs text-[#52524E] font-medium">
                      Click or drag an image from your device
                    </div>
                    <span className="text-[9px] text-[#52524E]/50">Supports PNG, JPG, JPEG, WEBP up to 5MB</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#52524E]">Your Story Content</label>
                <textarea 
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Share details on base camps, trail features, packing checks, and overall vibes..."
                  rows="6"
                  className="rounded-xl border border-[#E7E7E4] bg-[#F8F8F6] p-4 text-sm text-[#1A1A18] placeholder-[#52524E]/50 outline-none focus:border-autumn-maple/60 transition-colors resize-none"
                />
              </div>

              <button type="submit" className="hidden" />
            </form>

            {/* Footer */}
            <div className="bg-[#F8F8F6] p-5 border-t border-[#E7E7E4] flex gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-xl border border-[#E7E7E4] hover:bg-[#E7E7E4]/40 text-[#52524E] font-outfit text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel Submission
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-xl bg-[#C1571F] hover:bg-[#A84310] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-300"
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
