(function () {
  const POLICIES = {
    kerala: {
      title: "1-Day / 2-Day Kerala Treks Cancellation Policy",
      badge: "KERALA EXPEDITIONS",
      slabs: [
        { window: "30+ days before trek", refund: "95% of the Trek Fee" },
        { window: "15+ days before trek", refund: "80% of the Trek Fee" },
        { window: "7+ days before trek", refund: "50% Refund" },
        { window: "Within 7 days", refund: "No Refund" }
      ]
    },
    karnataka: {
      title: "Karnataka Treks Cancellation Policy",
      badge: "KARNATAKA EXPEDITIONS",
      slabs: [
        { window: "30+ days before trek", refund: "90% of the Trek Fee" },
        { window: "15+ days before trek", refund: "70% of the Trek Fee" },
        { window: "7+ days before trek", refund: "40% of the Trek Fee" },
        { window: "Within 7 days", refund: "No Refund" }
      ]
    },
    himalayan: {
      title: "Himalayan Treks Cancellation Policy",
      badge: "HIMALAYAN EXPEDITIONS",
      slabs: [
        { window: "45+ days before trek", refund: "90% of the Trek Fee" },
        { window: "30+ days before trek", refund: "70% of the Trek Fee" },
        { window: "15+ days before trek", refund: "50% of the Trek Fee" },
        { window: "Within 15 days / No show", refund: "No Refund" }
      ]
    },
    international: {
      title: "International Treks Cancellation Policy",
      badge: "INTERNATIONAL SUMMITS",
      slabs: [
        { window: "45+ days before trek", refund: "85% of the Trek Fee" },
        { window: "30+ days before trek", refund: "75% of the Trek Fee" },
        { window: "15+ days before trek", refund: "50% of the Trek Fee" },
        { window: "Within 15 days / No show", refund: "No Refund" }
      ]
    },
    special: {
      title: "Special Permit Treks Cancellation Policy",
      badge: "FOREST PERMIT RESTRICTED",
      note: "Forest Department entry permits are strictly non-refundable once issued.",
      slabs: [
        { window: "30+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
        { window: "15+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
        { window: "7+ days before trek", refund: "50% refund on total cost (excluding forest permit fees)" },
        { window: "Within 7 days", refund: "No Refund" }
      ]
    }
  };

  function renderPolicySection() {
    // Avoid double rendering if already mounted
    if (document.getElementById("cancellation-policy")) return;

    const mount = document.getElementById("bootpaths-cancellation-policy");
    const key = (mount?.dataset.policy || document.body.dataset.policy || "kerala").toLowerCase();
    const policy = POLICIES[key] || POLICIES.kerala;

    const container = mount || document.createElement("section");
    container.id = "cancellation-policy";
    container.className = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-14";

    container.innerHTML = `
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden font-['Open_Sans',sans-serif]">
        <div class="px-6 py-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="text-[11px] font-bold tracking-wider uppercase text-orange-400">${policy.badge}</span>
            <h3 class="text-lg md:text-xl font-bold mt-0.5">${policy.title}</h3>
          </div>
          <span class="text-xs text-stone-300">Transparent Refund & Replacement Terms</span>
        </div>

        <div class="p-6 space-y-6">
          ${policy.note ? `<div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">⚠️ ${policy.note}</div>` : ""}

          <!-- Refund Slabs Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${policy.slabs.map(s => `
              <div class="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <div class="text-xs font-semibold text-stone-500 uppercase tracking-wide">${s.window}</div>
                <div class="text-sm font-bold text-stone-900 mt-1.5">${s.refund}</div>
              </div>
            `).join("")}
          </div>

          <!-- Wallet Money & Replacement Rules -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div class="p-4 rounded-xl bg-orange-50/70 border border-orange-200/70">
              <h4 class="text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">💳 BOOTpaths Wallet Money Policy</h4>
              <ul class="text-xs text-stone-700 space-y-1.5 list-disc pl-4">
                <li>Participants opting to carry forward their refund receive <strong>50% additional value</strong> as wallet credit.</li>
                <li><strong>Credit Validity:</strong> 12 months from the original cancelled trek date.</li>
                <li><strong>Applicable For:</strong> Self participation or Immediate Family (Parents / Children / Spouse).</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <h4 class="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">🔄 Participant Replacement Policy</h4>
              <ul class="text-xs text-stone-700 space-y-1.5 list-disc pl-4">
                <li><strong>30+ days before trek:</strong> 100% replacement allowed (no extra fee).</li>
                <li><strong>15+ days before trek (1–2 Day Treks):</strong> 10% additional charges.</li>
                <li><strong>15+ days before trek (Himalayan Treks):</strong> 25% additional charges.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!mount) {
      const faqSection = document.getElementById("faq") || document.querySelector("footer");
      if (faqSection && faqSection.parentNode) {
        faqSection.parentNode.insertBefore(container, faqSection);
      } else {
        document.body.appendChild(container);
      }
    }
  }

  function renderFloatingSharePill() {
    // Avoid double rendering if already mounted
    if (document.getElementById("bootpaths-floating-share")) return;

    const shareContainer = document.createElement("div");
    shareContainer.id = "bootpaths-floating-share";
    shareContainer.className = "fixed left-4 z-[9999]";
    shareContainer.style.cssText = "position: fixed; left: 1rem; bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px)); z-index: 9999; pointer-events: auto;";

    const btn = document.createElement("button");
    btn.id = "bootpaths-share-btn";
    btn.type = "button";
    btn.title = "Share this trek link";
    btn.setAttribute("aria-label", "Share Trek");
    btn.className = "px-4 py-2.5 rounded-full bg-stone-900/95 hover:bg-orange-600 text-white text-xs font-semibold shadow-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 min-h-[44px]";
    btn.style.cssText = "display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; min-height: 44px; border-radius: 9999px; background-color: rgba(28, 25, 23, 0.95); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); cursor: pointer; transition: all 0.2s ease; outline: none;";

    btn.innerHTML = `
      <svg style="width: 16px; height: 16px; flex-shrink: 0; display: block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
      </svg>
      <span id="bootpaths-share-text">Share</span>
    `;

    btn.addEventListener("mouseenter", function () {
      btn.style.backgroundColor = "#ea580c";
      btn.style.borderColor = "#ea580c";
      btn.style.transform = "scale(1.05)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.backgroundColor = "rgba(28, 25, 23, 0.95)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.2)";
      btn.style.transform = "scale(1)";
    });
    btn.addEventListener("mousedown", function () {
      btn.style.transform = "scale(0.95)";
    });
    btn.addEventListener("mouseup", function () {
      btn.style.transform = "scale(1.05)";
    });

    function showCopied() {
      const span = document.getElementById("bootpaths-share-text");
      if (span) {
        const orig = span.textContent;
        span.textContent = "Link Copied!";
        setTimeout(function () {
          span.textContent = orig;
        }, 2000);
      }
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          showCopied();
        } catch (e) {}
      }
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let shareUrl = window.location.href;
      try {
        if (window.top && window.top !== window.self && window.top.location.href) {
          shareUrl = window.top.location.href;
        }
      } catch (err) {}

      try {
        const urlObj = new URL(shareUrl);
        const m = urlObj.pathname.match(/\/treks\/([^\/]+)/);
        if (m && m[1]) {
          shareUrl = `${urlObj.origin}/?trek=${m[1]}`;
        }
      } catch (err) {}

      const pageTitle = document.title || "BOOTpaths Trek Expedition";
      if (navigator.share) {
        navigator.share({
          title: pageTitle,
          text: `Check out this trek on BOOTpaths:`,
          url: shareUrl
        }).catch(function (err) {
          if (!err || err.name !== "AbortError") {
            copyToClipboard(shareUrl);
          }
        });
      } else {
        copyToClipboard(shareUrl);
      }
    });

    shareContainer.appendChild(btn);
    document.body.appendChild(shareContainer);
  }

  // 3. Live Batch Fetcher & Auto-Sync from Firestore
  function injectLiveStyles() {
    if (document.getElementById("bp-live-styles")) return;
    const style = document.createElement("style");
    style.id = "bp-live-styles";
    style.textContent = `
      @keyframes bpPing {
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      .bp-ping-anim {
        animation: bpPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      .bp-batch-card:hover {
        transform: translateY(-2px);
        border-color: rgba(235, 90, 13, 0.6) !important;
        background: rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 10px 25px -5px rgba(235, 90, 13, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.4) !important;
      }
      .bp-batch-card:active {
        transform: scale(0.99);
      }
    `;
    document.head.appendChild(style);
  }

  function parseBatchDateTimestamp(str) {
    try {
      if (!str) return 0;
      const t = new Date(str).getTime();
      if (!isNaN(t)) return t;
      const parts = str.replace(/[–\-]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
      if (parts.length >= 3) {
        const lastTwo = parts.slice(-2).join(' ');
        const t2 = new Date(parts[0] + ' ' + lastTwo).getTime();
        if (!isNaN(t2)) return t2;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  async function syncLiveBatches() {
    try {
      const path = window.location.pathname || '';
      const match = path.match(/\/treks\/([^\/]+)/i);
      if (!match) return;
      const rawSlug = match[1].toLowerCase().trim();
      const normSlug = rawSlug.replace(/[^a-z0-9]/g, '');
      if (!normSlug) return;

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4500) : null;

      const endpoint = "https://firestore.googleapis.com/v1/projects/bootpaths-4b877/databases/(default)/documents/packages?key=AIzaSyDjzFMBlwAoN3y6KOUPWHbAD7w4xZEJGq8&pageSize=100";
      const resp = await fetch(endpoint, controller ? { signal: controller.signal } : {});
      if (timeoutId) clearTimeout(timeoutId);

      if (!resp.ok) return;
      const data = await resp.json();
      if (!data.documents || !data.documents.length) return;

      // Find matching package document
      const pkg = data.documents.find(doc => {
        const f = doc.fields || {};
        if (f.isVisible && f.isVisible.booleanValue === false) return false;
        if (f.isArchived && f.isArchived.booleanValue === true) return false;
        if (f.status && (f.status.stringValue === 'draft' || f.status.stringValue === 'hidden')) return false;

        const docId = (doc.name || '').split('/').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
        const slug = (f.slug?.stringValue || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const title = (f.title?.stringValue || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const details = ((f.detailsUrl?.stringValue || f.detailsLink?.stringValue || '')).toLowerCase();

        return (
          docId === normSlug ||
          slug === normSlug ||
          (details && details.includes('/' + rawSlug)) ||
          (title && (title === normSlug || normSlug.includes(title) || title.includes(normSlug)))
        );
      });

      if (!pkg) return;
      const f = pkg.fields || {};

      // Parse batch dates
      let batchDates = [];
      if (f.batchDates && f.batchDates.arrayValue && f.batchDates.arrayValue.values) {
        batchDates = f.batchDates.arrayValue.values.map(v => v.stringValue).filter(Boolean);
      } else if (f.dates && f.dates.stringValue) {
        batchDates = [f.dates.stringValue];
      }

      // Sort dates chronologically
      if (batchDates.length > 1) {
        batchDates.sort((a, b) => {
          const ta = parseBatchDateTimestamp(a);
          const tb = parseBatchDateTimestamp(b);
          if (ta && tb) return ta - tb;
          return 0;
        });
      }

      const priceVal = f.price?.integerValue || f.price?.doubleValue || f.price?.stringValue || '';
      const numPrice = Number(String(priceVal).replace(/[^0-9]/g, '')) || 0;
      const slotsLeft = f.slotsLeft?.integerValue !== undefined ? Number(f.slotsLeft.integerValue) : (f.slotsLeft?.doubleValue !== undefined ? Number(f.slotsLeft.doubleValue) : null);
      const tag = f.tag?.stringValue || '';
      const trekId = (pkg.name || '').split('/').pop() || rawSlug;

      // 1. Auto-sync existing page elements
      if (batchDates.length > 0) {
        const nextBatchDate = batchDates[0];

        // Update Quick Info strip for Batch Date / Dates
        const qiItems = document.querySelectorAll('.qi, .stat-item, .info-item, div');
        qiItems.forEach(item => {
          const small = item.querySelector('small, .label, span');
          if (small && /batch\s*date|dates|departure|season/i.test(small.textContent || '')) {
            const strong = item.querySelector('strong, span.value, p');
            if (strong && !item.closest('#live-upcoming-batches')) {
              strong.textContent = nextBatchDate;
            }
          }
          if (small && /trek\s*fee|price|fee|cost/i.test(small.textContent || '') && numPrice > 0) {
            const strong = item.querySelector('strong, span.value, p');
            if (strong && !item.closest('#live-upcoming-batches')) {
              strong.textContent = `₹${numPrice.toLocaleString('en-IN')} per person`;
            }
          }
        });

        // Update Duration batch subtext (e.g. "... Batch")
        const batchTexts = document.querySelectorAll('p, span, div');
        batchTexts.forEach(el => {
          if (el.children.length === 0 && /\bBatch\b/i.test(el.textContent || '') && !el.closest('#live-upcoming-batches')) {
            el.textContent = `${nextBatchDate} Batch`;
          }
        });
      }

      if (numPrice > 0) {
        const feeHolders = document.querySelectorAll('.trek-fee, .price-display, [data-field="price"]');
        feeHolders.forEach(el => {
          if (!el.closest('#live-upcoming-batches')) {
            el.textContent = `₹${numPrice.toLocaleString('en-IN')}`;
          }
        });
      }

      // 2. Render Live "Upcoming Batches" Banner
      if (batchDates.length === 0 && !numPrice) return;
      if (document.getElementById('live-upcoming-batches')) return;

      injectLiveStyles();

      const banner = document.createElement('section');
      banner.id = 'live-upcoming-batches';
      banner.style.cssText = 'width: 100%; max-width: 1152px; margin: 2rem auto; padding: 0 1rem; position: relative; z-index: 20; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;';

      const getStatusBadge = (slots, tagStr) => {
        if (slots === 0 || (tagStr && tagStr.toUpperCase() === 'SOLD OUT')) {
          return '<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:9999px;font-size:11px;font-weight:700;letter-spacing:0.03em;background:rgba(244,63,94,0.18);color:#fda4af;border:1px solid rgba(244,63,94,0.35);"><span style="width:6px;height:6px;border-radius:50%;background:#f43f5e;"></span>SOLD OUT</span>';
        }
        if ((slots !== null && slots <= 5) || (tagStr && (tagStr.toUpperCase().includes('FILLING') || tagStr.toUpperCase().includes('LIMITED')))) {
          const leftText = slots !== null ? ` (${slots} Left)` : '';
          return `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:9999px;font-size:11px;font-weight:700;letter-spacing:0.03em;background:rgba(245,158,11,0.18);color:#fcd34d;border:1px solid rgba(245,158,11,0.35);"><span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;"></span>FILLING FAST${leftText}</span>`;
        }
        const text = slots !== null ? `${slots} Slots Left` : 'Available';
        return `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:9999px;font-size:11px;font-weight:700;letter-spacing:0.03em;background:rgba(16,185,129,0.18);color:#6ee7b7;border:1px solid rgba(16,185,129,0.35);"><span style="width:6px;height:6px;border-radius:50%;background:#10b981;"></span>${text}</span>`;
      };

      const pillsHtml = batchDates.map((bDate, idx) => {
        const isNext = idx === 0;
        return `
          <div class="bp-batch-card" data-date="${bDate}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 14px 18px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid ${isNext ? 'rgba(235, 90, 13, 0.45)' : 'rgba(255, 255, 255, 0.12)'};
            box-shadow: 0 4px 20px -2px rgba(0,0,0,0.3);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            flex: 1 1 260px;
            min-width: 250px;
            box-sizing: border-box;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="
                width: 38px;
                height: 38px;
                border-radius: 10px;
                background: ${isNext ? 'rgba(235, 90, 13, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
                border: 1px solid ${isNext ? 'rgba(235, 90, 13, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${isNext ? '#fb923c' : '#ffffff'};
                font-size: 16px;
                flex-shrink: 0;
              ">
                🗓️
              </div>
              <div style="text-align: left;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 13px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">${bDate}</span>
                  ${isNext ? '<span style="font-size: 9px; font-weight: 800; background: #ea580c; color: white; padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">NEXT</span>' : ''}
                </div>
                ${numPrice > 0 ? `<div style="font-size: 12px; font-weight: 600; color: #fb923c; margin-top: 2px;">₹${numPrice.toLocaleString('en-IN')} <span style="font-size: 10px; color: #a8a29e; font-weight: 400;">/ person</span></div>` : ''}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;">
              ${getStatusBadge(slotsLeft, tag)}
              <span style="font-size: 11px; font-weight: 700; color: #fb923c; display: flex; align-items: center; gap: 3px;">
                Book Now <span>→</span>
              </span>
            </div>
          </div>
        `;
      }).join('');

      banner.innerHTML = `
        <div style="
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(28, 25, 23, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          padding: 22px 24px;
          box-sizing: border-box;
        ">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="position: relative; display: flex; height: 10px; width: 10px;">
                <span class="bp-ping-anim" style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; background-color: #34d399; opacity: 0.75;"></span>
                <span style="position: relative; display: inline-flex; border-radius: 9999px; height: 10px; width: 10px; background-color: #10b981;"></span>
              </span>
              <div>
                <h3 style="font-size: 14px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 8px;">
                  Upcoming Expeditions &amp; Batches
                </h3>
                <p style="font-size: 11px; color: #a8a29e; margin: 2px 0 0 0;">
                  Live batch slots &amp; verified real-time departure schedules
                </p>
              </div>
            </div>

            <div style="font-size: 11px; font-weight: 600; color: #94a3b8; background: rgba(255, 255, 255, 0.05); padding: 5px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
              ⚡ Instant Confirmation &bull; Reserve Your Slot
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            ${pillsHtml}
          </div>
        </div>
      `;

      // Click listener on batch cards
      const cards = banner.querySelectorAll('.bp-batch-card');
      cards.forEach(card => {
        card.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          const chosenDate = this.getAttribute('data-date') || '';
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'OPEN_BOOKING',
              trekId: trekId,
              trekSlug: rawSlug,
              batchDate: chosenDate,
              date: chosenDate
            }, '*');
          } else {
            window.location.href = `/?trek=${encodeURIComponent(rawSlug)}&book=1&batchDate=${encodeURIComponent(chosenDate)}`;
          }
        });
      });

      // Insert right after hero or before quick info
      const hero = document.getElementById('hero') || document.querySelector('section.hero') || document.querySelector('.hero') || document.querySelector('header');
      if (hero && hero.parentNode) {
        hero.insertAdjacentElement('afterend', banner);
      } else {
        const main = document.querySelector('main') || document.body;
        main.insertBefore(banner, main.firstChild);
      }
    } catch (err) {
      // Graceful silent fallback
    }
  }

  function init() {
    renderPolicySection();
    renderFloatingSharePill();
    syncLiveBatches();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
