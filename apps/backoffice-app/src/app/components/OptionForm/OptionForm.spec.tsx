import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { OptionForm } from './OptionForm';

describe('OptionForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <OptionForm name="option-1" />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
