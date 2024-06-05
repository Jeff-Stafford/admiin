import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface TwoFactorFormProps {}

const StyledTwoFactorForm = styled.div`
  color: pink;
`;

export function TwoFactorForm(props: TwoFactorFormProps) {
  return (
    <StyledTwoFactorForm>
      <h1>Welcome to TwoFactorForm!</h1>
    </StyledTwoFactorForm>
  );
}

export default TwoFactorForm;
