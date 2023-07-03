import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const Verification = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;

export const Paragraph = styled.p`
  /* Layout */
  margin: 0;
  padding: 0;

  /* Typography */
  ${getTheme("typography.regular.02")}
  color: ${getTheme("colors.white.100")};
`;

export const Spacer = styled.div`
  flex: 1;
`;
