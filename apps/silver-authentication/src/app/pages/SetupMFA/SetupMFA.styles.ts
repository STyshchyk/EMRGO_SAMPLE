import { rem } from "polished";
import styled from "styled-components";

export const SetupMFA = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(112)};
  width: calc(100vw - 6.25rem);
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;