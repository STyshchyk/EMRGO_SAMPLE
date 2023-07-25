import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const PropertyValue = styled.dd`
  margin: 0;
  ${getTheme("typography.medium.03")}

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
