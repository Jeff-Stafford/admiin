import { WBTypography } from '@admiin-com/ds-web';
import { TypographyProps } from '@mui/material';

interface CurrencyNumberProps extends TypographyProps {
  number: number;
  locale?: string;
  currency?: string;
  sup?: boolean;
  precision?: number;
}

export function CurrencyNumber({
  number,
  sup = true,
  locale = 'en-GB',
  currency = 'AUD',
  precision = 2,
  ...props
}: CurrencyNumberProps) {
  let formattedNumber = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(number);

  if (currency === 'AUD') {
    formattedNumber = formattedNumber.replace('A$', '$');
  }

  return (
    <WBTypography fontWeight="bold" color="inherit" {...props}>
      {formattedNumber.split('.')[0]}
      {sup ? (
        <sup
          style={{ fontSize: '0.5em', verticalAlign: 'super', marginLeft: 3 }}
        >
          {formattedNumber.split('.')[1]?.slice(0, precision)}
        </sup>
      ) : (
        `.${formattedNumber.split('.')[1]?.slice(0, precision)}`
      )}
    </WBTypography>
  );
}
