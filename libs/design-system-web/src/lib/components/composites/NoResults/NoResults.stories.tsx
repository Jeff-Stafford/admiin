import type { Meta } from '@storybook/react';
import { NoResults } from './NoResults';

const Story: Meta<typeof NoResults> = {
  component: NoResults,
  title: 'composites/NoResults',
};
export default Story;

export const Primary = {
  args: {
    title: 'No results found!',
    description: 'Try updating your search filters',
    btnTitle: 'View Filters',
    onClick: (e) => console.log('Clicked: ', e),
  },
};
