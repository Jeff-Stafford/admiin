import { render } from '@admiin-com/ds-web-testing-utils';
import XeroContacts from './XeroContacts';

describe('XeroTransactions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<XeroContacts />);
    expect(baseElement).toBeTruthy();
  });
});
