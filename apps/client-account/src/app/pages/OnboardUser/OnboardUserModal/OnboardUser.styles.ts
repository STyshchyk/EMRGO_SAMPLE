import { getTheme } from "@emrgo-frontend/theme";
import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

export const OnboardUser = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
  margin-top: 20px;
  form {
    display: flex;
    flex-direction: column;
    gap: ${rem(24)};
    max-width: ${rem(500)};
    justify-content: flex-start;
  }
  button{
    margin-left: auto;
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

