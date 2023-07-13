import { SlCloudUpload } from "react-icons/sl";

import {
  CheckNotificationIcon as CheckNotificationIconBase,
  ErrorIcon as ErrorIconBase
} from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

export const Wrapper = styled.div<{ $maxWidth?: number }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};

  /* Element Styles */
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
`;

export const InputContainer = styled.div<{ $active: boolean; $hasFocus: boolean; $error: boolean }>`
  /* Layout */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${rem(48)};
  padding: 0 ${rem(12)};
  gap: ${rem(8)};

  /* Element Styles */
  background: ${getTheme("colors.white.100")};
  border: 1px solid ${getTheme("colors.strokes.light")};
  border-radius: ${rem(4)};
  transition: all 0.2s ease-in-out;

  /* States */
  ${({ $hasFocus }) => {
    if ($hasFocus) {
      return css`
        border: 1px solid ${getTheme("colors.green5")};
      `;
    }
  }}

  ${(props) => {
    if (props.$error) {
      return css`
        border: 1px solid ${getTheme("colors.orange")};
        background: linear-gradient(0deg,
        ${rgba(getTheme("colors.orange")(props), 0.05)},
        ${rgba(getTheme("colors.orange")(props), 0.05)}),
        ${getTheme("colors.white.100")};
      `;
    }
  }}
`;

export const InputContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: ${rem(48)};
  position: relative;
  flex-grow: 1;
`;

export const Label = styled.label<{ $active: boolean; $hasFocus: boolean; $error: boolean }>`
  /** Font Styles */
  font-weight: 500;
  font-size: ${rem(10)};
  line-height: ${rem(16)};
  color: ${getTheme("colors.black.60")};
  max-width: 71%;

  /** Interaction */
  transition: all 0.2s ease-in-out;
  transform-origin: left top;

  /* States */
  ${({ $active }) => {
    if (!$active) {
      return css`
        transform: translateY(${rem(5)}) scale(1.4);
      `;
    }
  }}

  ${({ $error }) => {
    if ($error) {
      return css`
        color: ${getTheme("colors.orange")};
      `;
    }
  }}
`;

export const Input = styled.input<{ $active: boolean }>`
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
  color: ${getTheme("colors.black.100")};
  caret-color: ${getTheme("colors.green5")};
  position: relative;
  top: -13px;
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

export const UploadIcon = styled(SlCloudUpload)<{ $error: boolean, $valid: boolean }>`
  position: absolute;
  right: 0;
  ${({ $error }) => {
    if ($error) {
      return css`
        color: ${getTheme("colors.orange")};
      `;
    }
  }}
  ${({ $valid }) => {
    if ($valid) {
      return css`
        color: ${getTheme("colors.green5")};
      `;
    }
  }}
`;
export const Error = styled.div`
  /* Layout */
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};

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
  color: ${getTheme("colors.orange")};
  width: ${rem(24)};
  height: ${rem(24)};
`;

export const CheckNotificationIcon = styled(CheckNotificationIconBase)`
  color: ${getTheme("colors.green3")};
  font-size: ${rem(24)};
`;
