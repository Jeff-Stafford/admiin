import type { Meta } from '@storybook/react';
import { LanguageSelect } from './LanguageSelect';

const Story: Meta<typeof LanguageSelect> = {
  component: LanguageSelect,
  title: 'composites/LanguageSelect',
};
export default Story;

export const Primary = {
  args: {
    languages: [
      {
        label: '🇬🇧 English',
        value: 'en',
        emoji: '🇬🇧',
        name: 'English',
      },
      {
        label: '🇨🇭 Deutsch',
        value: 'de',
        emoji: '🇨🇭',
        name: 'Deutsch',
      },
    ],
    language: 'en',
    title: 'Select language',
    onLanguageChange: (language) => {
      console.log('language: ', language.value);
    },
  },
};
