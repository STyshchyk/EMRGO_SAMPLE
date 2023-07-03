import {
  Panel as PanelComponent,
  Properties as PropertiesComponent,
} from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Panel = styled(PanelComponent)`
  grid-column: 1 / 3;
`;

export const Properties = styled(PropertiesComponent)`
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid transparent;
  margin-bottom: ${rem(16)};
  padding-bottom: ${rem(16)};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-bottom-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-bottom-color: ${getTheme("colors.strokes.dark")};
    `}
`;

export const ProfileTitle = styled.h3`
  margin: 0;
  ${getTheme("typography.medium.03")}
`;

export const ProfileDetails = styled.p`
  margin: 0;
  ${getTheme("typography.regular.03Tight")}

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
