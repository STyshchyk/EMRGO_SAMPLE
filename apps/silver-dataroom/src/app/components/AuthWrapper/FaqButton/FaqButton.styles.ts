import { getTheme } from "@emrgo-frontend/theme";
import styled from "styled-components";

export const FaqButton = styled.button`
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;

  /* Text styles */
  ${getTheme("typography.medium.02")}
  color: ${getTheme("colors.white.100")};

  /* Interaction styles */
  transition: color 0.2s ease-in-out;
  :hover {
    color: ${getTheme("colors.white.80")};
  }
`;
