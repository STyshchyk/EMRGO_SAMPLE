import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const TicketAction = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  align-self: end;
  font-size: ${rem(32)};
  border-radius: ${rem(2)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green3")};

      &:hover {
        background-color: ${getTheme("colors.black.5")};
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green5")};

      &:hover {
        background-color: ${getTheme("colors.white.5")};
      }
    `}
`;
