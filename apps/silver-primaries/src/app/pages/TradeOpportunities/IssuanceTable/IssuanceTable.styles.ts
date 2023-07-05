import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";
import * as Invited from "../../components/Buttons/Button.styles";

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

export const Button = styled(Invited.Button)``;

export const ButtonBox = styled(Invited.ButtonBox)``;

export const ButtonActions = styled(Invited.ButtonActions)``;
