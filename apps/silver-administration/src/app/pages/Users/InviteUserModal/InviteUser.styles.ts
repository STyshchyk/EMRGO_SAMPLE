import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

export const InviteUser = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
  margin-top: 20px;
  overflow-y: auto;

  form.invite-user {
    display: flex;
    flex-direction: column;
    gap: ${rem(24)};
    max-width: ${rem(500)};
    justify-content: flex-start;
  }
`;
const maxWidth = 458;

export const Form = styled.form``;

export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(125)};
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  & > label:nth-child(1) {
    width: 125px;
  }
  & > div:nth-child(2) {
    flex-basis: 300px;
    width: 300px;
  }
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

// import { getColor, PropsWithTheme } from "~/styles";

export type TButtonVariants = "primary" | "secondary";
export type TButtonSizes = "small" | "medium" | "large";

export const CustomButton = styled.button<{
  $variant?: TButtonVariants;
  $size?: TButtonSizes;
  margin: string;
}>`
  /* Variants */
  margin: ${(props) => props.margin || ""};
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
`;
