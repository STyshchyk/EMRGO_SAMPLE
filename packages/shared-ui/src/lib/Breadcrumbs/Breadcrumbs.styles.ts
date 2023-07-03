import { rem } from "polished";
import styled, { css } from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const Breadcrumbs = styled.ol`
  display: flex;
  align-items: center;
  column-gap: ${rem(6)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const BreadcrumbItem = styled.li``;

export const BreadCrumbIcon = styled.span`
  display: flex;
  font-size: ${rem(16)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;
