import { getTheme } from "@emrgo-frontend/theme";
import styled from "styled-components";

export const Disclaimer = styled.p`
  ${getTheme("typography.regular.03Tight")};
  color: ${getTheme("colors.white.70")};
  margin: 0;
`;
