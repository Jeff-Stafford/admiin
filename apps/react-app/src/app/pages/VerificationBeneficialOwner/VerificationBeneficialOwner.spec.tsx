import { BeneficialOwner } from '@admiin-com/ds-graphql';
import { render } from '../../helpers/render';
import VerificationBeneficialOwner from './VerificationBeneficialOwner';

describe('VerificationBeneficialOwner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerificationBeneficialOwner
        onSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
        onBack={function (): void {
          throw new Error('Function not implemented.');
        }}
        verifyOwner={function (owner: BeneficialOwner): void {
          throw new Error('Function not implemented.');
        }}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        onVerified={function (owner: BeneficialOwner): void {
          throw new Error('Function not implemented.');
        }}
        beneficialOwners={[]}
        setBeneficialOwners={function (
          benenficialOwners: (BeneficialOwner | null | undefined)[]
        ): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
