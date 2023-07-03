import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const IconButton = styled.button`
  display: inline-flex;
  appearance: none;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  font-size: ${rem(24)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
      background-color: ${getTheme("colors.black.5")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
      background-color: ${getTheme("colors.white.5")};
    `}
`;
