import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const Logo = styled.div`
  display: inline-flex;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;
