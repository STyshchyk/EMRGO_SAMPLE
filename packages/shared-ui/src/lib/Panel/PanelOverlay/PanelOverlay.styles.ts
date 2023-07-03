import { rem, rgba } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const PanelOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  backdrop-filter: blur(4px);
  border-bottom-left-radius: ${rem(4)};
  border-bottom-right-radius: ${rem(4)};

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${rgba(getTheme("colors.strokes.light")(props), 0.75)};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${rgba(getTheme("colors.dark")(props), 0.75)};
    `}
`;
