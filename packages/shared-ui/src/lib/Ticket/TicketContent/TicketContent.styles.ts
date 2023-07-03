import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

interface ITicketContentProps {
  $isScrolled: boolean;
}

export const TicketContent = styled.div<ITicketContentProps>`
  overflow: auto;
  margin-top: ${rem(16)};
  padding: 0 ${rem(24)} ${rem(16)};

  ${({ theme, $isScrolled }) =>
    $isScrolled &&
    css`
      border-top: 1px solid transparent;

      ${theme.mode === "light" &&
      css`
        border-color: ${getTheme("colors.strokes.light")};
      `}

      ${theme.mode === "dark" &&
      css`
        border-color: ${getTheme("colors.strokes.dark")};
      `}
    `}
`;
