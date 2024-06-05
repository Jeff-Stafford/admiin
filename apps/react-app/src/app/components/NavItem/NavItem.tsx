import { ListItemLinkButton } from '../ListItemLinkButton/ListItemLinkButton';
import { ReactNode } from 'react';
import {
  WBListItem,
  WBListItemIcon,
  WBListItemText,
  WBSvgIcon,
} from '@admiin-com/ds-web';

/* eslint-disable-next-line */
export interface NavItemProps {
  title: string | React.ReactNode;
  icon: ReactNode;
  path: string;
  onClick?: () => void;
}

export const NavItem = ({ path, icon, title, onClick }: NavItemProps) => {
  return (
    <WBListItem>
      <ListItemLinkButton to={path} onNavigated={onClick}>
        {(isActive: boolean) => (
          <>
            <WBListItemIcon>
              <WBSvgIcon fontSize="small" opacity={isActive ? 1 : 0.5}>
                {icon}
              </WBSvgIcon>
            </WBListItemIcon>
            <WBListItemText
              primary={title}
              sx={{ ml: 1, opacity: isActive ? 1 : 0.5 }}
            />
          </>
        )}
      </ListItemLinkButton>
    </WBListItem>
  );
};
