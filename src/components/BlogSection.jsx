/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import BlogReader from './BlogReader';

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

  // Handle hash-based dynamic routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog-')) {
        const id = hash.replace('#blog-', '');
        const found = publishedBlogs.find(b => b.id === id);
        if (found) {
          setSelectedBlog(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setSelectedBlog(null);
      }
    };

    handleHash(); // Run on mount / update
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [publishedBlogs]);

  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    window.location.hash = `#blog-${blog.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedBlog(null);
    window.location.hash = '#blogs';
    setTimeout(() => {
      document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (selectedBlog) {
    return <BlogReader blog={selectedBlog} onBack={handleBack} allBlogs={publishedBlogs} onSelectBlog={handleSelectBlog} />;
  }

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
                        onClick={() => handleSelectBlog(post)}
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

    </section>
  );
}
