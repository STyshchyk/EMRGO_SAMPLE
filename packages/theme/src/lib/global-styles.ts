import { createGlobalStyle, css } from "styled-components";

import { TTheme } from "./theme";

export const GlobalStyles = createGlobalStyle`
  /* add your global styles here */

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;

    width: 100vw;
    height: 100vh;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  #root {
    width: 100vw;
    height: 100vh;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    font-family: inherit;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }

    a:hover {
      color: #747bff;
    }

    button {
      background-color: #f9f9f9;
    }
  }

  a {
    text-decoration: none;
  }

  ${({ theme }: { theme: TTheme }) =>
          // TODO: Confirm light mode anchor colours
          theme.mode === "light" &&
          css`
            a {
              color: ${theme.colors.green3};
            }
          `}
  ${({ theme }: { theme: TTheme }) =>
          theme.mode === "dark" &&
          css`
            a {
              color: ${theme.colors.green5};
            }
          `}
`;
