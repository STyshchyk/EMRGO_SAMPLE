import { rem } from "polished";
import styled from "styled-components";

export const InvestmentProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;

export const Spacer = styled.div`
  flex: 1;
`;
