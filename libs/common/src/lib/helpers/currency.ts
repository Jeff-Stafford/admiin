export const numberWithCommasDecimals = (number: number) => {
  return number
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const numberToCurrency = (
  number: number,
  currency: string = 'AUD' as const,
  locale: string = 'en-GB' as const
) => {
  let result = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(number);

  // If the currency is AUD, remove the 'A' from the currency symbol
  if (currency === 'AUD') {
    result = result.replace('A$', '$');
  }

  return result;
};
