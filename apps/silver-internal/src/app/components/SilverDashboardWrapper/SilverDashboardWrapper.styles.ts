import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, ${rem(200)}) 1fr;
  height: 100vh;
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.light")};
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.dark")};
      color: ${getTheme("colors.white.100")};
    `}
`;
