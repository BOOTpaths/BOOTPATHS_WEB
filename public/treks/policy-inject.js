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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPolicySection);
  } else {
    renderPolicySection();
  }
})();
