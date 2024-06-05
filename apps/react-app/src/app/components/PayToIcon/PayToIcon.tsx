import { WBSvgIcon } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import PayToIconAssets from '../../../assets/icons/payTo.svg';
import PayToIconAssetsLight from '../../../assets/icons/payToWhite.svg';
import PayIDIcon from '../../../assets/icons/payID.svg';
import PayIDIconLight from '../../../assets/icons/payIDWhite.svg';

export interface PayToIconProps {
  type: 'PayTo' | 'PayID';
}

export function PayToIcon({ type }: PayToIconProps) {
  const theme = useTheme();
  const mode = theme.palette.mode; // 'light' or 'dark'

  return (
    <WBSvgIcon
      fontSize="large"
      viewBox="0 0 30 30"
      sx={{ width: '2em', height: '1.2em', marginBottom: 2 }}
    >
      {type === 'PayTo' ? (
        mode === 'dark' ? (
          <PayToIconAssetsLight />
        ) : (
          <PayToIconAssets />
        )
      ) : mode === 'dark' ? (
        <PayIDIconLight />
      ) : (
        <PayIDIcon />
      )}
    </WBSvgIcon>
  );
}

export default PayToIcon;
