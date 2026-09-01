# Walkthrough - Force Sync to Google Sheets & Live Webhook Integration

Successfully added the **"Force Sync Existing Bookings to Google Sheets"** feature to [`src/components/AdminConsole.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/components/AdminConsole.jsx) and verified automatic live syncing on fresh bookings in [`src/App.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/App.jsx):

---

## 1. Webhook Endpoint Configuration
- **Endpoint Constant**:
  `const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec";`

---

## 2. Sync All Handler (`handleSyncAllToSheets`)
- Added asynchronous loop handler in `AdminConsole.jsx`:
  * Prompts administrator confirmation before bulk syncing.
  * Shows spinning loading state (`isSyncingSheets` state on button).
  * Sends individual POST payloads with `mode: 'no-cors'`:
    ```javascript
    for (const b of listToSync) {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: b.id || b.bookingId || "BP-REF",
          fullName: b.userName || b.fullName || b.name || "Trek Participant",
          email: b.userEmail || b.email || "N/A",
          phone: b.userPhone || b.phone || "N/A",
          trekName: b.title || b.trekName || b.destination || "N/A",
          batchDate: b.date || b.batchDate || "N/A",
          trekkersCount: b.trekkers || b.trekkersCount || b.slots || 1,
          totalPrice: b.price || b.totalPrice || b.amount || 0,
          status: (b.status || "CONFIRMED").toUpperCase()
        })
      });
    }
    ```
  * Displays success notification: `"Google Sheet successfully synced with all X past and current bookings!"`

---

## 3. UI Button in Admin Console Header
- Positioned alongside **"📊 OPEN GOOGLE SPREADSHEET"**:
  ```jsx
  <button
    onClick={handleSyncAllToSheets}
    disabled={isSyncingSheets}
    className="bg-white border border-[#E7E7E4] hover:bg-[#FAF8F5] text-[#1A1A18] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer font-outfit disabled:opacity-50"
    title="Export all past and current Firestore bookings to Google Sheets"
  >
    <RefreshCw className={`h-4 w-4 text-[#C1571F] ${isSyncingSheets ? 'animate-spin' : ''}`} />
    <span>{isSyncingSheets ? 'Syncing...' : '🔄 Sync Existing Bookings'}</span>
  </button>
  ```

---

## 4. Verification of Real-Time Fresh Booking Trigger
- Confirmed that in `src/App.jsx` (`handleBookingSuccess`), every new reservation automatically fires a non-blocking POST request to the Google Apps Script Web App so new bookings show up live in the Google Sheet automatically without manual sync needed.

---

## 5. Build & Deployment
- Zero compilation errors (`npm run build`).
- Committed to `main` branch and deployed live to GitHub Pages.
