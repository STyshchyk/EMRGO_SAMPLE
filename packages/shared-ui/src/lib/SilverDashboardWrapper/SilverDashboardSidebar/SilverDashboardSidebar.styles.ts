import { Sidebar, SidebarListItemIcon } from "@emrgo-frontend/shared-ui";
import { rem } from "polished";
import styled from "styled-components";

import { Badge } from "../../Badge";

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
