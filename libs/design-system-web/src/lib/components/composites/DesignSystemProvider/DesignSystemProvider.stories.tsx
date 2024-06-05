import type { Meta } from '@storybook/react';
import { DesignSystemProvider } from './DesignSystemProvider';

const Story: Meta<typeof DesignSystemProvider> = {
  component: DesignSystemProvider,
  title: 'providers/DesignSystemProvider',
};
export default Story;

export const Primary = {
  args: {},
};
