import { getTheme } from "@emrgo-frontend/theme";
import { ellipsis, rem } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  position: relative;
`;

interface ISelectButtonProps {
  $isOpen: boolean;
}

export const SelectButton = styled.button<ISelectButtonProps>`
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: ${rem(8)};
  background-color: transparent;
  border: 1px solid transparent;
  outline: none;
  border-radius: ${rem(4)};
  padding: ${rem(8)} ${rem(12)};
  padding-right: ${rem(8)};
  ${getTheme("typography.medium.02")}

  ${({ theme, $isOpen }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
      background-color: ${getTheme("colors.white.100")};
      border-color: ${getTheme("colors.strokes.light")};

      ${$isOpen &&
      css`
        border-color: ${getTheme("colors.green3")};
      `}
    `}

  ${({ theme, $isOpen }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
      background-color: ${getTheme("colors.green1")};
      border-color: ${getTheme("colors.strokes.dark")};

      ${$isOpen &&
      css`
        border-color: ${getTheme("colors.green5")};
      `}
    `}
`;

export const SelectButtonLabel = styled.span`
  ${ellipsis()}
`;

export const SelectButtonIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
`;

export const Menu = styled.div`
  min-width: 100%;
  width: "max-content";
  z-index: 2;
`;

export const Options = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid transparent;
  border-radius: ${rem(4)};
  max-height: ${rem(200)};
  overflow-y: auto;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
      background-color: ${getTheme("colors.white.100")};
      border-color: ${getTheme("colors.green3")};
    `};

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
      background-color: ${getTheme("colors.green1")};
      border-color: ${getTheme("colors.green5")};
    `};
`;

interface IOptionProps {
  $isHighlighted: boolean;
  $isSelected: boolean;
}

export const Option = styled.li<IOptionProps>`
  padding: ${rem(8)} ${rem(12)};
  cursor: pointer;
  ${getTheme("typography.medium.02")}

  ${({ theme, $isHighlighted, $isSelected }) =>
    theme.mode === "light" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.black.5")};
      }

      ${($isHighlighted || $isSelected) &&
      css`
        background-color: ${getTheme("colors.black.5")};
      `}
    `}

  ${({ theme, $isHighlighted, $isSelected }) =>
    theme.mode === "dark" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.white.5")};
      }

      ${($isHighlighted || $isSelected) &&
      css`
        background-color: ${getTheme("colors.white.5")};
      `}
    `}
`;
