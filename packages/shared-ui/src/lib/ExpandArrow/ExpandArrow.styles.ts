import { getTheme } from "@emrgo-frontend/theme";
import KeyboardArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardArrowLeftTwoTone";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const ExpandArrow = styled(KeyboardArrowLeftTwoToneIcon)<{ $isHidden: boolean }>`
  z-index: 1000;
  top: 28.5px;
  position: absolute;
  cursor: pointer;
  border-radius: 100%;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.black.20")};
      }
      color: ${getTheme("colors.green3")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green5")};

      &:hover {
        background-color: ${getTheme("colors.white.20")};
      }
    `}
  \`;

  transform: ${(props) =>
    props.$isHidden
      ? ` rotateY(3.142rad)  translateY(-50%) scale(0.9)`
      : `  rotateY(0)   translateY(-50%) scale(0.9)`};
  left: ${(props) => (props.$isHidden ? `${rem(59)}` : `${rem(219)}`)};
`;
