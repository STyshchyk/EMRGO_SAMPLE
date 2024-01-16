import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

import { ScrollStyles } from "../../ScrollBar";

interface ILinkProps {
  active?: boolean;
  disabled?: boolean;
  unread?: boolean;
}

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  padding-right: 0.25rem;
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      border-right: 1px solid ${getTheme("colors.strokes.light")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      border-right: 1px solid ${getTheme("colors.strokes.dark")};
    `}
`;

export const DashboardSidebar = styled(Sidebar)`
  overflow-y: auto;
  position: relative;
  overflow-x: clip;
  ${ScrollStyles}
`;
