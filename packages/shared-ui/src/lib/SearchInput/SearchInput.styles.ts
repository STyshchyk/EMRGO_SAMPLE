import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  position: relative;
`;

export const Icon = styled.span`
  display: inline-flex;
  position: absolute;
  left: ${rem(8)};
  font-size: ${rem(24)};
  top: 50%;
  transform: translateY(-50%);
`;

interface IInputProps {
  $isClearButtonVisible: boolean;
}

export const Input = styled.input<IInputProps>`
  box-sizing: border-box;
  appearance: none;
  border: 1px solid transparent;
  border-radius: ${rem(4)};
  padding: ${rem(8)};
  padding-left: ${rem(40)};
  width: 100%;
  ${getTheme("typography.medium.02")}

  &::-webkit-search-cancel-button {
    appearance: none;
  }

  ${({ $isClearButtonVisible }) =>
    $isClearButtonVisible &&
    css`
      padding-right: ${rem(40)};
    `}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-color: ${getTheme("colors.strokes.light")};
      caret-color: ${getTheme("colors.green3")};
      background-color: ${getTheme("colors.white.100")};
      color: ${getTheme("colors.black.100")};

      &::placeholder {
        color: ${getTheme("colors.black.60")};
      }

      & + ${Icon} {
        color: ${getTheme("colors.black.60")};
      }

      &:focus {
        border-color: ${getTheme("colors.green3")};
        outline: none;

        & + ${Icon} {
          color: ${getTheme("colors.green3")};
        }
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-color: ${getTheme("colors.strokes.dark")};
      caret-color: ${getTheme("colors.green5")};
      background-color: ${getTheme("colors.green1")};
      color: ${getTheme("colors.white.100")};

      &::placeholder {
        color: ${getTheme("colors.white.60")};
      }

      & + ${Icon} {
        color: ${getTheme("colors.white.60")};
      }

      &:focus {
        border-color: ${getTheme("colors.green5")};
        outline: none;

        & + ${Icon} {
          color: ${getTheme("colors.green5")};
        }
      }
    `}
`;

export const ClearButton = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: ${rem(24)};
  position: absolute;
  right: ${rem(8)};
  top: 50%;
  transform: translateY(-50%);

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;
