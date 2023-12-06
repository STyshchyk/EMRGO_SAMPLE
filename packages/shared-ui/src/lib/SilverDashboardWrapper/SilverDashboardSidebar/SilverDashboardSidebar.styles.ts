import { Sidebar, SidebarListItemIcon } from "@emrgo-frontend/shared-ui";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
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

export const ExpandArrow = styled(ArrowLeftIcon)<{ $isHidden: boolean }>`
  position: absolute;
  z-index: 1000;
  top: 50%;
  height: 50px;

  &:hover {
    background-color: rgba(128, 128, 128, 0.1);
    cursor: pointer;
  }

  transform: ${(props) =>
    props.$isHidden ? `scale(1.5, 4) rotateY(3.142rad);` : `scale(1.5, 4) rotate(0deg)`};

  left: ${(props) => (props.$isHidden ? `${rem(65)}` : `${rem(225)}`)};
  transition: left ease 1s, transform ease 1s, background-color 0.25s ease-in-out;
`;
