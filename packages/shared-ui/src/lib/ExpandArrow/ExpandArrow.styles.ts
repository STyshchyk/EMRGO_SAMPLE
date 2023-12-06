import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const ExpandArrow = styled.span<{ $isHidden: boolean }>`
  z-index: 1000;
  top: 2.5%;
  position: absolute;
  display: inline-block;
  width: 0;
  height: 0;
  &:after,
  &:before {
    content: "";
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -2px;
    right: -6px;
  }
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-right: 3px solid ${getTheme("colors.green3")}; /* Change the color as needed */

      &:hover {
        cursor: pointer;
        border-right: 3px solid ${getTheme("colors.green5")}; /* Change the color as needed */
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-right: 3px solid ${getTheme("colors.green5")}; /* Change the color as needed */

      &:hover {
        cursor: pointer;
        border-right: 3px solid ${getTheme("colors.green3")}; /* Change the color as needed */
      }
    `}
\`;

  transform: ${(props) =>
    props.$isHidden ? `scale(3, 3) rotateY(3.142rad);` : `scale(3, 3) rotate(0deg)`};

  left: ${(props) => (props.$isHidden ? `${rem(67)}` : `${rem(227)}`)};
  transition: left ease 1s, transform ease 1s, background-color 0.25s ease-in-out, border 1s ease;
`;
