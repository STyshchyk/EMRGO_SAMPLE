import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

import { TCodeInputSizes, TCodeInputVariants } from "./CodeInput.types";

export const CodeInput = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: ${rem(8)};
`;

export const InputWrapper = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(16)};
`;

export const Input = styled.input<{
  $variant?: TCodeInputVariants;
  $error?: boolean;
  $success: boolean;
  $size?: TCodeInputSizes;
}>`
  /* Element Styles */
  border-radius: ${rem(4)};

  /* Text styles */
  text-align: center;
  ${getTheme("typography.heading.01")}

  /* Active State */
  &:focus {
    outline: none;
    border: 1px solid ${getTheme("colors.green5")};
  }

  /* Hide arrows in number input in Chrome, Safari, Edge, and Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Hide arrows in number input in Firefox */
  -moz-appearance: textfield;

  ${({ $size }) =>
    $size === "medium" &&
    css`
      width: ${rem(48)};
      height: ${rem(48)};
    `}

  ${({ $size }) =>
    $size === "large" &&
    css`
      width: ${rem(64)};
      height: ${rem(64)};
    `}

  ${({ theme, $variant = "default", $error = false, $success = false }) => {
    if (theme.mode === "light") {
      if ($success)
        return css`
          background: ${getTheme("colors.black.5")};
          border: 1px solid ${getTheme("colors.green3")};
          color: ${getTheme("colors.black.100")};
        `;
      if ($error)
        return css`
          background: ${rgba(getTheme("colors.red")({ theme }), 0.1)};
          border: 1px solid ${getTheme("colors.red")};
          color: ${getTheme("colors.black.100")};
        `;

      return css`
        background: ${getTheme("colors.black.5")};
        border: 1px solid ${getTheme("colors.strokes.light")};
        color: ${getTheme("colors.black.100")};
      `;
    }
    if (theme.mode === "dark") {
      if ($variant === "default") {
        if ($success)
          return css`
            background: ${getTheme("colors.white.100")};
            border: 1px solid ${getTheme("colors.green5")};
            color: ${getTheme("colors.black.100")};
          `;
        if ($error)
          return css`
            background: linear-gradient(0deg, rgba(255, 100, 3, 0.1), rgba(255, 100, 3, 0.1)),
              rgba(255, 255, 255, 0.05);
            border: 1px solid ${getTheme("colors.orange")};
            color: ${getTheme("colors.white.100")};
          `;

        return css`
          background: ${getTheme("colors.white.5")};
          border: 1px solid ${getTheme("colors.strokes.dark")};
          color: ${getTheme("colors.white.100")};
        `;
      }
    }
    if ($variant === "signup") {
      if ($success)
        return css`
          background: ${getTheme("colors.white.100")};
          border: 1px solid ${getTheme("colors.green5")};
          color: ${getTheme("colors.black.100")};
        `;
      if ($error)
        return css`
          background: linear-gradient(
              0deg,
              ${rgba(getTheme("colors.orange")({ theme }), 0.1)},
              ${rgba(getTheme("colors.orange")({ theme }), 0.1)}
            ),
            white;
          border: 1px solid ${getTheme("colors.orange")};
          color: ${getTheme("colors.black.100")};
        `;

      return css`
        background: ${getTheme("colors.white.100")};
        border: 1px solid ${getTheme("colors.strokes.dark")};
        color: ${getTheme("colors.black.100")};
      `;
    }
  }}
`;

export const Label = styled.label`
  /* Text styles */
  ${getTheme("typography.regular.02")}

  ${({ theme }) => {
    if (theme.mode === "light") {
      return css`
        color: ${getTheme("colors.black.100")};
      `;
    }
    if (theme.mode === "dark") {
      return css`
        color: ${getTheme("colors.white.100")};
      `;
    }
  }}
`;

export const Error = styled.label`
  /* Text styles */
  ${getTheme("typography.regular.02")}

  ${({ theme }) => {
    if (theme.mode === "light") {
      return css`
        color: ${getTheme("colors.red")};
      `;
    }
    if (theme.mode === "dark") {
      return css`
        color: ${getTheme("colors.orange")};
      `;
    }
  }}
`;

export const Success = styled.label`
  /* Text styles */
  ${getTheme("typography.regular.02")}

  ${({ theme }) => {
    if (theme.mode === "light") {
      return css`
        color: ${getTheme("colors.green3")};
      `;
    }
    if (theme.mode === "dark") {
      return css`
        color: ${getTheme("colors.green5")};
      `;
    }
  }}
`;
