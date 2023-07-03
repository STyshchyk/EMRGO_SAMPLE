import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { TPendingExecutionStatus } from "../TradeManagement.types";

interface IPendingExecutionStatusLabelProps {
  $status: TPendingExecutionStatus;
}

export const PendingExecutionStatusLabel = styled.span<IPendingExecutionStatusLabelProps>`
  ${getTheme("typography.medium.03Tight")}

  ${({ theme, $status }) =>
    theme.mode === "light" &&
    css`
      ${$status === "pending" &&
      css`
        color: ${getTheme("colors.blue")};
      `}

      ${$status === "in-review" &&
      css`
        color: ${getTheme("colors.orange")};
      `}

      ${$status === "rejected" &&
      css`
        color: ${getTheme("colors.red")};
      `}
    `}

  ${({ theme, $status }) =>
    theme.mode === "dark" &&
    css`
      ${$status === "pending" &&
      css`
        color: ${getTheme("colors.lightBlue")};
      `}

      ${$status === "in-review" &&
      css`
        color: ${getTheme("colors.peach")};
      `}

      ${$status === "rejected" &&
      css`
        color: ${getTheme("colors.pink")};
      `}
    `}
`;
