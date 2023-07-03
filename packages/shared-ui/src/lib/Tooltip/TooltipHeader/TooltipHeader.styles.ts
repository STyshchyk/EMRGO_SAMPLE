import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${rem(16)};
`;

export const CloseButton = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  border: none;
  padding: 0;
  border-radius: 50%;
  margin-left: auto;
  font-size: ${rem(16)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.black.5")};
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.white.5")};
      color: ${getTheme("colors.white.60")};
    `}
`;
