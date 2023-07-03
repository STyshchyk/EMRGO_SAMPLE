import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { TPanelVariants } from "./Panel.types";

interface IPanelProps {
  $variant: TPanelVariants;
}

export const Panel = styled.div<IPanelProps>`
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  border-radius: ${rem(4)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      border-color: ${getTheme("colors.strokes.light")};
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      border-color: ${getTheme("colors.strokes.dark")};
      color: ${getTheme("colors.white.100")};
    `}

  ${({ $variant }) =>
    $variant === "raised" &&
    css`
      box-shadow: 0px ${rem(4)} ${rem(16)} rgba(0, 0, 0, 0.1);
    `}
`;
