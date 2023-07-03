import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { CloseIcon as CloseIconBase } from "../../Icons";
import { IModalDialogStyleProps } from "./ModalDialog.types";

export const Wrapper = styled.div<IModalDialogStyleProps>`
  /* Layout */
  width: ${({ $width = 800 }) => $width};
  max-height: calc(100vh - ${rem(110)});
  padding: ${rem(24)};
  display: flex;
  flex-direction: column;
  min-height: 0;

  /* Element Styles */
  border-radius: ${rem(4)};

  /* Theme */
  ${({ theme, variant = "default" }) =>
    theme.mode === "light" &&
    variant === "default" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.light")};
      background: ${getTheme("colors.white.100")};
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme, variant = "default" }) =>
    theme.mode === "light" &&
    variant === "darkened" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.light")};
      background: ${getTheme("colors.light")};
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme, variant = "default" }) =>
    theme.mode === "dark" &&
    variant === "default" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.dark")};
      background: ${getTheme("colors.green1")};
      color: ${getTheme("colors.white.100")};
    `}

    ${({ theme, variant = "default" }) =>
    theme.mode === "dark" &&
    variant === "darkened" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.dark")};
      background: ${getTheme("colors.dark")};
      color: ${getTheme("colors.white.100")};
    `}

  /* Animation */
  transition: all 0.2s ease-in-out;
  ${({ $reveal }) =>
    $reveal
      ? `
        opacity: 1;
        transform: translate(0, 0)`
      : `
        opacity: 0;
        transform: translate(0, -2rem)
        `};
`;

export const Header = styled.div`
  display: flex;
  position: relative;
`;

export const Title = styled.h2`
  margin: 0 ${rem(48)} 0 0;

  ${getTheme("typography.heading.01")}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;

export const CloseButton = styled.button`
  /* Layout */
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(24)};
  height: ${rem(24)};
  margin: 0;
  padding: 0;

  /* Element Style */
  border: none;
  border-radius: 50%;
  cursor: pointer;

  /* Theme */
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
      background: ${getTheme("colors.black.5")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
      background: ${getTheme("colors.white.5")};
    `}
`;

export const CloseIcon = styled(CloseIconBase)`
  width: ${rem(24)};
  height: ${rem(24)};
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const Content = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
