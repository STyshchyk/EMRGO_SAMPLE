import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const DownloadButton = styled.button`
  display: inline-flex;
  appearance: none;
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  padding: ${rem(8)};
  font-size: ${rem(24)};
  border-radius: ${rem(4)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      color: ${getTheme("colors.black.60")};
      border-color: ${getTheme("colors.strokes.light")};

      &:hover {
        background-image: linear-gradient(
          0deg,
          ${getTheme("colors.black.5")},
          ${getTheme("colors.black.5")}
        );
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      color: ${getTheme("colors.white.60")};
      border-color: ${getTheme("colors.strokes.dark")};

      &:hover {
        background-image: linear-gradient(
          0deg,
          ${getTheme("colors.white.5")},
          ${getTheme("colors.white.5")}
        );
      }
    `}
`;
