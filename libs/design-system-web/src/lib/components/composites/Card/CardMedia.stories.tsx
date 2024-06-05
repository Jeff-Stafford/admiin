import type { Meta } from '@storybook/react';
import IMG_LOGO from '../../../../assets/images/apptractive-rect-logo.svg';
import { CardMedia } from './CardMedia';

const Story: Meta<typeof CardMedia> = {
  component: CardMedia,
  title: 'composites/CardMedia',
};
export default Story;

export const Primary = {
  args: {
    sx: {
      height: 130,
      maxWidth: '100%',
    },
    image: IMG_LOGO,
    title: 'Pellentesque habitant morbi',
  },
};
