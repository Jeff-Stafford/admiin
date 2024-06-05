import { render } from '../../helpers/render';
import CodeVerificationForm from './CodeVerificationForm';
import { FormProvider, useForm } from 'react-hook-form';
const TestWrapper = ({ children }: { children: any }) => {
  const methods = useForm(); // useForm provides the necessary form context
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('CodeVerificationForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TestWrapper>
        <CodeVerificationForm type={'email'} />
      </TestWrapper>
    );
    expect(baseElement).toBeTruthy();
  });
});
