import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

interface IActionProps {
  $isToggled: boolean;
}

export const Action = styled.button<IActionProps>`
  display: inline-flex;
  margin-left: auto;
  appearance: none;
  cursor: pointer;
  padding: 0;
  background-color: transparent;
  border: none;
  font-size: ${rem(24)};

  ${({ theme, $isToggled }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};

      &:hover {
        color: ${getTheme("colors.black.100")};
      }

      ${$isToggled &&
      css`
        color: ${getTheme("colors.black.100")};
      `}
    `}

  ${({ theme, $isToggled }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};

      &:hover {
        color: ${getTheme("colors.white.100")};
      }

      ${$isToggled &&
      css`
        color: ${getTheme("colors.white.100")};
      `}
    `}
`;

export const Button = styled.button<IActionProps>`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  margin-left: auto;
  padding: 0;
  background-color: transparent;
  border: none;
  font-size: ${rem(24)};
  position: relative;

  ${({ theme, $isToggled }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};

      &:hover {
        color: ${getTheme("colors.black.100")};
      }

      ${$isToggled &&
      css`
        color: ${getTheme("colors.black.100")};
      `}
    `}

  ${({ theme, $isToggled }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};

      &:hover {
        color: ${getTheme("colors.white.100")};
      }

      ${$isToggled &&
      css`
        color: ${getTheme("colors.white.100")};
      `}
    `}
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  appearance: none;
  cursor: pointer;
  position: relative;
  border-radius: 10px;
  padding: 5px 10px;
  gap: 5px 0px;
  background-color: rgba(4, 37, 49, 0);
  width: max-content;
  z-index: 1000;
  //border: 1px solid #446875;
`;

export const ButtonActions = styled.button`
  display: flex;
  margin: 5px 0px;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: ${rem(12)};
  &:hover {
    color: #11e4d9;
  }
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
