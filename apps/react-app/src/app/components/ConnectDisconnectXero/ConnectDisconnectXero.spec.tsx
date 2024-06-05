import { render } from '../../helpers/render';

import { ConnectDisconnectXero } from './ConnectDisconnectXero';

describe('ConnectDisconnectXero', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConnectDisconnectXero />);
    expect(baseElement).toBeTruthy();
  });
});
