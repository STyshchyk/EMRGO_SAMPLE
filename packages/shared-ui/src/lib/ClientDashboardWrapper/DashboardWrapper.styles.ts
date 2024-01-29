import styled from "styled-components";

import {
  Container as SideBarContainer,
  Content as SideBarContent,
} from "../SilverDashboardWrapper";

export const Container = styled(SideBarContainer)<{ $isHidden: boolean }>``;
export const Content = styled(SideBarContent)``;
