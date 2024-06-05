import type { Meta } from '@storybook/react';
import { Icon } from './Icon';

const Story: Meta<typeof Icon> = {
  component: Icon,
  title: 'primatives/Icon',
};
export default Story;

export const Primary = {
  args: {
    name: 'AddCircle',
  },
};

export const Size = {
  args: {
    ...Primary.args,
    name: 'small',
  },
};

export const Library = {
  args: {
    ...Primary.args,
    libraryStyle: 'ioniconSharp',
  },
};
