import React, { useState, useEffect, useRef } from 'react';

export default function TrekViewerModal({ isOpen, onClose, trekUrl, trekTitle, onBookNow }) {
  const iframeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleShareTrek = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trekTitle || 'BOOTpaths Expedition'} — BOOTpaths`,
          text: `Check out this trek on BOOTpaths:`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          // If share API failed for another reason, fallback to clipboard below
        } else {
          return; // user cancelled native share sheet
        }
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

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
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      {/* Floating Share Button in Bottom-Left Corner */}
      <div className="fixed bottom-5 left-5 z-[60]">
        <button
          onClick={handleShareTrek}
          className="px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-orange-600 text-white text-xs font-semibold shadow-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          title="Share this trek link"
          aria-label="Share Trek"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{copied ? "Link Copied!" : "Share"}</span>
        </button>
      </div>

      {/* Embedded Sub-Website Container */}
      <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
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
