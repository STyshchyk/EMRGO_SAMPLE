import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { DashboardContent } from "../DashboardContent";

interface IDashboardChildPageContentProps {
  $isScrolled: boolean;
}

export const DashboardChildPageContent = styled(DashboardContent)<IDashboardChildPageContentProps>`
  padding-top: 0;

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
