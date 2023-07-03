import Select from "react-select";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { ErrorIcon as ErrorIconBase } from "../Icons";

export const MySelect = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;
const ReactSelectElement = styled(Select)`

`;
export const Error = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};

  /* Variants */

  span {
    ${({ theme }) => css`
      ${theme.mode === "light" &&
      css`
        color: ${getTheme("colors.black.80")};
      `}
      ${theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.white.80")};
      `}
    `}
  }
`;

export const ErrorIcon = styled(ErrorIconBase)`
  width: ${rem(24)};
  height: ${rem(24)};

  /* Variants */
  ${({ theme }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
  `}
`;
