import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { IDraggableColumnWrapperProps } from "./DraggableColumn.types";

export const DraggableColumnWrapper = styled.div<IDraggableColumnWrapperProps>`
  padding: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  ${({ theme, checkEmpty }) =>
    theme.mode === "light" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.light")};
      background: ${getTheme("colors.black.20")};
      ${checkEmpty &&
      css`
        &:empty {
          &:before {
            content: "Displayed colums can not be empty";
            color: red;
          }
        }
      `}
      color: ${getTheme("colors.black.100")};
    `}
  ${({ theme, snapshot, checkEmpty }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${snapshot.isDragginOver
        ? getTheme("colors.green2")
        : getTheme("colors.dark")};
      ${checkEmpty &&
      css`
        &:empty {
          &:before {
            content: "Displayed colums can not be empty";
            color: red;
          }
        }
      `}
      border-color: ${getTheme("colors.strokes.dark")};
      color: ${getTheme("colors.white.100")};
    `};
`;
