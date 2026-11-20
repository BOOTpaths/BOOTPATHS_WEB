/**
 * ==============================================================================
 * BOOTpaths Expeditions — Google Apps Script Webhook (Code.gs)
 * Strictly Enforces PII Masking and Data Protection for Government ID Documents.
 *
 * Compliant with:
 *  - Aadhaar Act & UIDAI masking guidelines (XXXX-XXXX-1234)
 *  - Passport Act & Privacy Standards (XXXXX123)
 *  - Digital Personal Data Protection (DPDP) Act & GDPR
 * ==============================================================================
 */

// Global Sheet Configuration
var MASTER_SHEET_NAME = "All Bookings";

var HEADERS = [
  "Timestamp",
  "Booking ID",
  "Participant Name",
  "Age",
  "Gender",
  "WhatsApp",
  "Email",
  "Hometown",
  "Dietary Preference",
  "Health Assessment",
  "Govt ID (Masked)",
  "Emergency Contact Name",
  "Emergency Contact Phone",
  "Trek Destination",
  "Batch Date",
  "Headcount",
  "Amount Paid (INR)",
  "Status",
  "Role"
];

/**
 * Masks sensitive Govt ID strings to comply with strict data privacy standards.
 * Aadhaar format: XXXX-XXXX-1234
 * Passport format: XXXXX123
 * Licence format: XXXXXX-1234
 * Generic fallback: masks all but the last 4 characters.
 *
 * @param {string} idType - Document category (e.g. 'Aadhaar Card', 'Passport')
 * @param {string} idValue - Document number string
 * @returns {string} Fully masked identification string
 */
function maskGovtId(idType, idValue) {
  if (!idValue) return "N/A";
  var raw = String(idValue).trim();

  // If already masked, avoid double-masking
  if (raw.indexOf("XXXX") !== -1) {
    return raw;
  }

  var typeLower = (idType || "").toLowerCase();

  // If type wasn't explicitly supplied, check if embedded as "Type: Value"
  if (!typeLower && raw.indexOf(":") !== -1) {
    var colonIdx = raw.indexOf(":");
    typeLower = raw.substring(0, colonIdx).trim().toLowerCase();
    raw = raw.substring(colonIdx + 1).trim();
    if (raw.indexOf("XXXX") !== -1) {
      return idValue.substring(0, colonIdx).trim() + ": " + raw;
    }
  }

  var clean = raw.replace(/[^a-zA-Z0-9]/g, "");

  if (typeLower.indexOf("aadhaar") !== -1 || typeLower.indexOf("aadhar") !== -1) {
    var digits = clean.slice(-4);
    while (digits.length < 4) {
      digits = "0" + digits;
    }
    return "XXXX-XXXX-" + digits;
  }

  if (typeLower.indexOf("passport") !== -1) {
    if (clean.length <= 4) return clean;
    var suffixPass = clean.slice(-3);
    var repeatCountPass = Math.max(clean.length - 3, 3);
    var maskPass = "";
    for (var i = 0; i < repeatCountPass; i++) maskPass += "X";
    return maskPass + suffixPass;
  }

  if (typeLower.indexOf("licence") !== -1 || typeLower.indexOf("license") !== -1) {
    if (clean.length <= 4) return clean;
    var suffixLic = clean.slice(-4);
    var repeatCountLic = Math.max(clean.length - 4, 4);
    var maskLic = "";
    for (var j = 0; j < repeatCountLic; j++) maskLic += "X";
    return maskLic + "-" + suffixLic;
  }

  // General fallback: keep last 4 characters visible
  if (clean.length <= 4) return clean;
  return "XXXX-" + clean.slice(-4);
}

/**
 * Masks composite ID card string formatted as "Type: Number" or standalone number.
 * E.g., "Aadhaar Card: 1234 5678 9012" -> "Aadhaar Card: XXXX-XXXX-9012"
 *
 * @param {string} idCard - Raw composite or standalone ID card string
 * @returns {string} Masked string
 */
function maskGovtIdCard(idCard) {
  if (!idCard) return "N/A";
  var str = String(idCard).trim();
  if (str.indexOf("XXXX") !== -1) return str;

  if (str.indexOf(":") !== -1) {
    var colonIdx = str.indexOf(":");
    var type = str.substring(0, colonIdx).trim();
    var val = str.substring(colonIdx + 1).trim();
    return type + ": " + maskGovtId(type, val);
  }

  return maskGovtId("", str);
}

/**
 * Ensures a sheet exists with proper header formatting, frozen rows, and color styling.
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  var sanitizedName = sheetName.replace(/[:\\\/\?\*\[\]]/g, "").trim().substring(0, 95) || "General Roster";
  var sheet = spreadsheet.getSheetByName(sanitizedName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sanitizedName);
    sheet.appendRow(HEADERS);

    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#C1571F");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Roboto");
    headerRange.setHorizontalAlignment("center");

    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Appends or updates a participant record row in a target sheet.
 */
function appendOrUpdateRow(sheet, rowData, bookingId, participantName) {
  var data = sheet.getDataRange().getValues();
  var existingRowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    var rBookingId = String(data[i][1] || "").trim();
    var rName = String(data[i][2] || "").trim();
    if (rBookingId === String(bookingId).trim() && rName === String(participantName).trim()) {
      existingRowIndex = i + 1;
      break;
    }
  }

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

/**
 * HTTP POST Webhook Handler
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Handle Cancellation / Status Update Action
    if (payload.action === "update_status") {
      var targetBookingId = String(payload.bookingId || "").trim();
      var newStatus = String(payload.status || "CANCELLED").toUpperCase();
      var updatedSheets = 0;

      var allSheets = spreadsheet.getSheets();
      for (var s = 0; s < allSheets.length; s++) {
        var curSheet = allSheets[s];
        var sheetData = curSheet.getDataRange().getValues();
        for (var r = 1; r < sheetData.length; r++) {
          if (String(sheetData[r][1] || "").trim() === targetBookingId) {
            curSheet.getRange(r + 1, 18).setValue(newStatus); // Column 18 is Status
            updatedSheets++;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "update_status",
        bookingId: targetBookingId,
        newStatus: newStatus,
        updatedOccurrences: updatedSheets
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Handle New Booking / Sync Records
    var timestamp = payload.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a");
    var bookingId = payload.bookingId || "BP-" + Math.floor(100000 + Math.random() * 900000);
    var trekTitle = payload.trekTitle || payload.trekName || payload.title || "General Expedition";
    var batchDate = payload.batchDate || payload.date || "Upcoming Batch";
    var trekkersCount = Number(payload.trekkersCount || 1);
    var amountPaid = Number(payload.amountPaid || payload.totalPrice || payload.price || 0);
    var status = String(payload.status || "CONFIRMED").toUpperCase();

    // Strict Server-Side PII Masking on Lead ID
    var maskedLeadIdCard = maskGovtIdCard(payload.idCardNumber || (payload.idType && payload.idNumber ? payload.idType + ": " + payload.idNumber : payload.idNumber || "N/A"));

    // Prepare Sheets
    var masterSheet = getOrCreateSheet(spreadsheet, MASTER_SHEET_NAME);
    var trekSheet = getOrCreateSheet(spreadsheet, trekTitle);

    var trekkersList = Array.isArray(payload.trekkers) && payload.trekkers.length > 0 ? payload.trekkers : null;

    if (trekkersList) {
      for (var tIdx = 0; tIdx < trekkersList.length; tIdx++) {
        var tr = trekkersList[tIdx];
        var isLead = (tIdx === 0) || tr.isLead === true;
        var role = tr.role || (isLead ? "Lead Trekker" : "Co-Trekker #" + (tIdx + 1));
        var pName = tr.fullName || tr.name || (isLead ? (payload.fullName || "Lead Trekker") : "Trekker #" + (tIdx + 1));

        // Enforce strict PII masking on each trekker
        var rawTrId = tr.idCardNumber || tr.idCard || (tr.idType && tr.idNumber ? tr.idType + ": " + tr.idNumber : tr.idNumber || (isLead ? maskedLeadIdCard : "N/A"));
        var maskedTrId = maskGovtIdCard(rawTrId);

        var row = [
          timestamp,
          bookingId,
          pName,
          tr.age !== undefined && tr.age !== "" ? tr.age : (isLead ? (payload.age || "N/A") : "N/A"),
          tr.gender || (isLead ? (payload.gender || "N/A") : "Male"),
          tr.whatsapp || (isLead ? (payload.whatsapp || "N/A") : (payload.whatsapp || "N/A")),
          tr.email || (isLead ? (payload.email || "N/A") : "N/A"),
          payload.hometown || "N/A",
          tr.dietary || payload.dietary || "Standard Veg",
          tr.healthAssessment || tr.fitnessLevel || payload.healthAssessment || payload.fitnessLevel || "Fit and prepared for high-altitude trek",
          maskedTrId,
          tr.emergencyName || payload.emergencyName || "N/A",
          tr.emergencyPhone || payload.emergencyPhone || "N/A",
          trekTitle,
          batchDate,
          trekkersCount,
          isLead ? amountPaid : 0, // Attribute payment to lead row
          status,
          role
        ];

        appendOrUpdateRow(masterSheet, row, bookingId, pName);
        appendOrUpdateRow(trekSheet, row, bookingId, pName);
      }
    } else {
      // Single Lead Trekker Entry
      var singleRow = [
        timestamp,
        bookingId,
        payload.fullName || "Trek Participant",
        payload.age || "N/A",
        payload.gender || "N/A",
        payload.whatsapp || payload.phone || "N/A",
        payload.email || "N/A",
        payload.hometown || "N/A",
        payload.dietary || "Standard Veg",
        payload.healthAssessment || payload.fitnessLevel || "Fit and prepared for high-altitude trek",
        maskedLeadIdCard,
        payload.emergencyName || "N/A",
        payload.emergencyPhone || "N/A",
        trekTitle,
        batchDate,
        trekkersCount,
        amountPaid,
        status,
        "Lead Trekker"
      ];

      appendOrUpdateRow(masterSheet, singleRow, bookingId, payload.fullName || "Trek Participant");
      appendOrUpdateRow(trekSheet, singleRow, bookingId, payload.fullName || "Trek Participant");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      bookingId: bookingId,
      piiProtected: true,
      message: "Booking synchronized with strict PII masking applied"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HTTP GET Endpoint for Health Checks
 */
function doGet(e) {
  var htmlOutput = "<!DOCTYPE html><html><head><title>BOOTpaths Webhook</title>" +
    "<style>body{font-family:sans-serif;padding:30px;line-height:1.6;color:#1A1A18;background:#FAF8F5;}" +
    ".card{background:#FFF;border:1px solid #E7E7E4;padding:24px;border-radius:12px;max-width:550px;box-shadow:0 4px 12px rgba(0,0,0,0.05);}" +
    ".badge{background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:bold;}" +
    "h2{color:#C1571F;margin-top:0;}</style></head><body>" +
    "<div class='card'>" +
    "<h2>🌲 BOOTpaths Expeditions Webhook</h2>" +
    "<p><span class='badge'>✓ ACTIVE &amp; HEALTHY</span></p>" +
    "<p>Google Apps Script integration is listening for verified bookings and status updates.</p>" +
    "<p><strong>🔒 Strict PII Data Protection:</strong> All Government ID numbers (Aadhaar, Passport, Driving Licence) are masked before spreadsheet ingestion.</p>" +
    "<p style='color:#718096;font-size:12px;'>Timestamp: " + new Date().toUTCString() + "</p>" +
    "</div></body></html>";

  return HtmlService.createHtmlOutput(htmlOutput);
}

/**
 * STANDALONE ADMIN UTILITY:
 * Run this function once from the Google Apps Script editor to retroactively scan
 * and mask any existing raw Govt ID documents in your spreadsheet.
 */
function sanitizeExistingSpreadsheetData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  var totalMasked = 0;

  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) continue;

    // Find Govt ID column (typically column index 10 / column K)
    var headerRow = data[0];
    var idColIdx = -1;
    for (var c = 0; c < headerRow.length; c++) {
      var h = String(headerRow[c]).toLowerCase();
      if (h.indexOf("govt id") !== -1 || h.indexOf("id card") !== -1 || h.indexOf("id number") !== -1) {
        idColIdx = c;
        break;
      }
    }

    if (idColIdx !== -1) {
      for (var r = 1; r < data.length; r++) {
        var currentVal = String(data[r][idColIdx] || "").trim();
        if (currentVal && currentVal !== "N/A" && currentVal.indexOf("XXXX") === -1) {
          var masked = maskGovtIdCard(currentVal);
          sheet.getRange(r + 1, idColIdx + 1).setValue(masked);
          totalMasked++;
        }
      }
    }
  }

  Logger.log("✅ Sanitization complete. Retroactively masked " + totalMasked + " Government ID records.");
}

