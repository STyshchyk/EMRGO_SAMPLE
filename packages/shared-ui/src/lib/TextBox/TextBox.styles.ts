import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import {
  ErrorIcon as ErrorIconBase,
} from "../Icons";

export const Wrapper = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};
`;


export const Textarea = styled.textarea<{ $maxWidth?: string }>`
  /* Layout */
  padding: ${rem(12)};
  flex: 1;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
  display: block;

  /* Element Styles */
  border-radius: ${rem(4)};

  /* Text Styles */
  ${getTheme("typography.regular.02")}
  font-family: ${getTheme("typography.fontFamily")};

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
  }

  /* Themes */
  ${({ theme }) => {
    if (theme.mode === "light") {
      return css`
        background: ${getTheme("colors.black.5")};
        border: 1px solid ${getTheme("colors.strokes.light")};
        color: ${getTheme("colors.black.100")};
        caret-color: ${getTheme("colors.green5")};

        &:focus {
          border: 1px solid ${getTheme("colors.green5")};
        }

        ::placeholder {
          color: ${getTheme("colors.black.60")};
        }
      `;
    }

    if (theme.mode === "dark") {
      return css`
        background: ${getTheme("colors.white.5")};
        border: 1px solid ${getTheme("colors.strokes.dark")};
        color: ${getTheme("colors.white.100")};
        caret-color: ${getTheme("colors.green5")};

        &:focus {
          border: 1px solid ${getTheme("colors.green5")};
        }

        ::placeholder {
          color: ${getTheme("colors.white.60")};
        }
      `;
    }
  }}
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
      color: ${getTheme("colors.red")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
  `}
`;
