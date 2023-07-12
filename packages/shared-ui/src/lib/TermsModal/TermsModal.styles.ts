import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

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

export const Content = styled.div`
  /* Layout */
  overflow: auto;
  width: 100%;
  padding: 0;
  margin: ${rem(24)} 0;
  flex-grow: 1;

  /* Element Styles */
  border-radius: ${rem(4)};

  /* Text styles */
  ${getTheme("typography.regular.01")}

  /* Theme */
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
      background: ${getTheme("colors.white.100")};
      border: 1px solid ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
      background: ${getTheme("colors.green1")};
      border: 1px solid ${getTheme("colors.strokes.dark")};
    `}

  p {
    margin: ${rem(16)} 0;
  }
`;

export const Footer = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(16)};
`;

export const IconButton = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(24)};
  height: ${rem(24)};
  margin: 0;
  padding: 0;

  /* Element Style */
  border: none;
  border-radius: 50%;
  background: transparent;
  font-size: ${rem(24)};
  cursor: pointer;

  /* Animation */
  transition: all 0.2s ease-in-out;

  /* Theme */
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green3")};
      :hover {
        background: ${getTheme("colors.black.5")};
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green5")};
      :hover {
        background: ${getTheme("colors.white.5")};
      }
    `}
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
