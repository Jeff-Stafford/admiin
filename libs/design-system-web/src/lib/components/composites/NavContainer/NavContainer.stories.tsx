import type { Meta } from '@storybook/react';
import { NavContainer } from './NavContainer';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';

const Story: Meta<typeof NavContainer> = {
  component: NavContainer,
  title: 'composites/NavContainer',
};
export default Story;

export const Primary = {
  args: {
    children: <img src={IMG_LOGO} alt="Logo" />,
  },
};

export const Position = {
  args: {
    ...Primary.args,
    position: 'sticky',
  },
};

export const Dense = {
  args: {
    ...Primary.args,
    variant: 'dense',
  },
};

export const DisabledGutters = {
  args: {
    ...Primary.args,
    disableGutters: true,
  },
};
