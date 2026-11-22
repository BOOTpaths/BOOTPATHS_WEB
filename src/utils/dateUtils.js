/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * Date and Expedition Status Utilities.
 */

/**
 * Evaluates whether a trek date string has already passed (strictly before today).
 * Supports standard formats: "September 8, 2026", "2026-09-08", "Oct 10, 2026", etc.
 *
 * @param {string} dateString
 * @returns {boolean} True if the date has passed
 */
export const isTrekCompleted = (dateString) => {
  if (!dateString) return false;
  const trekDate = new Date(dateString);
  if (isNaN(trekDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  trekDate.setHours(0, 0, 0, 0);

  return trekDate < today;
};

