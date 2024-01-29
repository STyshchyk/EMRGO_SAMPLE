import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const Logo = styled.div<{ $isHidden?: boolean }>`
  display: inline-flex;
  transition: transform 1s ease;
  ${(props) =>
    props.$isHidden &&
    css`
      transform: scale(0.8) translateX(-35px);
    `}
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
