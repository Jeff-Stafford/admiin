import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface ResetPasswordFormProps {}

const StyledResetPasswordForm = styled.div`
  color: pink;
`;

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  return (
    <StyledResetPasswordForm>
      <h1>Welcome to ResetPasswordForm!</h1>
    </StyledResetPasswordForm>
  );
}

export default ResetPasswordForm;
