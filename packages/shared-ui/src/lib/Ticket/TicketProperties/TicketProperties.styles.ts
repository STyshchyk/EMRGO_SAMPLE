import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { Properties } from "../../Properties";

export const TicketProperties = styled(Properties)`
  margin: 0;
  margin-bottom: ${rem(16)};
  padding: ${rem(24)};
  border: 1px solid transparent;
  border-radius: ${rem(4)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      border-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      border-color: ${getTheme("colors.strokes.dark")};
    `}
`;
