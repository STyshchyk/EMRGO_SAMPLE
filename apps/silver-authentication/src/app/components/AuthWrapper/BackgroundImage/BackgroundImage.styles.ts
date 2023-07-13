import { rem } from "polished";
import styled from "styled-components";

export const BackgroundImage = styled.div`
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
  }
`;
