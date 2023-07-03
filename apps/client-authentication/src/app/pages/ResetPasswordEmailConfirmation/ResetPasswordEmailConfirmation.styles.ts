import { rem } from "polished";
import styled from "styled-components";

export const ResetPasswordEmailConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  min-height: 100vh;
  padding: ${rem(92)} 0;
`;

export const Spacer = styled.div`
  flex: 1;
`;
