import { render } from '@testing-library/react';
import { PhInput } from './PhInput';

describe('PhInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PhInput
        defaultCountry="AU"
        name="phone-number"
        onChange={(value?: string) => console.log('value: ', value)}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
