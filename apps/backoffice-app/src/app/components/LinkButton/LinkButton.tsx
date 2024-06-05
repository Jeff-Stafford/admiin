import { forwardRef, ReactNode } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { WBButton, Theme, SxProps } from '@admiin-com/ds-web';

interface LinkButtonProps {
  to?: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  variant?: 'text' | 'outlined' | 'contained';
}

const LinkBehavior = forwardRef<any, Omit<RouterLinkProps, 'to'>>(
  (props, ref) => <RouterLink ref={ref} to="/" {...props} role={undefined} />
);

export const LinkButton = ({
  to,
  children,
  sx,
  variant = 'text',
}: LinkButtonProps) => {
  return (
    <WBButton
      //@ts-ignore
      component={LinkBehavior}
      to={to}
      sx={sx}
      variant={variant}
      type="button"
    >
      {children}
    </WBButton>
  );
};
