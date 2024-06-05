import { WBFlex, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import SignatureIcon from '../../../assets/icons/signature.svg';
import DateIcon from '../../../assets/icons/date.svg';
import TextIcon from '../../../assets/icons/text.svg';

/* eslint-disable-next-line */
export interface PdfPlaceholderProps {
  customData: any;
}

export function PdfPlaceholder({ customData }: PdfPlaceholderProps) {
  const theme = useTheme();
  return (
    <WBFlex
      style={{
        flex: 1,
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        userSelect: 'none',
        cursor: 'grab',
        backgroundColor: 'rgba(255,248,219,0.75)',
        border: 'dotted 2px #B4540A',
      }}
    >
      {customData?.type === 'SIGNATURE' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 11 14">
          <SignatureIcon />
        </WBSvgIcon>
      )}
      {customData?.type === 'DATE' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 16 16">
          <DateIcon />
        </WBSvgIcon>
      )}
      {customData?.type === 'TEXT' && (
        <WBSvgIcon style={{ width: '1em', height: '1em' }} viewBox="0 0 16 16">
          <TextIcon />
        </WBSvgIcon>
      )}
      <WBTypography
        style={{
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          marginLeft: '8px',
        }}
      >
        {customData?.label as string}
      </WBTypography>
    </WBFlex>
  );
}

export default PdfPlaceholder;
