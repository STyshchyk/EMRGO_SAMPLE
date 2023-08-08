import { AriaAttributes } from "react";

import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

interface IActionProps extends AriaAttributes {
  $isToggled: boolean | undefined;
}
export const Content = styled.div``;

export const InvitedUserTypeLabel = styled.span`
  ${getTheme("typography.medium.03Tight")}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.blue")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
        color: ${getTheme("colors.lightBlue")};
    `}
`;
