import VisaIcon from '../../../assets/icons/visa.svg';
import MasterIcon from '../../../assets/icons/mastercard.svg';
import AmexIcon from '../../../assets/icons/amex.svg';
import PayToIcon from '../../../assets/icons/payTo.svg';
import PayToIconWhite from '../../../assets/icons/payToWhite.svg';
import AddBank from '../../../assets/icons/addBank.svg';
import AddBankWhite from '../../../assets/icons/addBankWhite.svg';
import AddCard from '../../../assets/icons/addCard.svg';

export interface CreditCardIconProps {
  type?: null | string;
  theme?: 'light' | 'dark';
  width?: number | string;
  height?: number | string;
}

export function CreditCardIcon({
  type,
  theme,
  width,
  height,
}: CreditCardIconProps) {
  const props: { width?: number | string; height?: number | string } = {};
  if (width) props.width = width;
  if (height) props.height = height;

  if (type === 'visa')
    //@ts-ignore
    return <VisaIcon {...props} />;
  else if (type === 'mastercard')
    //@ts-ignore
    return <MasterIcon {...props} />;
  else if (type === 'american_express')
    //@ts-ignore
    return <AmexIcon {...props} />;
  else if (type === 'PAYTO') {
    if (theme === 'dark') {
      return <PayToIconWhite />;
    }

    return <PayToIcon />;
  } else if (type === 'newCard') {
    //if (theme === 'dark') {
    //}
    return <AddCard />;
  } else if (type === 'newBank' || type === 'BANK') {
    if (theme === 'dark') {
      return <AddBankWhite />;
    }
    return <AddBank />;
  } else return null;
}

export default CreditCardIcon;
