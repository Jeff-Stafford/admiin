export function maskCreditCardNumberSimple(creditCardNumber: string): string {
  // Ensure we're working with digits only for consistency
  const digitsOnly = creditCardNumber.replace(/\D/g, '');

  // Check if we have at least 4 digits to work with
  if (digitsOnly.length < 4) {
    // Return the original string or handle it as needed
    return creditCardNumber;
  }

  // Extract the last 4 digits
  const lastFourDigits = digitsOnly.slice(-4);

  // Return the masked string with 4 dots and the last 4 digits
  return `•••• ${lastFourDigits}`;
}
