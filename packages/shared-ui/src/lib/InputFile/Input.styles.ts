import { SlCloudUpload } from "react-icons/sl";

import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

import {
  InputContainer as SharedContainer,
  InputContainerWrapper as SharedContainerWrapper,
  Error as SharedError,
  ErrorIcon as SharedErrorIcon,
  Input as SharedInput,
  Label as SharedLabel,
  CheckNotificationIcon as SharedNotificationIcon,
  Wrapper as SharedWrapper,
} from "../Input/Input.styles";
import { TInputVariants } from "../Input/Input.types";

export const Wrapper = styled(SharedWrapper)<{ $maxWidth?: number }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};

  /* Element Styles */
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
`;

export const InputContainer = styled(SharedContainer)<{
  $active: boolean;
  $hasFocus: boolean;
  $error: boolean;
  $disabled?: boolean;
  variant?: TInputVariants;
}>`
  /* Layout */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  /* Element Styles */
  background: ${getTheme("colors.white.100")};
  border: 1px solid ${getTheme("colors.strokes.light")};
  border-radius: ${rem(4)};
  transition: all 0.2s ease-in-out;

  ${({ theme, variant = "default" }) =>
    css`
      ${theme.mode === "light" &&
      css`
        background: ${getTheme("colors.black.5")};
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
    `}
  ${(props) =>
    props.$error &&
    css`
      ${props.theme.mode === "light" &&
      css`
        border: 1px solid ${getTheme("colors.red")};
        background: linear-gradient(
            0deg,
            ${rgba(getTheme("colors.red")(props), 0.05)},
            ${rgba(getTheme("colors.red")(props), 0.05)}
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

export const InputContainerWrapper = styled(SharedContainerWrapper)`
  position: relative;
`;

export const Label = styled(SharedLabel)<{
  $active: boolean;
  $hasFocus: boolean;
  $error: boolean;
}>`
  /** Font Styles */
  font-weight: 500;
  font-size: ${rem(10)};
  line-height: ${rem(16)};
  max-width: 71%;

  /** Interaction */

  transition: all 0.2s ease-in-out;
  transform-origin: left top;

  ${({ $active }) =>
    !$active &&
    css`
      transform: translateY(${rem(5)}) scale(1.4);
    `}

  ${({ $active }) =>
    $active &&
    css`
      position: relative;
      top: 5px;
    `}
`;

export const Input = styled(SharedInput)<{ $active: boolean }>`
  /* Layout */
  display: block;
  margin: 0;
  padding: 0;

  ::file-selector-button {
    display: block;
    position: absolute;
    width: 100%;
    color: transparent;
    border: transparent;
    background-color: transparent;
    height: ${rem(48)};
    padding: 0 ${rem(12)};
    top: 0;
    left: 0;
    z-index: 10000;
  }

  /* Element Styles */
  border: none;
  background: transparent;

  /* Text styles */
  font-style: normal;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: ${rem(16)};
  color: transparent;
  caret-color: ${getTheme("colors.green5")};

  :focus {
    outline: none;
  }
`;
export const Span = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: ${rem(16)};
  position: relative;
  top: -11px;
  ${({ theme }) => css`
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
  `}
`;
export const HelperText = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  ${getTheme("typography.medium.02Tight")}
  color: ${getTheme("colors.white.80")};
`;

export const UploadIcon = styled(SlCloudUpload)<{ $error: boolean; $valid: boolean }>`
  position: absolute;
  right: 0;
  ${({ $error }) => {
    if ($error) {
      return css`
        color: ${getTheme("colors.red")};
      `;
    }
  }}
  ${({ $valid }) => {
    if ($valid) {
      return css`
        color: ${getTheme("colors.green3")};
      `;
    }
  }}
`;
export const Error = styled(SharedError)`
  /* Layout */
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};
`;

export const ErrorIcon = styled(SharedErrorIcon)`
  width: ${rem(24)};
  height: ${rem(24)};
`;

export const CheckNotificationIcon = styled(SharedNotificationIcon)`
  color: ${getTheme("colors.green3")};
  font-size: ${rem(24)};
`;
