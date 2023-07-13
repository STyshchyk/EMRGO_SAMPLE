import { ArrowBackwardIcon as ArrowBackwardIconBase } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const BackButton = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(32)};
  height: ${rem(32)};
  padding: 0;

  /* Element Styles */
  border: none;
  background-color: ${getTheme("colors.white.20")};
  border-radius: 50%;

  /* Interaction Styles */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${getTheme("colors.white.30")};
  }
`;

export const ArrowBackwardIcon = styled(ArrowBackwardIconBase)`
  /* Element Styles */
  color: ${getTheme("colors.white.100")};
  width: ${rem(24)};
  height: ${rem(24)};
`;
