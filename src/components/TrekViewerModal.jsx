import React, { useState, useEffect, useRef } from 'react';

export default function TrekViewerModal({ isOpen, onClose, trekUrl, trekTitle, onBookNow }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Listen for messages posted from the embedded sub-page iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && (event.data.type === 'TRIGGER_BOOKING' || event.data.type === 'BOOK_NOW')) {
        onClose();
        if (onBookNow) onBookNow(event.data.trekSlug || event.data.trekId || trekTitle);
      }
      if (event.data && (event.data.type === 'CLOSE_PREVIEW' || event.data.type === 'CLOSE_MODAL')) {
        onClose();
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [onClose, onBookNow, trekTitle]);

  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) return;
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        // Intercept all booking buttons and links inside the embedded subpage
        const bookLinks = iframeDoc.querySelectorAll('a[href*="book="], a[href*="booking"], a.btn-p, a[href*="#book"]');
        bookLinks.forEach((link) => {
          link.addEventListener('click', (ev) => {
            const href = link.getAttribute('href') || '';
            const match = href.match(/book=([a-zA-Z0-9_-]+)/);
            const slug = match ? match[1] : '';
            ev.preventDefault();
            ev.stopPropagation();
            onClose();
            if (onBookNow) onBookNow(slug || trekTitle);
          });
        });

        // Intercept "Back" / "Back to BOOTpaths" links inside iframe
        const allLinks = iframeDoc.querySelectorAll('a');
        allLinks.forEach((link) => {
          if (link.textContent && (link.textContent.includes('Back') || link.getAttribute('aria-label')?.includes('Back'))) {
            link.addEventListener('click', (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              onClose();
            });
          }
        });
      }
    } catch (err) {
      // In case of any cross-origin sandboxing restriction
    }
  };

  if (!isOpen || !trekUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn h-[100dvh] min-h-[100svh] w-screen overflow-hidden">
      {/* Embedded Sub-Website Container */}
      <div className="flex-1 w-full h-[100dvh] min-h-[100svh] bg-white relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={trekUrl}
          title={trekTitle || "Trek Details"}
          onLoad={handleIframeLoad}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}
