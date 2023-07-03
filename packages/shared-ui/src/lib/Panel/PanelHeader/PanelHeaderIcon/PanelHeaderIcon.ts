import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const PanelHeaderIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
  user-select: none;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green3")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green5")};
    `}
`;
