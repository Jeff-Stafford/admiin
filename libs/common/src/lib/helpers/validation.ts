// for tax bills, checks if the reference is valid
export const isValidPRN = (prn: string): boolean => {
  // Check if PRN is the correct length and numeric
  if (!/^\d{16,18}$/.test(prn)) {
    return false;
  }

  // Ensure PRN is 18 characters long, padding with leading zeros if needed
  const paddedPRN = prn.padStart(18, '0');

  // Extract parts of the PRN
  const first14Digits = paddedPRN.substring(0, 14);
  const checkDigits = parseInt(paddedPRN.substring(14, 16), 10);
  const last2Digits = paddedPRN.substring(16);

  // Calculate check digit
  const weights = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    sum += parseInt(first14Digits.charAt(i), 10) * weights[i];
  }
  // Adding the last 2 digits to the sum
  sum +=
    parseInt(last2Digits.charAt(0), 10) * weights[14] +
    parseInt(last2Digits.charAt(1), 10) * weights[15];

  const calculatedCheckDigit = 97 - (sum % 97);

  // Compare the calculated check digit with the one in the PRN
  return checkDigits === calculatedCheckDigit;
};

export const isValidABN = (abn?: string | null): boolean => {
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  // check if exists and is 11 characters
  if (!abn || abn.length !== 11) {
    return false;
  }

  // ato check method
  let sum = 0;
  weights.forEach((weight, position) => {
    const digit = Number(abn[position]) - (position ? 0 : 1);
    sum += weight * digit;
  });

  const checksum = sum % 89;
  return checksum === 0;
};
