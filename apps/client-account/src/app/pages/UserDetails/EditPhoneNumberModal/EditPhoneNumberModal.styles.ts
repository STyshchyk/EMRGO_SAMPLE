import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

const maxWidth = 458;

export const Wrapper = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex: 1;
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

export const Content = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0;
  margin: ${rem(24)} 0;
  flex-grow: 1;
  row-gap: ${rem(16)};

  /* Element Styles */
  border-radius: ${rem(4)};

  /* Text styles */
  ${getTheme("typography.regular.01")}

  p {
    margin: ${rem(16)} 0;
  }
`;

export const Footer = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(16)};
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

export const Subtitle = styled.div`
  /* Text styles */
  ${getTheme("typography.regular.02")} /* Theme */ ${({ theme }) =>
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
