/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * PII Data Masking and Protection Utility.
 * Complies with data privacy regulations (e.g., Aadhaar Act, GDPR, DPDP Act)
 * by masking sensitive Government Identity Documents across client views,
 * Firestore storage, and Google Sheets synchronization.
 */

/**
 * Masks sensitive Govt ID strings to comply with data privacy standards.
 * Aadhaar format: XXXX-XXXX-1234
 * Passport format: XXXXX123
 * Driving Licence format: XXXXXX-1234
 * Generic fallback: masks all but the last 4 characters.
 *
 * @param {string} idType - Document category (e.g. 'Aadhaar Card', 'Passport', 'Driving Licence', 'Voter ID')
 * @param {string} idValue - Raw or formatted identification number
 * @returns {string} Fully masked identification string
 */
export function maskGovtId(idType = "", idValue = "") {
  if (!idValue) return "N/A";
  let raw = String(idValue).trim();

  // If already masked, avoid double masking
  if (raw.includes("XXXX")) return raw;

  let typeLower = (idType || "").toLowerCase();

  // If type wasn't explicitly supplied, check if embedded as "Type: Value"
  if (!typeLower && raw.includes(":")) {
    const splitIndex = raw.indexOf(":");
    typeLower = raw.substring(0, splitIndex).trim().toLowerCase();
    raw = raw.substring(splitIndex + 1).trim();
    // If extracted value was already masked
    if (raw.includes("XXXX")) return `${idValue.substring(0, splitIndex).trim()}: ${raw}`;
  }

  const clean = raw.replace(/[^a-zA-Z0-9]/g, "");

  if (typeLower.includes("aadhaar") || typeLower.includes("aadhar")) {
    const digits = clean.slice(-4);
    return `XXXX-XXXX-${digits.padStart(4, "0")}`;
  }

  if (typeLower.includes("passport")) {
    if (clean.length <= 4) return clean;
    const visibleSuffix = clean.slice(-3);
    return `${"X".repeat(Math.max(clean.length - 3, 3))}${visibleSuffix}`;
  }

  if (typeLower.includes("licence") || typeLower.includes("license")) {
    if (clean.length <= 4) return clean;
    const visibleSuffix = clean.slice(-4);
    return `${"X".repeat(Math.max(clean.length - 4, 4))}-${visibleSuffix}`;
  }

  // General fallback: keep last 4 characters visible
  if (clean.length <= 4) return clean;
  return `XXXX-${clean.slice(-4)}`;
}

/**
 * Masks composite ID card string formatted as "Type: Number" or standalone number.
 * E.g., "Aadhaar Card: 1234 5678 9012" -> "Aadhaar Card: XXXX-XXXX-9012"
 *
 * @param {string} idCard - The composite or standalone ID card string
 * @returns {string} Masked ID card representation
 */
export function maskGovtIdCard(idCard = "") {
  if (!idCard) return "N/A";
  const str = String(idCard).trim();
  if (str.includes("XXXX")) return str;

  if (str.includes(":")) {
    const splitIndex = str.indexOf(":");
    const type = str.substring(0, splitIndex).trim();
    const val = str.substring(splitIndex + 1).trim();
    return `${type}: ${maskGovtId(type, val)}`;
  }

  return maskGovtId("", str);
}

/**
 * Returns whether an ID string contains a masked pattern.
 *
 * @param {string} val
 * @returns {boolean}
 */
export function isMasked(val = "") {
  return String(val || "").includes("XXXX");
}

