import { getTheme } from "@emrgo-frontend/theme";
import { css } from "styled-components";

export const ScrollStyles = css`
  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    height: 3px;
    width: 3px;
    background-color: ${getTheme("colors.green3")};
  }

  scrollbar-color: ${getTheme("colors.green3")} #f5f5f5;
  scrollbar-width: thin;

  &::-webkit-scrollbar-thumb {
    background-color: ${getTheme("colors.green3")};
    border: 1px solid ${getTheme("colors.green3")};
  }
`;
