import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const TicketTitle = styled.h2`
  margin: 0;
  ${getTheme("typography.heading.02")}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;
