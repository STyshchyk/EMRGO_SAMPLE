import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const Ticket = styled.section`
  display: flex;
  flex-direction: column;
  border-left: 1px solid transparent;
  min-height: 0;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.light")};
      border-left-color: ${getTheme("colors.strokes.light")};
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.dark")};
      border-left-color: ${getTheme("colors.strokes.dark")};
      color: ${getTheme("colors.white.60")};
    `}
`;
