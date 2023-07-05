import { rem } from "polished";
import styled, { css } from "styled-components";

export const EmrgoBackgroundAnimation = styled.div<{ $reveal: boolean }>`
  /* Layout */
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1;

  /* Model Viewer */
  model-viewer {
    width: 56vw;
    height: 56vw;
    margin-left: auto;
    right: -10.41667vw;
    bottom: -10.41667vw;
    mix-blend-mode: unset;

    /* Reveal Animation - hides the janky loading */
    transition: opacity 10s 2s ease-in-out, transform 6s ease-in-out;
    ${({ $reveal }) =>
      css`
        ${!$reveal &&
        css`
          opacity: 0;
          transform: translateX(50vw);
        `}
        ${$reveal &&
        css`
          opacity: 1;
          transform: translateX(0);
        `}
      `}
  }
`;
