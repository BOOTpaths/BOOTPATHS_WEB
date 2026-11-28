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

  // 3. Compact Minimal "Upcoming Batches" Bar & Live Firestore Sync
  const CANONICAL_FALLBACK_TREKS = {
    "agasthyarkoodam": {
      "id": "agasthyarkoodam",
      "title": "Agasthyarkoodam Wilderness Trek",
      "price": 4500,
      "originalPrice": 5500,
      "slots": 8,
      "badge": "PREMIUM TRAIL",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Agasthyarkoodam/index.html"
    },
    "arippa": {
      "id": "arippa",
      "title": "Arippa Forest Trek & Tribal Camp",
      "price": 3850,
      "originalPrice": 4500,
      "slots": 12,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11-12, 2026",
        "Jul 18-19, 2026",
        "Jul 25-26, 2026"
      ],
      "detailsUrl": "/treks/Arippa/index.html"
    },
    "athirapally": {
      "id": "athirapally",
      "title": "Athirapally Waterfall & Jungle Trail",
      "price": 1800,
      "originalPrice": 2400,
      "slots": 12,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Athirapally/index.html"
    },
    "banasura": {
      "id": "banasura",
      "title": "Banasura Hill Expedition",
      "price": 3200,
      "originalPrice": 4000,
      "slots": 10,
      "badge": "LIMITED SLOTS",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Banasura/index.html"
    },
    "brahmagiri": {
      "id": "brahmagiri",
      "title": "Brahmagiri Peak Trek",
      "price": 3899,
      "originalPrice": 4500,
      "slots": 7,
      "badge": "PREMIUM TRAIL",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Brahmagiri/index.html"
    },
    "chimmini-amphi": {
      "id": "chimmini-amphi",
      "title": "Chimmini Amphitheater Jungle Camp",
      "price": 2800,
      "originalPrice": 3500,
      "slots": 14,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Chimmini-amphi/index.html"
    },
    "gavi": {
      "id": "gavi",
      "title": "Gavi Forest Expedition & Safari",
      "price": 4200,
      "originalPrice": 5000,
      "slots": 6,
      "badge": "LIMITED SLOTS",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Gavi/index.html"
    },
    "goechala": {
      "id": "goechala",
      "title": "Goechala Pass Expedition",
      "price": 18500,
      "originalPrice": 22000,
      "slots": 5,
      "badge": "PREMIUM TRAIL",
      "batchDates": [
        "Jul 15, 2026",
        "Aug 05, 2026",
        "Sep 10, 2026"
      ],
      "detailsUrl": "/treks/Goachala-pass/index.html"
    },
    "kathirmudi": {
      "id": "kathirmudi",
      "title": "Kathirmudi Mist Peak Trail",
      "price": 2500,
      "originalPrice": 3200,
      "slots": 10,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Kathirmudi/index.html"
    },
    "kilimanjaro": {
      "id": "kilimanjaro",
      "title": "Mount Kilimanjaro Summit Trek",
      "price": 145000,
      "originalPrice": 165000,
      "slots": 4,
      "badge": "LIMITED SLOTS",
      "batchDates": [
        "Aug 10, 2026",
        "Sep 15, 2026",
        "Oct 20, 2026"
      ],
      "detailsUrl": "/treks/Kilimanjaro/index.html"
    },
    "kolukkumala": {
      "id": "kolukkumala",
      "title": "Kolukkumalai & Bose Peak New Year Special",
      "price": 3500,
      "originalPrice": 4200,
      "slots": 9,
      "badge": "NEW YEAR SPECIAL",
      "batchDates": [
        "Dec 31, 2026 – Jan 01, 2027"
      ],
      "detailsUrl": "/treks/Kolukkumala/index.html"
    },
    "meeshapulimala": {
      "id": "meeshapulimala",
      "title": "Meesapulimala Day Trek",
      "price": 4399,
      "originalPrice": 5200,
      "slots": 8,
      "badge": "MIDNIGHT START",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Meeshapulimala/index.html"
    },
    "mt-elbrus": {
      "id": "mt-elbrus",
      "title": "Mount Elbrus Summit Expedition",
      "price": 135000,
      "originalPrice": 150000,
      "slots": 3,
      "badge": "LIMITED SLOTS",
      "batchDates": [
        "Aug 01, 2026",
        "Aug 20, 2026"
      ],
      "detailsUrl": "/treks/Mt.Elbrus/index.html"
    },
    "parambikulam": {
      "id": "parambikulam",
      "title": "Parambikulam Tiger Reserve Trail",
      "price": 3400,
      "originalPrice": 4200,
      "slots": 11,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Parambikulam/index.html"
    },
    "periyar-boarder": {
      "id": "periyar-boarder",
      "title": "Periyar Border Hiking & Rafting",
      "price": 3600,
      "originalPrice": 4500,
      "slots": 8,
      "badge": "PREMIUM TRAIL",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Periyar-boarder/index.html"
    },
    "thommankuthu": {
      "id": "thommankuthu",
      "title": "Thommankuthu Riverbed Trek",
      "price": 2000,
      "originalPrice": 2500,
      "slots": 15,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Thommankuthu/index.html"
    },
    "yellapatty": {
      "id": "yellapatty",
      "title": "Yellapatty Cloud Camping Trek",
      "price": 3100,
      "originalPrice": 3800,
      "slots": 10,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/Yellapatty/index.html"
    },
    "chimmini-climate-walk": {
      "id": "chimmini-climate-walk",
      "title": "Chimmini Climate & Rain Walk",
      "price": 2100,
      "originalPrice": 2700,
      "slots": 12,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 12, 2026",
        "Jul 19, 2026",
        "Jul 26, 2026"
      ],
      "detailsUrl": "/treks/chimmini-climate-walk/index.html"
    },
    "chokkramudi": {
      "id": "chokkramudi",
      "title": "Chokramudi Peak Sunrise Trek",
      "price": 2900,
      "originalPrice": 3600,
      "slots": 10,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/chokkramudi/index.html"
    },
    "ebc-trek": {
      "id": "ebc-trek",
      "title": "Everest Base Camp Trek",
      "price": 90000,
      "originalPrice": 105000,
      "slots": 6,
      "badge": "PREMIUM EXPEDITION",
      "batchDates": [
        "Apr 10, 2027",
        "May 01, 2027",
        "Oct 10, 2027"
      ],
      "detailsUrl": "/treks/ebc-trek/index.html"
    },
    "peechimoodal": {
      "id": "peechimoodal",
      "title": "Peechi Moodal Forest Trail",
      "price": 1700,
      "originalPrice": 2200,
      "slots": 16,
      "badge": "FILLING FAST!",
      "batchDates": [
        "Jul 11, 2026",
        "Jul 18, 2026",
        "Jul 25, 2026"
      ],
      "detailsUrl": "/treks/peechimoodal/index.html"
    },
    "annapurna-base-camp": {
      "id": "annapurna-base-camp",
      "title": "Annapurna Base Camp Trek",
      "price": 35000,
      "originalPrice": 42000,
      "slots": 10,
      "badge": "POPULAR TRAIL",
      "batchDates": [
        "Apr 03, 2027",
        "Apr 17, 2027",
        "May 01, 2027"
      ],
      "detailsUrl": "/treks/annapurna-base-camp/index.html"
    },
    "mardi-himal-base-camp": {
      "id": "mardi-himal-base-camp",
      "title": "Mardi Himal Base Camp Trek",
      "price": 27500,
      "originalPrice": 34000,
      "slots": 12,
      "badge": "RIDGE EXPEDITION",
      "batchDates": [
        "Apr 05, 2027",
        "Apr 19, 2027",
        "May 03, 2027"
      ],
      "detailsUrl": "/treks/mardi-himal-base-camp/index.html"
    },
    "vellagavi": {
      "id": "vellagavi",
      "title": "Vellagavi Trek · Kumbakarai to Vattakanal",
      "price": 4200,
      "originalPrice": 5000,
      "slots": 12,
      "badge": "NEW TRAIL",
      "batchDates": [
        "Oct 17-18, 2026",
        "Nov 14-15, 2026",
        "Dec 12-13, 2026"
      ],
      "detailsUrl": "/treks/vellagavi/index.html"
    },
    "kumaraparvatha": {
      "id": "kumaraparvatha",
      "title": "Kumaraparvatha Trek | The King of the Western Ghats",
      "price": 4000,
      "originalPrice": 4800,
      "slots": 10,
      "badge": "KING OF GHATS",
      "batchDates": [
        "Jan 09-10, 2027"
      ],
      "detailsUrl": "/treks/kumaraparvatha/index.html"
    },
    "kuari-pass": {
      "id": "kuari-pass",
      "title": "Kuari Pass Trek",
      "price": 9850,
      "originalPrice": 12500,
      "slots": 12,
      "badge": "CURZON TRAIL",
      "batchDates": [
        "Oct 10-15, 2026",
        "Nov 07-12, 2026",
        "Dec 19-24, 2026"
      ],
      "detailsUrl": "/treks/kuari-pass/index.html"
    },
    "sandhakphu-phalut": {
      "id": "sandhakphu-phalut",
      "title": "Sandakphu Phalut Trek",
      "price": 14500,
      "originalPrice": 17500,
      "slots": 10,
      "badge": "SLEEPING BUDDHA",
      "batchDates": [
        "Oct 18-24, 2026",
        "Nov 15-21, 2026",
        "Dec 06-12, 2026"
      ],
      "detailsUrl": "/treks/sandhakphu-phalut/index.html"
    }
  };

  function injectMinimalBatchStyles() {
    if (document.getElementById("bp-minimal-batch-styles")) return;
    const style = document.createElement("style");
    style.id = "bp-minimal-batch-styles";
    style.textContent = `
      .bp-batch-scroll::-webkit-scrollbar {
        height: 5px;
      }
      .bp-batch-scroll::-webkit-scrollbar-track {
        background: #f5f5f4;
        border-radius: 9999px;
      }
      .bp-batch-scroll::-webkit-scrollbar-thumb {
        background: #d6d3d1;
        border-radius: 9999px;
      }
      .bp-batch-scroll::-webkit-scrollbar-thumb:hover {
        background: #a8a29e;
      }
      .bp-batch-item:hover:not(.bp-disabled) {
        border-color: #ea580c !important;
        box-shadow: 0 4px 14px -2px rgba(234, 88, 12, 0.15) !important;
      }
      @media (min-width: 768px) {
        .bp-batch-grid-md {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
          overflow-x: visible !important;
        }
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

  function extractMonthYear(str) {
    if (!str) return null;
    const m = str.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\S]*?(202\d)/i);
    if (m) {
      const mon = m[1].slice(0, 3);
      return mon.charAt(0).toUpperCase() + mon.slice(1).toLowerCase() + ' ' + m[2];
    }
    return null;
  }

  // Helper to decode raw Firestore REST API values
  function decodeFirestoreValue(val) {
    if (val === null || val === undefined) return null;
    if ('stringValue' in val) return val.stringValue;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return parseFloat(val.doubleValue);
    if ('booleanValue' in val) return val.booleanValue;
    if ('nullValue' in val) return null;
    if ('timestampValue' in val) return val.timestampValue;
    if ('arrayValue' in val) {
      const list = val.arrayValue && val.arrayValue.values ? val.arrayValue.values : [];
      return list.map(decodeFirestoreValue);
    }
    if ('mapValue' in val) {
      const obj = {};
      const fields = (val.mapValue && val.mapValue.fields) ? val.mapValue.fields : {};
      for (const k in fields) {
        obj[k] = decodeFirestoreValue(fields[k]);
      }
      return obj;
    }
    return val;
  }

  function decodeFirestoreDocument(doc) {
    if (!doc) return null;
    const obj = { id: (doc.name || '').split('/').pop() };
    const fields = doc.fields || {};
    for (const k in fields) {
      obj[k] = decodeFirestoreValue(fields[k]);
    }
    return obj;
  }

  async function syncLiveBatches() {
    try {
      const path = window.location.pathname || '';
      const match = path.match(/\/treks\/([^\/]+)/i);
      if (!match) return;
      const rawSlug = match[1].toLowerCase().trim();
      const normSlug = rawSlug.replace(/[^a-z0-9]/g, '');
      if (!normSlug) return;

      let packageData = null;
      let matchingBatches = [];

      // 1. Fetch live package documents from Firestore REST API with field mask
      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;
        const maskFields = [
          'title', 'batchDates', 'dates', 'date', 'price', 'originalPrice',
          'slotsLeft', 'availableSlots', 'slots', 'tag', 'badge',
          'detailsUrl', 'detailsLink', 'slug', 'isVisible', 'isArchived', 'status'
        ];
        const maskQuery = maskFields.map(f => 'mask.fieldPaths=' + encodeURIComponent(f)).join('&');
        const endpoint = 'https://firestore.googleapis.com/v1/projects/bootpaths-4b877/databases/(default)/documents/packages?pageSize=100&' + maskQuery + '&key=AIzaSyDjzFMBlwAoN3y6KOUPWHbAD7w4xZEJGq8';
        
        let docs = [];
        const resp = await fetch(endpoint, controller ? { signal: controller.signal } : {});
        if (timeoutId) clearTimeout(timeoutId);

        if (resp.ok) {
          const data = await resp.json();
          docs = (data.documents || []).map(decodeFirestoreDocument);
        }

        // Match current trek slug against Firestore documents
        let matchedDoc = docs.find(doc => {
          if (!doc) return false;
          if (doc.isVisible === false || doc.isArchived === true) return false;
          if (doc.status === 'draft' || doc.status === 'hidden') return false;

          const docId = (doc.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const slug = (doc.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const title = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const details = (doc.detailsUrl || doc.detailsLink || '').toLowerCase().trim();

          return (
            docId === normSlug ||
            slug === normSlug ||
            (details && (details.includes('/' + rawSlug + '/') || details.endsWith('/' + rawSlug) || details.includes(rawSlug))) ||
            (title && (title === normSlug || normSlug.includes(title) || title.includes(normSlug)))
          );
        });

        // Direct single document fallback if list didn't contain it
        if (!matchedDoc) {
          try {
            const directEndpoint = 'https://firestore.googleapis.com/v1/projects/bootpaths-4b877/databases/(default)/documents/packages/' + encodeURIComponent(rawSlug) + '?' + maskQuery + '&key=AIzaSyDjzFMBlwAoN3y6KOUPWHbAD7w4xZEJGq8';
            const directResp = await fetch(directEndpoint);
            if (directResp.ok) {
              const rawDirect = await directResp.json();
              if (rawDirect && rawDirect.fields) {
                matchedDoc = decodeFirestoreDocument(rawDirect);
              }
            }
          } catch (e) {}
        }

        if (matchedDoc) {
          const docId = matchedDoc.id || rawSlug;
          const numPrice = Number(matchedDoc.price) || 0;
          const numOrigPrice = Number(matchedDoc.originalPrice) || 0;
          const slotsCount = matchedDoc.slotsLeft !== undefined
            ? Number(matchedDoc.slotsLeft)
            : (matchedDoc.availableSlots !== undefined
                ? Number(matchedDoc.availableSlots)
                : (matchedDoc.slots !== undefined ? Number(matchedDoc.slots) : 10));
          const tag = matchedDoc.tag || matchedDoc.badge || '';
          const title = matchedDoc.title || document.title.split('|')[0].trim();

          // Normalize batch dates to structured objects [{ date, slots }]
          let rawBatches = [];
          if (Array.isArray(matchedDoc.batchDates) && matchedDoc.batchDates.length > 0) {
            rawBatches = matchedDoc.batchDates;
          } else if (Array.isArray(matchedDoc.dates) && matchedDoc.dates.length > 0) {
            rawBatches = matchedDoc.dates;
          } else if (matchedDoc.batchDates && typeof matchedDoc.batchDates === 'string') {
            rawBatches = [matchedDoc.batchDates];
          } else if (matchedDoc.dates && typeof matchedDoc.dates === 'string') {
            rawBatches = [matchedDoc.dates];
          } else if (matchedDoc.date && typeof matchedDoc.date === 'string') {
            rawBatches = [matchedDoc.date];
          }

          const parsedBatches = rawBatches.map((item, idx) => {
            if (typeof item === 'string' && item.trim().length > 0) {
              return { date: item.trim(), slots: slotsCount };
            }
            if (item && typeof item === 'object') {
              const dStr = String(item.date || item.batchDate || '').trim();
              const sNum = item.slots !== undefined ? Number(item.slots) : slotsCount;
              if (dStr.length > 0) {
                return { date: dStr, slots: sNum };
              }
            }
            return null;
          }).filter(Boolean);

          if (parsedBatches.length > 0) {
            const firstActive = parsedBatches.find(b => b.slots > 0) || parsedBatches[0];
            packageData = {
              id: docId,
              title,
              price: numPrice,
              originalPrice: numOrigPrice,
              slots: firstActive ? firstActive.slots : slotsCount,
              availableSlots: firstActive ? firstActive.slots : slotsCount,
              badge: tag
            };

            parsedBatches.forEach((bObj, idx) => {
              const bSlots = bObj.slots !== undefined ? Number(bObj.slots) : slotsCount;
              matchingBatches.push({
                id: docId + '-' + idx,
                date: bObj.date,
                slots: bSlots,
                availableSlots: bSlots,
                price: numPrice,
                originalPrice: numOrigPrice,
                badge: tag
              });
            });
          }
        }
      } catch (e) {
        // Network or fetch error
      }

      // 2. Fallback to canonical trek data if not yet fetched from Firestore
      if (!packageData || matchingBatches.length === 0) {
        const fallback = CANONICAL_FALLBACK_TREKS[rawSlug] || CANONICAL_FALLBACK_TREKS[normSlug] || {
          id: rawSlug,
          title: document.title.split('|')[0].trim(),
          price: 4000,
          originalPrice: 4800,
          slots: 10,
          badge: 'Verified Trail',
          batchDates: ['Dates TBA']
        };

        packageData = {
          id: fallback.id || rawSlug,
          title: fallback.title || document.title.split('|')[0].trim(),
          price: fallback.price || 4000,
          originalPrice: fallback.originalPrice || (fallback.price ? fallback.price + 800 : 4800),
          slots: fallback.slots || 10,
          availableSlots: fallback.slots || 10,
          badge: fallback.badge || ''
        };

        const fallbackDates = Array.isArray(fallback.batchDates) && fallback.batchDates.length > 0
          ? fallback.batchDates
          : (fallback.date ? [fallback.date] : ['Dates TBA']);

        fallbackDates.forEach((item, idx) => {
          const dStr = typeof item === 'string' ? item : (item.date || 'Dates TBA');
          const bSlots = typeof item === 'object' && item.slots !== undefined ? Number(item.slots) : (fallback.slots || 10);
          matchingBatches.push({
            id: packageData.id + '-' + idx,
            date: dStr,
            slots: bSlots,
            availableSlots: bSlots,
            price: packageData.price,
            originalPrice: packageData.originalPrice,
            badge: fallback.badge || ''
          });
        });
      }

      // Sort batches chronologically
      if (matchingBatches.length > 1) {
        matchingBatches.sort((a, b) => {
          const ta = parseBatchDateTimestamp(a.date);
          const tb = parseBatchDateTimestamp(b.date);
          if (ta && tb) return ta - tb;
          return 0;
        });
      }

      const primaryBatch = matchingBatches[0];

      // 3. Auto-sync existing static text in sub-page HTML
      if (primaryBatch) {
        const qiItems = document.querySelectorAll('.qi, .stat-item, .info-item, div');
        qiItems.forEach(item => {
          const small = item.querySelector('small, .label, span');
          if (small && /batch\s*date|dates|departure|season/i.test(small.textContent || '')) {
            const strong = item.querySelector('strong, span.value, p');
            if (strong && !item.closest('#bp-minimal-batch-bar') && !item.closest('#live-upcoming-batches')) {
              strong.textContent = primaryBatch.date;
            }
          }
          if (small && /trek\s*fee|price|fee|cost/i.test(small.textContent || '') && packageData.price > 0) {
            const strong = item.querySelector('strong, span.value, p');
            if (strong && !item.closest('#bp-minimal-batch-bar') && !item.closest('#live-upcoming-batches')) {
              strong.textContent = '₹' + packageData.price.toLocaleString('en-IN') + ' per person';
            }
          }
        });

        // Update Duration batch subtext (e.g. "... Batch")
        const batchTexts = document.querySelectorAll('p, span, div');
        batchTexts.forEach(el => {
          if (el.children.length === 0 && /\bBatch\b/i.test(el.textContent || '') && !el.closest('#bp-minimal-batch-bar') && !el.closest('#live-upcoming-batches')) {
            el.textContent = primaryBatch.date + ' Batch';
          }
        });
      }

      // 4. Clean up any previous batch banner element
      const oldBanner = document.getElementById('live-upcoming-batches');
      if (oldBanner && oldBanner.parentNode) {
        oldBanner.parentNode.removeChild(oldBanner);
      }

      injectMinimalBatchStyles();

      // State for selection and month filtering
      const firstAvailable = matchingBatches.find(b => (b.availableSlots ?? b.slots ?? 0) > 0) || matchingBatches[0];
      let selectedBatchId = firstAvailable ? firstAvailable.id : matchingBatches[0].id;
      let activeMonth = 'All';

      // Extract unique months for tabs
      const uniqueMonths = [...new Set(matchingBatches.map(b => extractMonthYear(b.date)).filter(Boolean))];
      const hasMultiMonths = uniqueMonths.length > 1;

      // Create or re-use container
      let container = document.getElementById('bp-minimal-batch-bar');
      if (!container) {
        container = document.createElement('section');
        container.id = 'bp-minimal-batch-bar';
        container.className = 'w-full max-w-5xl mx-auto px-4 sm:px-6 my-6 font-[\'Open_Sans\',sans-serif]';
        container.style.cssText = 'width: 100%; max-width: 1024px; margin: 1.5rem auto; padding: 0 1rem; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; z-index: 20;';

        const hero = document.getElementById('hero') || document.querySelector('section.hero') || document.querySelector('.hero') || document.querySelector('header');
        if (hero && hero.parentNode) {
          hero.insertAdjacentElement('afterend', container);
        } else {
          const main = document.querySelector('main') || document.body;
          main.insertBefore(container, main.firstChild);
        }
      }

      function renderSelectorUI() {
        const filtered = activeMonth === 'All'
          ? matchingBatches
          : matchingBatches.filter(b => extractMonthYear(b.date) === activeMonth);

        const currentSelected = matchingBatches.find(b => b.id === selectedBatchId) || matchingBatches[0];
        const displayPrice = currentSelected.price || packageData.price;
        const displayOrigPrice = currentSelected.originalPrice || packageData.originalPrice;

        // Month filter tabs HTML
        let monthTabsHtml = '';
        if (hasMultiMonths) {
          const allTabs = ['All', ...uniqueMonths];
          monthTabsHtml = `
            <div style="display: flex; align-items: center; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
              ${allTabs.map(m => {
                const isActive = activeMonth === m;
                return `
                  <button type="button" class="bp-month-tab" data-month="${m}" style="
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid ${isActive ? '#ea580c' : 'transparent'};
                    color: ${isActive ? '#ea580c' : '#78716c'};
                    font-weight: ${isActive ? '700' : '600'};
                    font-size: 12px;
                    padding: 4px 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.15s ease;
                  ">${m}</button>
                `;
              }).join('')}
            </div>
          `;
        }

        // Batch pills HTML
        const pillsHtml = filtered.map(batch => {
          const slotsCount = Number(batch.availableSlots ?? batch.slots ?? 0);
          const isSoldOut = slotsCount <= 0;
          const isSelected = batch.id === selectedBatchId;

          // Live slots badge
          let slotsPillHtml = '';
          if (isSoldOut) {
            slotsPillHtml = '<span style="display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; background-color: #ffe4e6; color: #be123c;">Sold Out</span>';
          } else if (slotsCount <= 5) {
            slotsPillHtml = `<span style="display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; background-color: #fef3c7; color: #92400e;">${slotsCount} spots left</span>`;
          } else {
            slotsPillHtml = `<span style="display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; background-color: #ecfdf5; color: #047857;">${slotsCount} spots left</span>`;
          }

          // Optional badge pill
          const badgeHtml = batch.badge 
            ? `<div style="margin-bottom: 6px;"><span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 2px 8px; border-radius: 9999px; background-color: #fef3c7; color: #92400e;">${batch.badge}</span></div>`
            : '';

          return `
            <div class="bp-batch-item bp-card-hover ${isSoldOut ? 'bp-disabled' : ''}" data-batch-id="${batch.id}" style="
              flex: 1 1 240px;
              min-width: 230px;
              max-width: 330px;
              border: 1.5px solid ${isSelected ? '#ea580c' : '#e7e5e4'};
              background-color: ${isSelected ? 'rgba(255, 247, 237, 0.7)' : '#fafaf9'};
              border-radius: 14px;
              padding: 12px 14px;
              position: relative;
              cursor: ${isSoldOut ? 'not-allowed' : 'pointer'};
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              box-sizing: border-box;
              scroll-snap-align: start;
              opacity: ${isSoldOut ? '0.6' : '1'};
            ">
              ${badgeHtml}
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                <div style="text-align: left; min-width: 0;">
                  <div style="font-size: 13.5px; font-weight: 700; color: #1c1917; line-height: 1.3;">
                    ${batch.date}
                  </div>
                  <div style="margin-top: 5px;">
                    ${slotsPillHtml}
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 13.5px; font-weight: 700; color: #1c1917;">
                    ₹${(batch.price || packageData.price).toLocaleString('en-IN')}
                  </div>
                  <div style="font-size: 11px; font-weight: 700; margin-top: 4px; color: ${isSelected ? '#ea580c' : '#a8a29e'};">
                    ${isSelected ? '✓ Selected' : (isSoldOut ? 'Unavailable' : 'Select')}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        container.innerHTML = `
          <div style="
            background-color: #ffffff;
            border: 1px solid #e7e5e4;
            border-radius: 18px;
            padding: 18px 20px;
            box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
          ">
            <!-- Top Row: Compact Header + Month Tabs -->
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f5f5f4;">
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 20px; font-weight: 800; color: #ea580c; line-height: 1;">₹${displayPrice.toLocaleString('en-IN')}</span>
                <span style="font-size: 12px; font-weight: 500; color: #78716c;">/ person</span>
                ${displayOrigPrice && displayOrigPrice > displayPrice ? `<span style="font-size: 12.5px; font-weight: 500; color: #a8a29e; text-decoration: line-through;">₹${displayOrigPrice.toLocaleString('en-IN')}</span>` : ''}
                <span style="margin-left: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e;">&bull; Select a Batch</span>
              </div>

              ${monthTabsHtml}
            </div>

            <!-- Middle Row: Compact Grid / Scrollable Batch Pills -->
            <div class="bp-batch-scroll bp-batch-grid-md" style="
              display: flex;
              gap: 12px;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              padding: 4px 2px 10px 2px;
              -webkit-overflow-scrolling: touch;
            ">
              ${pillsHtml}
            </div>

            <!-- Bottom Row: Minimal CTA Strip -->
            <div style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
              margin-top: 10px;
              padding-top: 12px;
              border-top: 1px solid #f5f5f4;
            ">
              <div style="font-size: 12px; color: #57534e;">
                <span style="font-weight: 600;">Selected Batch:</span>
                <strong style="color: #1c1917; margin-left: 4px;">${currentSelected.date}</strong>
              </div>

              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <button type="button" id="bp-whatsapp-enquire-btn" style="
                  background-color: #059669;
                  color: #ffffff;
                  font-weight: 600;
                  font-size: 13px;
                  padding: 9px 16px;
                  border-radius: 12px;
                  border: none;
                  cursor: pointer;
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  text-decoration: none;
                  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                  transition: all 0.2s ease;
                ">
                  <svg style="width: 15px; height: 15px; fill: currentColor;" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Enquire via WhatsApp</span>
                </button>

                <button type="button" id="bp-book-now-bar-btn" style="
                  background-color: #ea580c;
                  color: #ffffff;
                  font-weight: 700;
                  font-size: 13.5px;
                  padding: 9.5px 22px;
                  border-radius: 12px;
                  border: none;
                  cursor: pointer;
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                  transition: all 0.2s ease;
                ">
                  <span>Book Now</span>
                  <span style="font-size: 14px;">→</span>
                </button>
              </div>
            </div>
          </div>
        `;

        // Attach Month tab listeners
        const monthTabs = container.querySelectorAll('.bp-month-tab');
        monthTabs.forEach(tab => {
          tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            activeMonth = this.getAttribute('data-month');
            renderSelectorUI();
          });
        });

        // Attach Batch item listeners
        const batchItems = container.querySelectorAll('.bp-batch-item');
        batchItems.forEach(item => {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.classList.contains('bp-disabled')) return;
            const bId = this.getAttribute('data-batch-id');
            selectedBatchId = bId;
            renderSelectorUI();
          });
        });

        // Primary Book Now button listener
        const bookBtn = container.querySelector('#bp-book-now-bar-btn');
        if (bookBtn) {
          bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const chosen = matchingBatches.find(b => b.id === selectedBatchId) || matchingBatches[0];
            if (window.self !== window.top) {
              window.parent.postMessage({
                type: 'OPEN_BOOKING',
                trekId: packageData.id || rawSlug,
                batchDate: chosen.date,
                trekSlug: rawSlug
              }, '*');
            } else {
              window.location.href = `/?trek=${encodeURIComponent(rawSlug)}&book=1&batch=${encodeURIComponent(chosen.id || chosen.date)}`;
            }
          });
        }

        // Secondary WhatsApp Enquire button listener
        const waBtn = container.querySelector('#bp-whatsapp-enquire-btn');
        if (waBtn) {
          waBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const chosen = matchingBatches.find(b => b.id === selectedBatchId) || matchingBatches[0];
            const trekTitle = packageData.title || document.title.split('|')[0].trim();
            const msg = encodeURIComponent(`Hi BOOTpaths! I would like to enquire about the ${trekTitle} trek for the batch ${chosen.date}.`);
            window.open(`https://wa.me/919446102200?text=${msg}`, '_blank', 'noopener,noreferrer');
          });
        }
      }

      renderSelectorUI();
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
