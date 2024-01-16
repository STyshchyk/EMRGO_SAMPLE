import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import CheckMarkIcon from "./Assets/check-mark.svg";
import indeterminateMarkIcon from "./Assets/indeterminate-icon.svg";

export const Label = styled.label`
  display: inline-flex;
  column-gap: ${rem(10)};
  color: ${getTheme("colors.white.100")};

  ${getTheme("typography.regular.02")}
`;

export const LabelText = styled.span`
  color: ${getTheme("colors.black.100")};

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
export const Checkbox = styled.input`
  display: inline-flex;
  align-items: center;
  appearance: none;
  margin: 0;
  height: ${rem(24)};

  &:checked::before {
    display: none;
  }

  &:not(:checked)::after {
    display: none;
  }

  &:indeterminate {
    &::before {
      display: inline-flex;
      content: "";
      height: ${rem(17)};
      width: ${rem(17)};
      border-radius: ${rem(4)};
      border: 1px solid ${getTheme("colors.strokes.light")};

      background-image: url(${indeterminateMarkIcon});
      background-repeat: no-repeat;
      background-position: center;
      background-color: ${getTheme("colors.green5")};
    }
  }

  &::before,
  &::after {
    display: inline-flex;
    content: "";
    height: ${rem(17)};
    width: ${rem(17)};
    border-radius: ${rem(4)};
    border: 1px solid ${getTheme("colors.strokes.light")};
  }

  &::before {
    background-color: ${getTheme("colors.white.100")};
  }

  &::after {
    background-image: url(${CheckMarkIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-color: ${getTheme("colors.green5")};
  }
`;
