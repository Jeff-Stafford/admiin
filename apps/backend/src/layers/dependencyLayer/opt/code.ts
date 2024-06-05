export const generate5DigitNumber = () => {
  const random = Math.random();
  return Math.floor(random * 90000) + 10000;
};

export interface CurrencyNumberProps {
  amount: number;
  locale?: string;
  currency?: string;
  //precision?: number;
}

export const currencyNumber = ({
  amount,
  locale = 'en-GB',
  currency = 'AUD',
}: //precision = 2
CurrencyNumberProps) => {
  let formattedNumber = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);

  if (currency === 'AUD') {
    formattedNumber = formattedNumber.replace('A$', '$');
  }

  return formattedNumber;
};
