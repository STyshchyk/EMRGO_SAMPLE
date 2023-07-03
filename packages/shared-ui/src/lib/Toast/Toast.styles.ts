import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { TToastVariants } from "./Toast.types";

interface IContainerProps {
  $variant: TToastVariants;
}

export const Container = styled.div<IContainerProps>`
  display: flex;
  column-gap: ${rem(8)};
  padding: ${rem(8)};
  border-radius: ${rem(4)};
  border: 1px solid currentColor;
  box-shadow: 0px ${rem(4)} ${rem(8)} rgba(0, 0, 0, 0.1);
  min-width: ${rem(535)};

  ${({ theme, $variant }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};

      ${$variant === "success" &&
      css`
        color: ${getTheme("colors.green3")};
      `}

      ${$variant === "info" &&
      css`
        color: ${getTheme("colors.blue")};
      `}

      ${$variant === "error" &&
      css`
        color: ${getTheme("colors.red")};
      `}
     
      ${$variant === "warning" &&
      css`
        color: ${getTheme("colors.orange")};
        border-color: #e88f3c;
      `}
    `};

  ${({ theme, $variant }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      --secondary-color: ${getTheme("colors.green1")};

      ${$variant === "success" &&
      css`
        color: ${getTheme("colors.mint")};
      `}

      ${$variant === "info" &&
      css`
        color: ${getTheme("colors.lightBlue")};
      `}

      ${$variant === "error" &&
      css`
        color: ${getTheme("colors.pink")};
      `}
     
      ${$variant === "warning" &&
      css`
        color: ${getTheme("colors.peach")};
      `}
    `};
`;

export const Text = styled.p`
  ${getTheme("typography.medium.02")}
  margin: 0;
`;

export const Icon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
`;

export const CloseButton = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-left: auto;
  font-size: ${rem(24)};

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
