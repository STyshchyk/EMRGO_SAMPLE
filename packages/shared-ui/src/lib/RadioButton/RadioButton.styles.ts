import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Label = styled.label`
  display: inline-flex;
  column-gap: ${rem(8)};
  ${getTheme("typography.regular.02")}

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;

export const RadioButtonContainer = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const RadioButton = styled.input`
  display: inline-flex;
  position: relative;
  appearance: none;
  margin: 0;
  padding: ${rem(4)};
  color: ${getTheme("colors.strokes.light")};

  &::before {
    display: inline-block;
    content: "";
    height: ${rem(16)};
    width: ${rem(16)};
    border-radius: 50%;
    border: 2px solid currentColor;
  }

  &::after {
    display: inline-block;
    transform: scale(0);
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    content: "";
    position: absolute;
    inset: ${rem(8)};
    border-radius: 50%;
    background-color: currentColor;
  }

  &:checked::after {
    transform: scale(1);
  }

  &:checked {
    ${(props) =>
      props.theme.mode === "light" &&
      css`
        color: ${getTheme("colors.green3")};
      `}

    ${(props) =>
      props.theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.green5")};
      `}
  }
`;
