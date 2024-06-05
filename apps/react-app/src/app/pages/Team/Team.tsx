import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface TeamProps {}

const StyledTeam = styled.div`
  color: pink;
`;

export function Team(props: TeamProps) {
  return (
    <StyledTeam>
      <h1>Welcome to Team!</h1>
    </StyledTeam>
  );
}

export default Team;
