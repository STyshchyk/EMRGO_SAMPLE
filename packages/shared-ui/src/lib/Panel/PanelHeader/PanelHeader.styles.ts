import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${rem(4)};
  padding: ${rem(8)} ${rem(16)};
  border-bottom: 1px solid transparent;
  ${getTheme("typography.medium.02")}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-bottom-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-bottom-color: ${getTheme("colors.strokes.dark")};
    `}
`;
