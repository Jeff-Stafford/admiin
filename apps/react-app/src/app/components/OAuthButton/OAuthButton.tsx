import { Button, styled, useTheme } from '@mui/material';
import AppleLogo from '../../../assets/icons/apple-logo.svg';
import GoogleLogo from '../../../assets/icons/google-logo.svg';
import {
  WBBox,
  WBDivider,
  WBFlex,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

const LogoButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: '6px',
  border: `1px solid ${theme.palette.grey[300]}`,
  '&:hover': {
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey.A400,
  },
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 12,
  paddingBottom: 12,
}));
export function OAuthButton() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <WBBox mt={3} sx={{ ...theme.typography.body2 }}>
      <WBDivider textAlign="center" variant="fullWidth">
        <WBTypography color="grey" variant="body2">
          {t('or', { ns: 'common' })}
        </WBTypography>
      </WBDivider>
      <WBFlex justifyContent="space-around" mt={3}>
        <LogoButton type="button">
          <WBSvgIcon fontSize="small">
            <GoogleLogo />
          </WBSvgIcon>
        </LogoButton>
        <LogoButton type="button">
          <WBSvgIcon fontSize="small">
            <AppleLogo />
          </WBSvgIcon>
        </LogoButton>
      </WBFlex>
    </WBBox>
  );
}
