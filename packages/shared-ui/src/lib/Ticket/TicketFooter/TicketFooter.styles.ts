import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const TicketFooter = styled.footer`
  display: flex;
  column-gap: ${rem(16)};
  margin-top: auto;
  padding: ${rem(24)};
  border-top: 1px solid transparent;

  & > *:last-child:not(:only-child) {
    margin-left: auto;
  }

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-top-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-top-color: ${getTheme("colors.strokes.dark")};
    `}
`;
