import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

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
  ${getTheme("typography.regular.02")};
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
