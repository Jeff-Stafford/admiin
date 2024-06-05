import type { Meta } from '@storybook/react';
import { getTheme } from '../../../utils';
import { ChipList } from './ChipList';

const theme = getTheme();

console.log('theme: ', theme);

const Story: Meta<typeof ChipList> = {
  component: ChipList,
  title: 'composites/ChipList',
};
export default Story;

export const Primary = {
  args: {
    tags: ['Red', 'Blue', 'Yellow', 'Green', 'Orange'],
  },
};

export const TagShowingLimit = {
  args: {
    ...Primary.args,
    numTags: 3,
  },
};

export const Gradient = {
  args: {
    ...Primary.args,
    sx: {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
};
