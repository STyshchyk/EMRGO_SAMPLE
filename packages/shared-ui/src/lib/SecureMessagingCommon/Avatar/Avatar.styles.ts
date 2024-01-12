import { getTheme } from "@emrgo-frontend/theme";
import { Avatar } from "@mui/material";
import styled, { css } from "styled-components";

export const AvatarIcon = styled(Avatar)<{ width: number; fontSize: number }>`
  background-color: transparent !important;

  height: ${(props) => `${props.width}px !important`};
  width: ${(props) => `${props.width}px !important`};
  font-size: ${(props) => `${props.fontSize}px !important`};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.grey")} !important;
      border: 1px solid ${getTheme("colors.grey")} !important;
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.light")} !important;
      border: 1px solid ${getTheme("colors.light")} !important;
    `}
`;
