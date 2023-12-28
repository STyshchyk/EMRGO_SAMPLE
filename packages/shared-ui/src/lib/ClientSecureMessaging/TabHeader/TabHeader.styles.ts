import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const TabHeaderWrapper = styled.div`
  display: flex;
  column-gap: ${rem(8)};
  padding: 0 ${rem(24)} 0 ${rem(32)};
  min-height: 85px;
  align-items: center;
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

export const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Spacer = styled.div`
  display: flex;
  flex-basis: ${rem(330)};
`;
