import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

interface IBreadcrumbLinkProps {
  $isCurrent?: boolean;
}

export const BreadcrumbLink = styled.a<IBreadcrumbLinkProps>`
  display: block;
  text-decoration: none;
  padding: ${rem(2)};
  margin: ${rem(-2)};
  border-radius: ${rem(2)};
  ${getTheme("typography.regular.03Tight")}

  &:hover {
    background-color: ${getTheme("colors.black.10")};
  }

  ${({ theme, $isCurrent }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};

      ${$isCurrent &&
      css`
        color: ${getTheme("colors.black.90")};
      `}
    `};

  ${({ theme, $isCurrent }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};

      ${$isCurrent &&
      css`
        color: ${getTheme("colors.white.90")};
      `}
    `};
`;
