import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { IDraggableColumnWrapperProps } from "./DraggableColumn.types";

export const DraggableColumnWrapper = styled.div<IDraggableColumnWrapperProps>`
  padding: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border: 1px solid ${getTheme("colors.strokes.light")};
      background: ${getTheme("colors.black.20")};
      color: ${getTheme("colors.black.100")};
    `}
  ${({ theme, snapshot }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${snapshot.isDragginOver
        ? getTheme("colors.green2")
        : getTheme("colors.dark")};
      border-color: ${getTheme("colors.strokes.dark")};
      color: ${getTheme("colors.white.100")};
    `};
`;
