import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Tabs = styled.div`
  display: flex;
  column-gap: ${rem(8)};
  padding: 0 ${rem(24)};
  position: relative;
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.dark")};
    `}
`;
