import { render } from '../../helpers/render';
import ChangePhoneForm from './ChangePhoneForm';
import { FormProvider, useForm } from 'react-hook-form';

const TestWrapper = ({ children }: { children: any }) => {
  const methods = useForm(); // useForm provides the necessary form context
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ChangePhoneForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChangePhoneForm />
      </TestWrapper>
    );
    expect(baseElement).toBeTruthy();
  });
});
