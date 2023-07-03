import { rem } from "polished";
import styled from "styled-components";

export const KYC = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
`;

export const Spacer = styled.div`
  flex: 1;
`;
