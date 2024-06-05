import { ForwardedRef, forwardRef } from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface LinkBehaviorProps extends LinkProps {
  href?: string;
}

export const LinkBehavior = forwardRef(
  (props: LinkBehaviorProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    const { href, to, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <RouterLink ref={ref} to={href || to} {...other} />; //data-testid="custom-link"
  }
);
