import { rem } from "polished";
import styled from "styled-components";

import { Badge } from "../../Badge";
import { Sidebar, SidebarListItemIcon } from "../../Sidebar";

export const DashboardSidebar = styled(Sidebar)`
  overflow-y: auto;
`;

export const SidebarListItemIconWithBadge = styled(SidebarListItemIcon)`
  position: relative;
`;

export const NotificationsBadge = styled(Badge)`
  position: absolute;
  top: ${rem(-4)};
  right: ${rem(-4)};
`;
