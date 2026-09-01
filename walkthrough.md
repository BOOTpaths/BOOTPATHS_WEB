# Walkthrough - Admin Console "BOOKINGS & CANCELLATIONS" Management Tab

Successfully added a full-featured, real-time **BOOKINGS & RESERVATIONS** management tab to the Admin Console in [`src/components/AdminConsole.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/components/AdminConsole.jsx) and updated booking payload handling in [`src/App.jsx`](file:///c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/App.jsx).

---

## 1. Top Navigation Tab Addition
- Added the `BOOKINGS & RESERVATIONS ({activeCount})` tab to the primary tab switcher bar alongside `TREK INVENTORY` and `COMMUNITY BLOGS`.

---

## 2. Top Metric KPI Strip (4 Summary Cards)
- **Confirmed Bookings**: Live count of active bookings with status `Confirmed`.
- **Total Trekkers**: Headcount sum of all `trekkersCount` across active reservations.
- **Cancelled Bookings**: Live count of cancelled bookings.
- **Total Revenue**: Sum of all confirmed payments formatted in INR (`₹` with `toLocaleString('en-IN')`).

---

## 3. Real-Time Data, Filtering & Search
- **Firestore Listener**: Live real-time subscription (`onSnapshot(collection(db, 'bookings'))`) with automatic fallback to initial sample data when starting fresh.
- **Quick Status Filter Strip**: `[All]`, `[Confirmed]`, `[Pending]`, `[Cancelled]` instant toggle buttons.
- **Trek Filter Dropdown**: Dynamic dropdown selecting specific expeditions (e.g. *Silent Valley*, *Netravathi*, *Brahmagiri*).
- **Search Input**: Live filter across customer full names, phone numbers, email addresses, and booking IDs.

---

## 4. Detailed Bookings Data Table
- **LEAD TREKKER**: Full name, email address, booking ID, and direct WhatsApp click-to-chat (`https://wa.me/{phone}`) link.
- **DESTINATION & BATCH**: Trek name and scheduled batch date.
- **HEADCOUNT**: Total persons reserved under the lead trekker.
- **AMOUNT PAID**: Formatted INR price tag and payment ID.
- **STATUS BADGES**: Color-coded indicators (Green for Confirmed, Amber for Pending, Red for Cancelled).
- **ACTIONS**:
  - **Cancel Booking**: Updates status to `Cancelled` in Firestore and returns slots back to `packages` collection.
  - **Confirm Booking**: Sets status to `Confirmed`.
  - **Delete Record**: Prompts confirmation and permanently deletes document from Firestore.

---

## 5. Export Utility
- **Download Batch CSV / Attendance Roster**: Exports the filtered booking list as a formatted `.csv` file (`BOOTpaths_Batch_Roster_YYYY-MM-DD.csv`) for forest department checkpost verification.

---

## 6. Verification & Deployment
- Compiled with zero errors (`npm run build`).
- Committed to `main` branch and deployed live to GitHub Pages.
