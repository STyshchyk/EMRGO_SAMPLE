import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Document = styled.div`
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
