import {
  WBAppBar,
  WBButton,
  WBIcon,
  WBToolbar,
  WBTypography,
} from '@admiin-com/ds-web';
import { SidebarLayout } from '../SidebarLayout/SidebarLayout';

/* eslint-disable-next-line */
export interface ToolbarLayoutProps {
  title: string;
  onAddClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  addTitle?: string;
  children: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ToolbarLayout({
  title,
  onAddClick,
  addTitle,
  rightIcon,
  children,
}: ToolbarLayoutProps) {
  return (
    <WBAppBar position="static" sx={{ pt: 3, pb: 5, px: [1, 3, 3] }}>
      <WBToolbar>
        <SidebarLayout.MenuButton />
        <WBTypography
          variant="h2"
          noWrap
          component="div"
          color="white"
          sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}
        >
          {title}
        </WBTypography>
        {rightIcon}
        <WBButton
          sx={{
            marginLeft: 3,
            minWidth: 56,
            height: 56,
            color: 'common.black',
            backgroundColor: 'common.white',
          }}
          aria-controls="customized-menu"
          aria-haspopup="true"
          onClick={onAddClick}
        >
          <WBIcon name="Add" color="inherit" size="small" />
          <WBTypography
            variant="inherit"
            fontWeight="bold"
            noWrap
            color={'light'}
            display={{ xs: 'none', sm: 'block' }}
          >
            {addTitle}
          </WBTypography>
        </WBButton>
      </WBToolbar>
      {children}
    </WBAppBar>
  );
}

export default ToolbarLayout;
