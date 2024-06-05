import { render } from '@testing-library/react';
import { LocationAutoCompletion } from './LocationAutoCompletion';

describe('LocationAutoCompletion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LocationAutoCompletion />);
    expect(baseElement).toBeTruthy();
  });
});
