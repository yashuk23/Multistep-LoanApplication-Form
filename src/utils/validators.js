
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const PAN_ENTITY_TYPES = new Set([
  "A", // Association of Persons
  "B", // Body of Individuals
  "C", // Company
  "F", // Firm
  "G", // Government
  "H", // Hindu Undivided Family
  "J", // Artificial Juridical Person
  "L", // Local Authority
  "P", // Individual
  "T", // Trust
]);

export function validatePAN(value) {
  const pan = value.trim().toUpperCase();
    
  if (!PAN_REGEX.test(pan)) {
    return {
      valid: false,
      error: "Enter a valid 10-character PAN.",
    };
  }

  if (!PAN_ENTITY_TYPES.has(pan[3])) {
    return {
      valid: false,
      error: "Invalid PAN entity type.",
    };
  }

  return { valid: true, error: "" };
}

// Verhoeff algorithm tables
const D = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0],
];

const P = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8],
];

const INV = [0,4,3,2,1,5,6,7,8,9];

export function validateAadhaar(value) {
  const aadhaar = value.replace(/\s/g, "");

  if (!/^\d{12}$/.test(aadhaar)) {
    return {
      valid: false,
      error: "Aadhaar must contain exactly 12 digits.",
    };
  }

  let checksum = 0;
  const digits = aadhaar.split("").reverse().map(Number);

  for (let i = 0; i < digits.length; i++) {
    checksum = D[checksum][P[i % 8][digits[i]]];
  }

  if (checksum !== 0) {
    return {
      valid: false,
      error: "Aadhaar checksum is invalid.",
    };
  }

  return { valid: true, error: "" };
}

