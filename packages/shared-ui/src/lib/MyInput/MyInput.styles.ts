import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import {
  CheckNotificationIcon as GlobalCheckNotificationIcon,
  Error as GlobalError,
  ErrorIcon as GlobalErrorIcon,
  InputContainer as GlobalInputContainer,
  Label as GlobalLabel,
} from "../Input/Input.styles";
import { TMyInputVariants } from "./MyInput.types";

export const Wrapper = styled.div<{ $maxWidth?: number; $maxHeight?: number }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};

  /* Element Styles */
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
  max-height: ${({ $maxHeight }) => $maxHeight && rem($maxHeight)};
`;

export const InputContainer = styled(GlobalInputContainer)<{
  $active: boolean;
  $hasFocus: boolean;
  $error: boolean;
  $disabled?: boolean;
  variant?: TMyInputVariants;
}>`
  /* Layout */
  display: flex;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 ${rem(12)};
  gap: ${rem(8)};

  /* Element Styles */
  border-radius: ${rem(4)};
  transition: all 0.2s ease-in-out;

  /* Error States */
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

export const Label = styled(GlobalLabel)<{
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
`;

export const Input = styled.textarea<{
  $active: boolean;
  $disabled?: boolean;
  variant?: TMyInputVariants;
  $maxWidth?: number;
  $maxHeight?: number;
  $autoResize?: boolean;
}>`
  /* Layout */
  display: block;
  margin: 0;
  padding: 0;
  /* Element Styles */
  border: none;
  background: transparent;
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth - 20)};
  resize: ${({ $autoResize }) => ($autoResize ? "none" : "auto")};
  max-height: ${({ $maxHeight }) => $maxHeight && rem($maxHeight - 20)};
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

export const Error = styled(GlobalError)`
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
`;

export const ErrorIcon = styled(GlobalErrorIcon)`
  width: ${rem(24)};
  height: ${rem(24)};

  /* Variants */
`;

export const CheckNotificationIcon = styled(GlobalCheckNotificationIcon)<{
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
export const ActionButtons = styled.div`
  display: flex;
  padding: 1rem 0.5rem 0.25rem 0;
  svg {
    &:hover {
      fill: ${getTheme("colors.green5")};
      cursor: pointer;
    }
  }
  & svg:last-child {
    margin-left: auto;
    fill: ${getTheme("colors.green3")};
    &:hover {
      fill: ${getTheme("colors.green5")};
    }
  }
`;
