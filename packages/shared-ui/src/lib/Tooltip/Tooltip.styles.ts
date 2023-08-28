import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Tooltip = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${rem(4)};
  padding: ${rem(8)};
  border-radius: ${rem(4)};
  border: 1px solid transparent;
  box-shadow: 0px ${rem(4)} ${rem(8)} rgba(0, 0, 0, 0.24);
  max-width: ${rem(256)};
  z-index: 15;

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      color: ${getTheme("colors.black.60")};
      border-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      color: ${getTheme("colors.white.60")};
      border-color: ${getTheme("colors.strokes.dark")};
    `}
`;
