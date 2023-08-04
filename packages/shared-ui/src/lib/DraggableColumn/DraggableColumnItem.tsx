import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { IDraggableColumnItemProps } from "./DraggableColumn.types";

export const DraggableColumnItem = styled.div<IDraggableColumnItemProps>`
  padding: 0.6rem 1rem;
  user-select: "none";
  margin: 0 0 1rem 0;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;

  ${({ theme, snapshot, isDisplayed }) =>
    theme.mode === "light" &&
    isDisplayed === true &&
    css`
      :hover {
        border-color: ${getTheme("colors.black.20")};
      }
      background-color: ${getTheme("colors.white.100")};
      border-color: ${snapshot.isDragging ? getTheme("colors.green5") : getTheme("colors.light")};
      color: ${getTheme("colors.black.100")};
    `};

  ${({ theme, snapshot, isDisplayed }) =>
    theme.mode === "light" &&
    isDisplayed === false &&
    css`
      :hover {
        border-color: ${getTheme("colors.black.10")};
      }
      background-color: ${getTheme("colors.white.60")};
      border-color: ${snapshot.isDragging ? getTheme("colors.green5") : getTheme("colors.light")};
      color: ${getTheme("colors.black.80")};
    `};

  // DARK
  ${({ theme, snapshot, isDisplayed }) =>
    theme.mode === "dark" &&
    isDisplayed === true &&
    css`
      :hover {
        border-color: ${getTheme("colors.green1")};
      }
      background-color: ${getTheme("colors.green2")};
      border-color: ${snapshot.isDragging ? getTheme("colors.green5") : getTheme("colors.green2")};
      color: ${getTheme("colors.white.100")};
    `};

  ${({ theme, snapshot, isDisplayed }) =>
    theme.mode === "dark" &&
    isDisplayed === false &&
    css`
      :hover {
        border-color: ${getTheme("colors.dark")};
      }
      background-color: ${getTheme("colors.green1")};
      border-color: ${snapshot.isDragging ? getTheme("colors.green5") : getTheme("colors.green1")};
      color: ${getTheme("colors.white.50")};
    `};
`;
