import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { TOpportunityStatus } from "../../Primaries.types";

interface ILabelProps {
  $status: TOpportunityStatus;
}

export const Label = styled.span<ILabelProps>`
  ${getTheme("typography.medium.03Tight")}

  ${({ theme, $status }) =>
    theme.mode === "light" &&
    css`
      ${$status === "idea" &&
      css`
        color: ${getTheme("colors.blue")};
      `}

      ${$status === "open" &&
      css`
        color: ${getTheme("colors.orange")};
      `}

      ${$status === "closed" &&
      css`
        color: ${getTheme("colors.grey")};
      `}
    `}

  ${({ theme, $status }) =>
    theme.mode === "dark" &&
    css`
      ${$status === "idea" &&
      css`
        color: ${getTheme("colors.lightBlue")};
      `}

      ${$status === "open" &&
      css`
        color: ${getTheme("colors.peach")};
      `}

      ${$status === "closed" &&
      css`
        color: ${getTheme("colors.strokes.light")};
      `}
    `}
`;
