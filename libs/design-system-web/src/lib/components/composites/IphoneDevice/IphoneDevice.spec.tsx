import { render } from '@testing-library/react';

import { IphoneDevice } from './IphoneDevice';

describe('IphoneDevice', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IphoneDevice>Hello World</IphoneDevice>);
    expect(baseElement).toBeTruthy();
  });
});
