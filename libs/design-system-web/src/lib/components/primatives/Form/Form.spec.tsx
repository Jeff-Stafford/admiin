import { render } from '@testing-library/react';

import { Form } from './Form';

describe('Form', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Form
        onSubmit={(e) => {
          console.log('e ', e);
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
