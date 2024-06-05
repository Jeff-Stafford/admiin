import { WBTab } from '@admiin-com/ds-web';
import { TabProps } from '@mui/material';
import { LinkBehavior } from '../LinkBehavior/LinkBehavior'; //TODO: come from design system

interface NavTabProps extends TabProps {
  to: string;
}
export function NavTab({ to, ...props }: NavTabProps) {
  //@ts-ignore
  return <WBTab {...props} component={LinkBehavior} to={to} />;
}

export default NavTab;
