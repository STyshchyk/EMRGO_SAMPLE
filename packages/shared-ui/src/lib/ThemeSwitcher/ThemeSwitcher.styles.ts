import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { TThemeSwitchVariant } from "./ThemeSwitcher.types";

interface ILabelProps {
  $variant: TThemeSwitchVariant;
}

export const Label = styled.label<ILabelProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: ${rem(20)};
  border: 2px solid transparent;
  cursor: pointer;
  user-select: none;

  ${(props) =>
    props.$variant === "standard" &&
    css`
      ${Input} {
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

        &:checked {
          transform: translateX(-100%);
        }
      }

      ${(props) =>
        props.theme.mode === "light" &&
        css`
          background-color: ${getTheme("colors.strokes.light")};
          border-color: ${getTheme("colors.strokes.light")};
        `}

      ${(props) =>
        props.theme.mode === "dark" &&
        css`
          background-color: ${getTheme("colors.dark")};
          border-color: ${getTheme("colors.dark")};
        `}
    `}

  ${(props) =>
    props.$variant === "compact" &&
    css`
      ${props.theme.mode === "light" &&
      css`
        border-color: ${getTheme("colors.black.20")};
      `}

      ${props.theme.mode === "dark" &&
      css`
        border-color: ${getTheme("colors.white.60")};
      `}
    `}
`;

export const Input = styled.input`
  appearance: none;
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  pointer-events: none;
  width: ${rem(20)};
  height: ${rem(20)};
  border-radius: 50%;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
    `}
`;

export const Icon = styled.span`
  display: inline-flex;
  position: relative;
  font-size: ${rem(16)};
  padding: ${rem(2)};
  border-radius: 50%;

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

export const ActiveIcon = styled(Icon)`
  color: ${getTheme("colors.yellow")};
`;
