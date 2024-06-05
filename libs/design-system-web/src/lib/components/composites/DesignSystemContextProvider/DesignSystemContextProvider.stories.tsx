import type { Meta } from '@storybook/react';
import { getTheme } from '../../../utils';
import { DesignSystemContextProvider } from './DesignSystemContextProvider';

const Story: Meta<typeof DesignSystemContextProvider> = {
  component: DesignSystemContextProvider,
  title: 'providers/DesignSystemContextProvider',
};
export default Story;

export const Primary = {
  args: {
    theme: getTheme(), //TODO: error showing in ui
  },
};
