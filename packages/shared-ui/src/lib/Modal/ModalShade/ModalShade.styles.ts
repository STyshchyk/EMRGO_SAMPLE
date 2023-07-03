import { rem } from "polished";
import styled, { css } from "styled-components";

import { IModalShadeStylesProps } from "./ModalShade.types";

export const StyledModalShade = styled.div<IModalShadeStylesProps>`
  /* Layout */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${rem(20)};

  /* Animation */
  transition: all 0.2s ease-in-out;
  ${({ $shaded = true, $reveal }) => {
    if ($shaded)
      return css`
        background: ${$reveal ? " rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"};
      `;
  }}
`;
