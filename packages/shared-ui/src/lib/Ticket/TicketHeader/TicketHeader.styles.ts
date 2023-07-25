import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const TicketHeader = styled.header`
  display: flex;
  align-items: start;
  column-gap: ${rem(24)};
  padding: ${rem(24)} ${rem(24)} 0;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  border: none;
  padding: 0;
  border-radius: 50%;
  margin-left: auto;
  font-size: ${rem(24)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.black.5")};
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.white.5")};
      color: ${getTheme("colors.white.100")};
    `}
`;
