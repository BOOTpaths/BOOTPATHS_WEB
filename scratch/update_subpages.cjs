const fs = require('fs');
const path = require('path');

const TREK_MAPPING = {
  'agasthyarkoodam': { id: 'agasthyarkoodam', name: 'Agasthyarkoodam Wilderness Trek', price: '4,500' },
  'arippa': { id: 'arippa', name: 'Arippa Ecotourism Forest Walk', price: '2,200' },
  'athirapally': { id: 'athirapally', name: 'Athirapally Waterfall & Jungle Trail', price: '1,800' },
  'banasura': { id: 'banasura', name: 'Banasura Hill Expedition', price: '3,200' },
  'brahmagiri': { id: 'brahmagiri', name: 'Brahmagiri Peak Trek', price: '3,899' },
  'chimmini-amphi': { id: 'chimmini-amphi', name: 'Chimmini Amphitheatre Trek', price: '2,500' },
  'chimmini-climate-walk': { id: 'chimmini-climate-walk', name: 'Chimmini Climate Awareness Walk', price: '1,999' },
  'chokkramudi': { id: 'chokkramudi', name: 'Chokramudi Peak Trail', price: '2,800' },
  'ebc-trek': { id: 'ebc-trek', name: 'Everest Base Camp Trek', price: '48,000' },
  'gavi': { id: 'gavi', name: 'Gavi Eco Wilderness Trail', price: '3,400' },
  'goachala-pass': { id: 'goechala', name: 'Goechala Pass Expedition', price: '18,500' },
  'kathirmudi': { id: 'kathirmudi', name: 'Kathirmudi Hill Trek', price: '2,100' },
  'kilimanjaro': { id: 'kilimanjaro', name: 'Mount Kilimanjaro Expedition', price: '1,75,000' },
  'kolukkumala': { id: 'kolukkumala', name: 'Kolukkumalai Sunrise & Ridge Trek', price: '2,999' },
  'meeshapulimala': { id: 'meeshapulimala', name: 'Meeshapulimala Peak Trek', price: '4,200' },
  'mt.elbrus': { id: 'mt-elbrus', name: 'Mount Elbrus Summit Expedition', price: '1,45,000' },
  'parambikulam': { id: 'parambikulam', name: 'Parambikulam Tiger Trail', price: '3,600' },
  'peechimoodal': { id: 'peechimoodal', name: 'Peechi Moodal Forest Trail', price: '1,850' },
  'periyar-boarder': { id: 'periyar-boarder', name: 'Periyar Border Hiking & Bamboo Rafting', price: '3,900' },
  'silent-valley': { id: 'silent-valley', name: 'Silent Valley Rainforest Expedition', price: '4,000' },
  'thommankuthu': { id: 'thommankuthu', name: 'Thommankuthu 7-Step Waterfall Trek', price: '1,750' },
  'yellapatty': { id: 'yellapatty', name: 'Yellapatty Cloud Forest Trek', price: '2,400' }
};

const treksDir = path.resolve('public/treks');

function getTrekKey(filePath) {
  const rel = path.relative(treksDir, filePath).toLowerCase().replace(/\\/g, '/');
  const parts = rel.split('/');
  return parts[0];
}

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allHtmlFiles = findHtmlFiles(treksDir);
console.log(`Found ${allHtmlFiles.length} HTML files in public/treks`);

for (const filePath of allHtmlFiles) {
  const key = getTrekKey(filePath);
  const info = TREK_MAPPING[key] || { id: key, name: 'Wilderness Trek', price: '3,500' };
  const trekId = info.id;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace all href="#booking" with href="/?book=<trekId>"
  content = content.replace(/href="#booking"/g, `href="/?book=${trekId}"`);

  // 2. Look for static booking form in the file and replace with CTA banner if form exists
  // Match forms like <form ... onsubmit="sf(event)"...> or <form class="bwc-form" ...> etc. inside booking section
  // Specifically check for forms in .bk-form-wrap, .bw-form-card, etc.
  
  // Custom replacements for specific trek layouts:
  // Meeshapulimala
  if (content.includes('class="bw-form-card"')) {
    const ctaBanner = `
        <div class="bw-form-card" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: center; gap: 1.25rem; background: #fff; border-radius: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="background: rgba(235, 90, 13, 0.15); color: #EB5A0D; border: 1px solid rgba(235, 90, 13, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
              ⚡ Live Slot Reservation
            </span>
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #1A1A18; margin: 0; line-height: 1.25;">
            Upcoming Batches &amp; Instant Booking
          </h3>
          <p style="font-size: 0.875rem; color: #52524E; margin: 0; line-height: 1.5;">
            Check real-time batch dates, configure multi-trekker participant details, and secure verified forest permits directly through the central BOOTpaths platform.
          </p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; color: #2D2D2A;">
            <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> 100% Verified Forest Department Permits</li>
            <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> Multi-Trekker Roster Registration</li>
            <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> Instant Razorpay Web Checkout &amp; Immediate Receipt</li>
          </ul>
          <a href="/?book=${trekId}" class="form-submit-btn" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 1.5rem; background: #EB5A0D; color: #fff; border-radius: 12px; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 14px rgba(235, 90, 13, 0.35);">
            <span>Book Now &amp; Check Slots</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-7.85-1.42 1.42L16.86 11H5v2z"/></svg>
          </a>
          <p class="form-note" style="text-align: center; margin: 0; font-size: 0.75rem; color: #787873;">🔒 Direct checkout via central BOOTpaths portal. Instant confirmation.</p>
        </div>`;
    content = content.replace(/<div class="bw-form-card">[\s\S]*?<\/form>\s*<\/div>/, ctaBanner.trim());
  }

  // Silent Valley single-pkg-card Book at button
  if (content.includes('class="spc-cta-row"') && !content.includes(`href="/?book=${trekId}"`)) {
    content = content.replace(
      /<a href="https:\/\/wa\.me\/[^"]*"\s+target="_blank"\s+rel="noopener"\s+class="btn-p btn-spc">([^<]*)<\/a>/,
      `<a href="/?book=${trekId}" class="btn-p btn-spc" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">Book Now &amp; Check Slots</a>`
    );
  }

  // Generic check for other pages with <form class="bk-form" ...>
  if (content.includes('<div class="bk-form-wrap">') && content.includes('<form class="bk-form"')) {
    const ctaBanner = `
          <div class="bk-form-wrap" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 1.25rem; padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: center; gap: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: rgba(235, 90, 13, 0.2); color: #EB5A0D; border: 1px solid rgba(235, 90, 13, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                ⚡ Live Slot Reservation
              </span>
            </div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0; line-height: 1.25;">
              Upcoming Batches &amp; Instant Booking
            </h3>
            <p style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.5;">
              Check live batch vacancies, select departure dates, add co-trekkers, and secure verified permits via the central BOOTpaths checkout portal.
            </p>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.9);">
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> 100% Verified Forest Department Permits</li>
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> Multi-Trekker Roster &amp; Group Slot Selection</li>
              <li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10B981; font-weight: bold;">✓</span> Instant Razorpay Web Checkout &amp; Immediate Receipt</li>
            </ul>
            <a href="/?book=${trekId}" class="btn-sub" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; padding: 1rem 1.5rem; background: #EB5A0D; color: #fff; border-radius: 0.75rem; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(235, 90, 13, 0.4);">
              <span>Book Now &amp; Check Slots</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-7.85-1.42 1.42L16.86 11H5v2z"/></svg>
            </a>
          </div>`;
    content = content.replace(/<div class="bk-form-wrap">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, `${ctaBanner.trim()}\n        </div>\n      </div>\n    </div>\n  </section>`);
  }

  // Ensure any direct "Book at ₹..." buttons in package cards also point to /?book=<trekId>
  content = content.replace(/<a href="https:\/\/wa\.me\/[^"]*book[^"]*"\s+([^>]*)class="btn-p btn-spc">/gi, `<a href="/?book=${trekId}" $1class="btn-p btn-spc">`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath} -> trekId: ${trekId}`);
}
