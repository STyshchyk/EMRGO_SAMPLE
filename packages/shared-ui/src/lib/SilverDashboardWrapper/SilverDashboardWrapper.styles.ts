import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div<{ $isHidden: boolean }>`
  display: grid;
  height: 100vh;
  grid-template-columns: ${(props) =>
    props.$isHidden ? `minmax(auto, ${rem(60)}) 1fr` : `minmax(auto, ${rem(220)}) 1fr`};
  transition: grid-template-columns ease 1s;
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
