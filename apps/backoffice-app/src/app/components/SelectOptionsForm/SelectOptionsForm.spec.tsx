import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { SelectOptionsForm } from './SelectOptionsForm';

describe('SelectOptionsForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <SelectOptionsForm
          category="Interests"
          onSubmit={(data: any) => console.log('onSubmit: ', data)}
          selectedOptions={[]}
        />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
