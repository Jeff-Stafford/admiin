import { render } from '@testing-library/react';
import { DynamicInput, DynamicInputType } from './DynamicInput';

describe('DynamicInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DynamicInput name="active" type={DynamicInputType.checkbox} />
    );
    expect(baseElement).toBeTruthy();
  });
});
