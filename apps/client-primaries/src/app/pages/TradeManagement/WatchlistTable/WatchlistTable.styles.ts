import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Action = styled.button`
  display: inline-flex;
  margin-left: auto;
  appearance: none;
  cursor: pointer;
  padding: 0;
  background-color: transparent;
  border: none;
  font-size: ${rem(24)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;
