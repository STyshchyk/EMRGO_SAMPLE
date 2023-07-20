import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Table = styled.table`
  /* Layout */
  margin: 0;
  padding: 0;
  border-spacing: 0;
  flex: 1;
  width: 100%;

  /* Element Styles */
  border: none;
`;

export const Th = styled.th`
  /* Layout */
  margin: 0;
  padding: 0;

  /* Theme Styles */
  ${({ theme }) => {
    if (theme.mode === "light")
      return css`
        border-bottom: 1px solid ${getTheme("colors.strokes.light")};
      `;

    if (theme.mode === "dark")
      return css`
        border-bottom: 1px solid ${getTheme("colors.strokes.dark")};
      `;
  }}
`;

export const Td = styled.td`
  /* Layout */
  margin: 0;
  padding: 0;

  /* Theme Styles */
  ${({ theme }) => {
    if (theme.mode === "light")
      return css`
        border-bottom: 1px solid ${getTheme("colors.strokes.light")};
      `;

    if (theme.mode === "dark")
      return css`
        border-bottom: 1px solid ${getTheme("colors.strokes.dark")};
      `;
  }}
`;

interface ITrProps {
  $isClickable?: boolean;
  $isRowShow?: boolean;
}

export const Tr = styled.tr<ITrProps>`
  &:last-child {
    ${Td} {
      border-bottom: none;
    }
  }

  ${({ $isRowShow }) =>
    $isRowShow &&
    css`
      background-color: rgba(24, 104, 109, 0.1);
    `}

  ${({ $isClickable }) =>
    $isClickable &&
    css`
      cursor: pointer;
    `}
`;

export const HeaderCell = styled.div<{ $canSort: boolean }>`
  /* Layout */
  display: flex;
  align-items: center;
  height: ${rem(48)};
  padding: 0 ${rem(4)};
  gap: ${rem(6)};

  /* Text Styles */
  ${getTheme("typography.medium.03")};

  /* Sort Styles */
  ${({ $canSort }) =>
    $canSort &&
    css`
      cursor: pointer;
      user-select: none;
    `}

  /* Theme Styles */
  ${({ theme }) => {
    if (theme.mode === "light")
      return css`
        color: ${getTheme("colors.black.60")};
      `;

    if (theme.mode === "dark")
      return css`
        color: ${getTheme("colors.white.60")};
      `;
  }}
`;

export const Chevron = styled.div`
  font-size: ${rem(16)};
  width: ${rem(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Cell = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  height: ${rem(40)};
  padding: 0 ${rem(4)};

  /* Text Styles */
  ${getTheme("typography.regular.03")};

  /* Theme Styles */
  ${({ theme }) => {
    if (theme.mode === "light")
      return css`
        color: ${getTheme("colors.black.100")};
      `;

    if (theme.mode === "dark")
      return css`
        color: ${getTheme("colors.white.100")};
      `;
  }}
`;
