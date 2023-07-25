import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

import { TButtonColors, TButtonSizes, TButtonVariants } from "./Button.types";

// import { getColor, PropsWithTheme } from "~/styles";

export const Button = styled.button<{
  $variant?: TButtonVariants;
  $size?: TButtonSizes;
  $color?: TButtonColors;
}>`
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  /* Variants */
  ${({ $variant = "primary", theme }) => {
    if (theme.mode === "light") {
      switch ($variant) {
        case "primary":
          return css`
            background: ${getTheme("colors.green3")};
            border: 1px solid ${getTheme("colors.green3")};
            color: ${getTheme("colors.white.100")};

            &:not(:disabled):hover {
              background: ${getTheme("colors.green1")};
              border: 1px solid ${getTheme("colors.green1")};
            }

            &:disabled {
              opacity: 0.25;
            }
          `;

        case "secondary":
          return css`
            background: transparent;
            border: 1px solid ${getTheme("colors.green3")};
            color: ${getTheme("colors.green3")};

            &:not(:disabled):hover {
              border: 1px solid ${getTheme("colors.green1")};
              color: ${getTheme("colors.green1")};
            }

            &:disabled {
              opacity: 0.25;
            }
          `;
      }
    }

    if (theme.mode === "dark") {
      switch ($variant) {
        case "primary":
          return css`
            background: ${getTheme("colors.green5")};
            border: 1px solid ${getTheme("colors.green5")};
            color: ${getTheme("colors.black.100")};

            &:not(:disabled):hover {
              background-color: ${(props) => rgba(getTheme("colors.green5")(props), 0.7)};
              border-color: transparent;
            }

            &:disabled {
              opacity: 0.25;
            }
          `;

        case "secondary":
          return css`
            background: transparent;
            border: 1px solid ${getTheme("colors.green5")};
            color: ${getTheme("colors.green5")};

            &:hover {
              opacity: 0.7;
            }

            &:disabled {
              opacity: 0.25;
            }
          `;
      }
    }
  }}

  /* Sizes */
  ${({ $size = "medium" }) => {
    switch ($size) {
      case "large":
        return css`
          border-radius: ${rem(4)};
          padding: ${rem(8)} ${rem(16)};
          ${getTheme("typography.medium.02")}
        `;
      case "medium":
        return css`
          border-radius: ${rem(4)};
          padding: ${rem(4)} ${rem(16)};
          ${getTheme("typography.medium.02")}
        `;
      case "small":
        return css`
          border-radius: ${rem(2)};
          padding: ${rem(4)} ${rem(8)};
          ${getTheme("typography.medium.03Tight")}
        `;
    }
  }}

  ${({ $color, $variant }) =>
    $color === "error" &&
    css`
      ${$variant === "primary" &&
      css`
        background-color: ${getTheme("colors.red")};
        border-color: ${getTheme("colors.red")};
        color: ${getTheme("colors.white.100")};

        &:not(:disabled):hover {
          background-color: ${getTheme("colors.pink")};
          border-color: ${getTheme("colors.pink")};
        }
      `}

      ${$variant === "secondary" &&
      css`
        border-color: ${getTheme("colors.red")};
        color: ${getTheme("colors.red")};

        &:not(:disabled):hover {
          opacity: 1;
          border-color: ${getTheme("colors.pink")};
          color: ${getTheme("colors.pink")};
        }
      `}
    `}
`;
