import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";
export const Primaries = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
export const Title = styled.h2`
  /* Layout */
  margin: 0;

  /* Text styles */
  ${getTheme("typography.heading.02")}

  /* Theme */
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

export const Subtitle = styled.div`
  /* Text styles */
  ${getTheme("typography.regular.01")}

  /* Theme */
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
