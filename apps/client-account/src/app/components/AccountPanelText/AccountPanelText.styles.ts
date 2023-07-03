import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const AccountPanelText = styled.p`
  margin: 0;
  ${getTheme("typography.medium.02")}

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
