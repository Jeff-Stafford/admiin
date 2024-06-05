import { render } from '../../helpers/render';
import ContactsToolbar from './ContactsToolbar';
import { Contact } from '@admiin-com/ds-graphql';

describe('ContactsToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ContactsToolbar
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
