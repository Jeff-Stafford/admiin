import { render } from '@testing-library/react';
import { LanguageSelect } from './LanguageSelect';

describe('LanguageSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <LanguageSelect
        languages={[
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
        ]}
        language="en"
        title=""
        onLanguageChange={(language) => {
          console.log('language: ', language.value);
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
