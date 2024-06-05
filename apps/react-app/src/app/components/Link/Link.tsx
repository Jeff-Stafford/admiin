import { MouseEventHandler } from 'react';
import * as React from 'react';
import { WBLink, Theme, SxProps } from '@admiin-com/ds-web';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  sx?: SxProps<Theme>;
  to: string | number;
  underline?: 'hover' | 'none' | 'always';
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLSpanElement>;
}

const Link = ({
  to,
  children,
  underline = 'hover',
  sx = {},
  onClick,
  replace = false,
}: LinkProps) => (
  <WBLink
    //@ts-ignore
    component={RouterLink}
    to={to}
    underline={underline}
    sx={sx}
    replace={replace}
    onClick={onClick}
  >
    {children}
  </WBLink>
);
export { Link };
