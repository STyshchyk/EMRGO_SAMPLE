import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const DataRoomNumber = styled.span`
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;

export const Documents = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(12)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Document = styled.li`
  display: inline-flex;
  align-items: center;
  column-gap: ${rem(8)};
  ${getTheme("typography.regular.02")}
`;

export const DocumentIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
  border-radius: ${rem(2)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.black.10")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.white.10")};
    `}
`;
