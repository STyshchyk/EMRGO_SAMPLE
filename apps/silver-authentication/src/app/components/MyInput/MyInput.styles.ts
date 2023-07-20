import {
  CheckNotificationIcon as CheckNotificationIconBase,
  ErrorIcon as ErrorIconBase,
} from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

import { TMyInputVariants } from "./MyInput.types";

export const Wrapper = styled.div<{ $maxWidth?: number }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};

  /* Element Styles */
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
`;

export const InputContainer = styled.div<{
  $active: boolean;
  $hasFocus: boolean;
  $error: boolean;
  $disabled?: boolean;
  variant?: TMyInputVariants;
}>`
  /* Layout */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 ${rem(12)};
  gap: ${rem(8)};

  /* Element Styles */
  border-radius: ${rem(4)};
  transition: all 0.2s ease-in-out;

  /* Variants */
  ${({ theme, variant = "default" }) =>
    css`
      ${theme.mode === "light" &&
      css`
        background: ${getTheme("colors.white.5")};
        border: 1px solid ${getTheme("colors.strokes.light")};
      `}
      ${theme.mode === "dark" &&
      css`
        background: ${getTheme("colors.white.5")};
        border: 1px solid ${getTheme("colors.strokes.dark")};
      `}
      ${variant === "signup" &&
      css`
        background: ${getTheme("colors.white.100")};
        border: 1px solid ${getTheme("colors.strokes.light")};
      `}
    `} /* Focus States */ ${({ $hasFocus, theme }) =>
    $hasFocus &&
    css`
      ${theme.mode === "light" &&
      css`
        border: 1px solid ${getTheme("colors.green5")};
      `}
      ${theme.mode === "dark" &&
      css`
        border: 1px solid ${getTheme("colors.green5")};
      `}
    `} /* Error States */ ${(props) =>
    props.$error &&
    css`
      ${props.theme.mode === "light" &&
      css`
        border: 1px solid ${getTheme("colors.orange")};
        background: linear-gradient(
            0deg,
            ${rgba(getTheme("colors.orange")(props), 0.05)},
            ${rgba(getTheme("colors.orange")(props), 0.05)}
          ),
          ${getTheme("colors.white.100")};
      `}

      ${props.theme.mode === "dark" &&
      css`
        border: 1px solid ${getTheme("colors.orange")};
        background: linear-gradient(
            0deg,
            ${rgba(getTheme("colors.orange")(props), 0.05)},
            ${rgba(getTheme("colors.orange")(props), 0.05)}
          ),
          ${getTheme("colors.white.10")};
      `}

      ${props.variant === "signup" &&
      css`
        border: 1px solid ${getTheme("colors.orange")};
        background: linear-gradient(
            0deg,
            ${rgba(getTheme("colors.orange")(props), 0.05)},
            ${rgba(getTheme("colors.orange")(props), 0.05)}
          ),
          ${getTheme("colors.white.100")};
      `}
    `}

  ${({ $disabled }) => {
    if ($disabled) {
      return css`
        opacity: 0.75;
      `;
    }
  }}
`;

export const InputContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

export const Label = styled.label<{
  $active: boolean;
  $hasFocus: boolean;
  $error: boolean;
  variant?: TMyInputVariants;
}>`
  /** Font Styles */
  font-weight: 500;
  font-size: ${rem(10)};
  line-height: ${rem(16)};
  max-width: 71%;

  /** Interaction */
  transition: all 0.2s ease-in-out;
  transform-origin: left top;

  /* Variants */
  ${({ theme, variant = "default" }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
    ${variant === "signup" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}
  `} /* Active States */ ${({ $active }) =>
    !$active &&
    css`
      transform: translateY(${rem(5)}) scale(1.4);
    `} /* Error State */ ${({ $error, theme }) =>
    $error &&
    css`
      ${theme.mode === "light" &&
      css`
        color: ${getTheme("colors.orange")};
      `}
      ${theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.orange")};
      `}
    `}
`;

export const Input = styled.textarea<{
  $active: boolean;
  $disabled?: boolean;
  variant?: TMyInputVariants;
  $maxWidth?: number;
}>`
  /* Layout */
  display: block;
  margin: 0;
  padding: 0;
  /* Element Styles */
  border: none;
  background: transparent;
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth - 20)};
  /* Text styles */
  font-style: normal;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: ${rem(16)};

  /* Variants */

  ${({ theme, variant = "default" }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
      caret-color: ${getTheme("colors.green3")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
      caret-color: ${getTheme("colors.green5")};
    `}
    ${variant === "signup" &&
    css`
      color: ${getTheme("colors.black.100")};
      caret-color: ${getTheme("colors.green5")};
    `}
  `}
  :focus {
    outline: none;
  }

  /* States */
  ${({ $disabled }) => {
    if ($disabled) {
      return css`
        cursor: default;
      `;
    }
  }}
`;

export const HelperText = styled.div<{ variant?: TMyInputVariants }>`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;

  /* Font Styles */
  ${getTheme("typography.medium.02Tight")} /* Variants */ ${({ theme, variant = "default" }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.50")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.50")};
    `}
    ${variant === "signup" &&
    css`
      color: ${getTheme("colors.white.80")};
    `}
  `}
`;

export const Error = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};

  /* Variants */

  span {
    ${({ theme }) => css`
      ${theme.mode === "light" &&
      css`
        color: ${getTheme("colors.black.80")};
      `}
      ${theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.white.80")};
      `}
    `}
  }
`;

export const ErrorIcon = styled(ErrorIconBase)`
  width: ${rem(24)};
  height: ${rem(24)};

  /* Variants */
  ${({ theme }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
  `}
`;

export const CheckNotificationIcon = styled(CheckNotificationIconBase)<{
  variant?: TMyInputVariants;
}>`
  font-size: ${rem(24)};

  /* Variants */
  ${({ theme, variant = "default" }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green3")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
    ${variant === "signup" &&
    css`
      color: ${getTheme("colors.green3")};
    `}
  `}
`;
