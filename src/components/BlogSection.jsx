/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function BlogSection({ blogs: propBlogs, user }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [liveBlogs, setLiveBlogs] = useState([]);

  // Subscribe to live published blogs from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'blogs'), where('status', '==', 'published'));
      const unsub = onSnapshot(q, (snapshot) => {
        const fetched = [];
        snapshot.forEach(d => {
          fetched.push({ id: d.id, ...d.data() });
        });
        // Sort in memory to guarantee ordering by createdAt descending without requiring a Firestore index
        fetched.sort((a, b) => {
          const timeA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt) : 0;
          const timeB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt) : 0;
          return timeB - timeA;
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

  const publishedBlogs = liveBlogs.length > 0 ? liveBlogs : (propBlogs || []).filter(b => b.status === 'published');

  return (
    <section id="blogs" className="scroll-mt-36 relative bg-[#F8F8F6] py-24 px-6 md:px-12 text-[#1A1A18] overflow-hidden border-t border-[#C1571F]/15">
      
      {/* Background Subtle Gradient Blobs for Ecotourism Depth */}
      <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#C1571F]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 h-[300px] w-[300px] rounded-full bg-[#E3A21E]/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C1571F]/20 pb-8 mb-16">
          <div>
            <span className="font-outfit text-xs font-bold tracking-widest uppercase text-[#C1571F]">
              EXPLORATION DIARIES & INSIGHTS
            </span>
            <h2 className="mt-3 font-outfit text-3xl font-black tracking-tight text-[#1A1A18] sm:text-4xl md:text-5xl">
              BOOTpaths Official Blog
            </h2>
            <p className="mt-4 max-w-xl text-sm text-[#52524E]">
              Trail guides, preparation tips, gear reviews, and expedition stories published by our team.
            </p>
          </div>
        </div>

        {(publishedBlogs || []).length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#E7E7E4] rounded-2xl shadow-sm">
            <p className="text-[#52524E] font-bold">No blog posts available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(publishedBlogs || []).map((post) => {
              const excerpt = post.content 
                ? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content)
                : '';
              
              return (
                <article 
                  key={post.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] shadow-sm transition-all duration-300 hover:border-[#C1571F]/30 hover:shadow-md flex-1"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img 
                      src={post.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-505 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block rounded-full bg-[#C1571F] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                        {post.category || 'Trail Guide'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Meta Header */}
                      <div className="flex items-center gap-2 text-xxs uppercase tracking-wider text-stone-600/70">
                        <span>{post.date}</span>
                        {post.authorBadge && (
                          <>
                            <span>•</span>
                            <span className="text-[#C1571F] font-bold px-1.5 py-0.5 rounded bg-[#C1571F]/10 border border-[#C1571F]/20">
                              {post.authorBadge}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-3 font-outfit text-lg font-bold leading-snug text-[#3A2A1E] group-hover:text-[#C1571F] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-3 text-xs text-[#52524E] line-clamp-3 leading-relaxed">
                        {excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E7E7E4] flex items-center justify-between">
                      <span className="text-xxs text-[#52524E] font-semibold">By {post.author || 'BOOTpaths Lead'}</span>
                      <button
                        onClick={() => setSelectedBlog(post)}
                        className="inline-flex items-center gap-1.5 font-outfit text-xxs font-bold uppercase tracking-wider text-[#C1571F] group-hover:text-[#A84310] transition-colors cursor-pointer"
                      >
                        Read Article <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* ARTICLE SLIDE-OVER READER MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7E7E4] bg-[#FFFFFF] text-[#1A1A18] shadow-sm animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Cover Header */}
            <div className="relative h-64 shrink-0">
              <img 
                src={selectedBlog.coverUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
                alt={selectedBlog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/10 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-[#FFFFFF]/80 hover:bg-[#E7E7E4] text-[#1A1A18] transition-colors border border-[#E7E7E4] shadow-sm cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block rounded-full bg-[#C1571F] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md mb-2">
                  {selectedBlog.category || 'Trail Guide'}
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
                  <div className="text-xs font-bold text-[#1A1A18]">{selectedBlog.author || 'BOOTpaths Lead'}</div>
                  <div className="text-[10px] uppercase font-semibold text-[#E3A21E]/80 tracking-wider">
                    {(selectedBlog.authorBadge || 'Lead Guide')} • Published {selectedBlog.date}
                  </div>
                </div>
              </div>

              <div className="whitespace-pre-line space-y-4 font-outfit text-stone-700">
                {selectedBlog.content}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#F8F8F6] px-6 py-4 border-t border-[#E7E7E4] flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="h-10 px-6 rounded-lg bg-[#C1571F] hover:bg-[#A84310] text-white font-outfit text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
