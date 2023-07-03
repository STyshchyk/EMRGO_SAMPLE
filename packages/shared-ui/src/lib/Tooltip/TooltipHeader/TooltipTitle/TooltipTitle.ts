import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const TooltipTitle = styled.h4`
  margin: 0;
  ${getTheme("typography.medium.03Tight")}

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
