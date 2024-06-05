import { useTheme, WBFlex, WBImage, WBNavContainer } from '@admiin-com/ds-web';
import { IMG_LOGO_FULL } from '@admiin-com/ds-common';
import { ReactNode } from 'react';
import { Link } from '../Link/Link';

interface NavBarProps {
  homePath?: string;
  navRight?: ReactNode;
}

const NavBar = ({ navRight, homePath = '/' }: NavBarProps) => {
  const { palette } = useTheme();

  return (
    <WBNavContainer
      elevation={1}
      color="secondary"
      sx={{
        backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
      }}
    >
      <WBFlex justifyContent="space-between" flex={1}>
        <WBFlex flex={1} alignItems="center">
          <Link to={homePath}>
            <WBImage
              src={IMG_LOGO_FULL}
              alt="logo"
              sx={{ maxHeight: '58px', p: 1 }}
            />
          </Link>
        </WBFlex>

        {navRight && (
          <WBFlex flex={1} justifyContent="flex-end" alignItems="center">
            {navRight}
          </WBFlex>
        )}
      </WBFlex>
    </WBNavContainer>
  );
};

export { NavBar };
