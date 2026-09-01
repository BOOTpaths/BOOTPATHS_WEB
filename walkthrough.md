# Walkthrough - Google Sheet Webhook Sync Integration

Successfully connected the BOOTpaths booking flow and cancellation system to automatically sync with the Google Sheet webhook:

---

## 1. Webhook Endpoint
- **Active Web App URL**:
  `https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec`

---

## 2. Sync on Booking Reservation ([`src/App.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/App.jsx))
- Upon successful payment/reservation in `handleBookingSuccess`, a background non-blocking POST request sends the new booking payload:
  ```javascript
  fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingId: newBookingId,
      fullName: name || user?.name || "Trek Participant",
      email: email || user?.email || "N/A",
      phone: phone || user?.phone || "N/A",
      trekName: newRecord.title,
      batchDate: newRecord.date,
      trekkersCount: newRecord.trekkersCount || 1,
      totalPrice: newRecord.totalPrice || amount || 0,
      status: "CONFIRMED"
    })
  }).catch((err) => console.error("Google Sheet Sync Error:", err));
  ```

---

## 3. Sync on Booking Cancellation ([`src/components/AdminConsole.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/components/AdminConsole.jsx))
- When an administrator cancels a booking in `handleCancelBooking`:
  * Updates Firestore booking status to `"Cancelled"`.
  * Returns available slots back to the package document in `packages`.
  * Sends an update payload to the webhook:
    ```javascript
    fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_status",
        bookingId: booking.id,
        status: "CANCELLED"
      })
    }).catch((err) => console.error("Sheet Cancellation Sync Error:", err));
    ```

---

## 4. Admin Console Spreadsheet Link
- Added a **"📊 Open Google Spreadsheet"** action button in the Bookings tab header:
  ```jsx
  <button
    onClick={() => window.open("https://script.google.com/macros/s/AKfycbznKeKp7ZVY6cKEOoAdmQTedaBA5TcLJo4Yi_oMjAGsUtf8k3ejsVXra95mYT0MBhM/exec", "_blank")}
    className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer font-outfit"
  >
    <span>📊 Open Google Spreadsheet</span>
  </button>
  ```

---

## 5. Verification & Deployment
- `mode: 'no-cors'` is strictly preserved to prevent CORS blocking.
- Verified build via `npm run build` (0 errors).
- Committed changes and published live to GitHub Pages.
