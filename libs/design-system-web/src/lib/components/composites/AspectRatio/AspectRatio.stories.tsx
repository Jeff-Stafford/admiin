import type { Meta } from '@storybook/react';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';
import { AspectRatio } from './AspectRatio';

const Story: Meta<typeof AspectRatio> = {
  component: AspectRatio,
  title: 'composites/AspectRatio',
};
export default Story;

export const Primary = {
  args: {
    ratio: 4 / 3,
    sx: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    bgcolor: 'grey.100',
    children: <img src={IMG_LOGO} alt="Logo" />, //TODO: image
  },
};
