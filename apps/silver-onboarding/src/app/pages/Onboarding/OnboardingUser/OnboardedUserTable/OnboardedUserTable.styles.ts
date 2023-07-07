import { AriaAttributes } from "react";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";
import { BiDotsVerticalRounded } from "react-icons/bi";

export const OnboardedUserTable = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;

interface IActionProps extends AriaAttributes {
  $isToggled: boolean | undefined;
}

export const Content = styled.div``;
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



export const PanelHeaderIconCustom = styled.span<{ margin?: string }>`
  display: inline-flex;
  font-size: ${rem(24)};
  user-select: none;
  margin: ${(props) => props.margin || "auto"};
`;
export const TableActionButton = styled(BiDotsVerticalRounded)`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green")};
    `}
`;
