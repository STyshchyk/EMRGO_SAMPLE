import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { TPendingSettlementStatus } from "../PostTrade.types";

interface IPendingSettlementStatusLabelProps {
  $status: TPendingSettlementStatus;
}

export const PendingSettlementStatusLabel = styled.span<IPendingSettlementStatusLabelProps>`
  ${getTheme("typography.medium.03Tight")}

  ${({ theme, $status }) =>
    theme.mode === "light" &&
    css`
      ${$status === "payment-pending" &&
      css`
        color: ${getTheme("colors.blue")};
      `}

      ${$status === "payment-received" &&
      css`
        color: ${getTheme("colors.green")};
      `}

      ${$status === "failure" &&
      css`
        color: ${getTheme("colors.red")};
      `}
    `}

  ${({ theme, $status }) =>
    theme.mode === "dark" &&
    css`
      ${$status === "payment-pending" &&
      css`
        color: ${getTheme("colors.lightBlue")};
      `}

      ${$status === "payment-received" &&
      css`
        color: ${getTheme("colors.mint")};
      `}

      ${$status === "failure" &&
      css`
        color: ${getTheme("colors.pink")};
      `}
    `}
`;
