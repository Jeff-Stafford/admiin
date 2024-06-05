import { render } from '../../helpers/render';
import BankAccountsList from './BankAccountsList';
import { AccountDirection } from '@admiin-com/ds-graphql';

describe('BankAccountsList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BankAccountsList
        bankAccounts={[]}
        accountDirection={AccountDirection.DISBURSEMENT}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
