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

  function init() {
    renderPolicySection();
    renderFloatingSharePill();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
