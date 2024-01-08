import { getTheme } from "@emrgo-frontend/theme";
import { css } from "styled-components";

export const ScrollStyles = css`
  &::-webkit-scrollbar-track {
    ${(props) =>
      props.theme.mode === "light" &&
      css`
        background-color: ${getTheme("colors.light")};
      `}

    ${(props) =>
      props.theme.mode === "dark" &&
      css`
        background-color: ${getTheme("colors.dark")};
      `}
  }

  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    ${(props) =>
      props.theme.mode === "light" &&
      css`
        background-color: ${getTheme("colors.green4")};
        border: 1px solid ${getTheme("colors.light")};

        &:hover {
          background-color: ${getTheme("colors.green3")};
        }
      `}

    ${(props) =>
      props.theme.mode === "dark" &&
      css`
        background-color: ${getTheme("colors.green4")};
        border: 1px solid ${getTheme("colors.dark")};

        &:hover {
          background-color: ${getTheme("colors.green3")};
        }
      `}

    border-radius: 3px;
    padding: 1px;
  }

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      scrollbar-color: ${getTheme("colors.green3")} ${getTheme("colors.light")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      scrollbar-color: ${getTheme("colors.green3")} ${getTheme("colors.dark")};
    `}


  scrollbar-width: thin;
`;
