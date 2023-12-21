import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const ExpandArrow = styled.span<{ $isHidden: boolean }>`
  z-index: 1000;
  top: 23px;
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2.25px solid;
  cursor: pointer;
  &:after,
  &:before {
    content: "";
    position: absolute;
    top: -13px;
    bottom: -8px;
    left: -6px;
    right: -1px;
    border-radius: 5px;
    transform: rotate(45deg);
  }

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-color: ${getTheme("colors.green3")} transparent transparent
        ${getTheme("colors.green3")};
      &:hover {
        &:after,
        &:before {
          background-color: ${getTheme("colors.black.10")};
        }
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-color: ${getTheme("colors.green5")} transparent transparent
        ${getTheme("colors.green5")};

      &:hover {
        &:after,
        &:before {
          background-color: ${getTheme("colors.black.10")};
        }
      }
    `}
  \`;

  transform: ${(props) =>
    props.$isHidden
      ? `scale(1.5, 1.5)  rotateY(3.142rad) rotate(-45deg) ;`
      : `scale(1.5, 1.5) rotateY(0) rotate(-45deg)`};

  left: ${(props) => (props.$isHidden ? `${rem(59)}` : `${rem(231)}`)};
  transition: all 1s ease;
`;
