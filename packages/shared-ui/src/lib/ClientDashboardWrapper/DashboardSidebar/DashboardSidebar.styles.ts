import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { Badge } from "../../Badge";
import { Sidebar, SidebarListItemIcon } from "../../Sidebar";

export const DashboardSidebar = styled(Sidebar)`
  overflow-y: auto;
  position: relative;
  overflow-x: clip;
`;

export const SidebarListItemIconWithBadge = styled(SidebarListItemIcon)`
  position: relative;
`;

export const NotificationsBadge = styled(Badge)`
  position: absolute;
  top: ${rem(-4)};
  right: ${rem(-4)};
`;

export const SidebarListItemAccountLabel = styled.span`
  flex: 1;
`;

export const SidebarListItemAccountAvatar = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 3rem;
  border-width: 1px;
  border-style: solid;
  font-size: 0.6rem;
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      border-color: ${getTheme("colors.black.60")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      border-color: ${getTheme("colors.white.60")};
    `}
`;
