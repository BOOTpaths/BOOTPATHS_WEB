import React, { useEffect, useRef } from 'react';

export default function TrekViewerModal({ isOpen, onClose, trekUrl, trekTitle, onBookNow }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Listen for "BOOK NOW" messages posted from the embedded sub-page iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && (event.data.type === 'TRIGGER_BOOKING' || event.data.type === 'BOOK_NOW')) {
        onClose();
        if (onBookNow) onBookNow(event.data.trekSlug || event.data.trekId || trekTitle);
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
      }
    } catch (err) {
      // In case of any cross-origin sandboxing restriction
    }
  };

  if (!isOpen || !trekUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-900/95 border-b border-stone-800 text-white shadow-lg shrink-0">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          <h3 className="text-sm font-semibold tracking-wide text-stone-200 uppercase truncate">
            {trekTitle || "Expedition Details"}
          </h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              onClose();
              if (onBookNow) onBookNow(trekTitle);
            }}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Book This Trek
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Embedded Sub-Website Container */}
      <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={trekUrl}
          title={trekTitle || "Trek Details"}
          onLoad={handleIframeLoad}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
