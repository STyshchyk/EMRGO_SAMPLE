import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

import CheckMarkIcon from "./Assets/check-mark.svg";

export const Label = styled.label`
  display: inline-flex;
  column-gap: ${rem(10)};
  color: ${getTheme("colors.white.100")};

  ${getTheme("typography.regular.02")}
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
