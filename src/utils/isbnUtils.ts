/**
 * ISBN Handling & Truth Layer Utility
 *
 * Implements structural format and check-digit validation for ISBN-10 and ISBN-13.
 * IMPORTANT: Valid structural format does NOT verify or imply official registry issuance.
 */

export type ISBNStatus = 'Not Assigned' | 'Entered by Author/Publisher' | 'Validated Format';

export interface ISBNValidationResult {
  status: ISBNStatus;
  isValidFormat: boolean;
  formatted: string;
  message: string;
  isRegisteredProof: boolean; // Always false; programmatic checking cannot prove official agency issuance
}

/**
 * Validates whether an ISBN has a structurally valid ISBN-10 or ISBN-13 format
 * and checksum, without asserting official registry registration.
 */
export function validateISBN(rawISBN?: string | null): ISBNValidationResult {
  if (!rawISBN || !rawISBN.trim()) {
    return {
      status: 'Not Assigned',
      isValidFormat: false,
      formatted: 'Not Assigned',
      message: 'No ISBN assigned to this project yet.',
      isRegisteredProof: false,
    };
  }

  const trimmed = rawISBN.trim();

  // Recognize placeholder or unassigned values
  if (
    trimmed.toUpperCase() === 'NOT ASSIGNED' ||
    trimmed.toUpperCase() === 'PENDING' ||
    trimmed.includes('XXXX') ||
    trimmed.includes('000000')
  ) {
    return {
      status: 'Not Assigned',
      isValidFormat: false,
      formatted: 'Not Assigned',
      message: 'No official ISBN assigned. Pending cataloging.',
      isRegisteredProof: false,
    };
  }

  // Strip hyphens and spaces
  const clean = trimmed.replace(/[-\s]/g, '').toUpperCase();

  // Check for ISBN-13
  if (/^\d{13}$/.test(clean)) {
    // Must start with 978 or 979
    if (!clean.startsWith('978') && !clean.startsWith('979')) {
      return {
        status: 'Entered by Author/Publisher',
        isValidFormat: false,
        formatted: trimmed,
        message: 'ISBN-13 must start with 978 or 979 bookland prefix.',
        isRegisteredProof: false,
      };
    }

    // Checksum modulo 10
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const isValid = checkDigit === parseInt(clean[12], 10);

    // Format as 978-X-XX-XXXXXX-X roughly for display
    const formatted = `${clean.slice(0, 3)}-${clean.slice(3, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 12)}-${clean.slice(12)}`;

    if (isValid) {
      return {
        status: 'Validated Format',
        isValidFormat: true,
        formatted,
        message: 'Format Validated: Structurally valid ISBN-13 checksum. (Does not verify official registry issuance).',
        isRegisteredProof: false,
      };
    } else {
      return {
        status: 'Entered by Author/Publisher',
        isValidFormat: false,
        formatted: trimmed,
        message: `Invalid ISBN-13 check digit (expected ${checkDigit}, got ${clean[12]}). Kept as author draft.`,
        isRegisteredProof: false,
      };
    }
  }

  // Check for ISBN-10
  if (/^\d{9}[\dX]$/.test(clean)) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean[i], 10) * (10 - i);
    }
    const lastChar = clean[9];
    const checkValue = lastChar === 'X' ? 10 : parseInt(lastChar, 10);
    sum += checkValue;
    const isValid = sum % 11 === 0;

    const formatted = `${clean.slice(0, 1)}-${clean.slice(1, 4)}-${clean.slice(4, 9)}-${clean.slice(9)}`;

    if (isValid) {
      return {
        status: 'Validated Format',
        isValidFormat: true,
        formatted,
        message: 'Format Validated: Structurally valid ISBN-10 checksum. (Does not verify official registry issuance).',
        isRegisteredProof: false,
      };
    } else {
      return {
        status: 'Entered by Author/Publisher',
        isValidFormat: false,
        formatted: trimmed,
        message: 'Invalid ISBN-10 checksum. Stored as author draft entry.',
        isRegisteredProof: false,
      };
    }
  }

  // Non-conforming syntax entered by user
  return {
    status: 'Entered by Author/Publisher',
    isValidFormat: false,
    formatted: trimmed,
    message: 'Custom or provisional identifier. Stored as entered by author/publisher.',
    isRegisteredProof: false,
  };
}
