import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WBListItemButton } from '@admiin-com/ds-web';
import { ListItemButtonProps as MUIListItemButtonProps } from '@mui/material';

interface LinkButtonProps extends Omit<MUIListItemButtonProps, 'children'> {
  to?: string;
  children?: ReactNode | ((isActive: boolean) => ReactNode);
  onNavigated?: () => void;
}

export const ListItemLinkButton = ({
  children,
  to,
  onNavigated,
  ...props
}: LinkButtonProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = pathname.startsWith(to ?? '');

  return (
    <WBListItemButton
      {...props}
      onClick={() => {
        to && navigate(to);
        onNavigated && onNavigated();
      }}
    >
      {typeof children === 'function' ? children(isActive) : children}
    </WBListItemButton>
  );
};
