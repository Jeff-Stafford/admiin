import { render } from '../../helpers/render';
import ClientsMainPage from './ClientsMainPage';
import { Contact } from '@admiin-com/ds-graphql';

describe('ClientsMainPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ClientsMainPage
        handleCreateNew={function (): void {
          throw new Error('Function not implemented.');
        }}
        selectedContact={null}
        handleSelected={function (contact: Contact | null): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
