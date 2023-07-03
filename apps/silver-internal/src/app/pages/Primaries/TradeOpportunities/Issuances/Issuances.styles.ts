import { rem } from "polished";
import styled from "styled-components";

import { DashboardContent } from "@emrgo-frontend/shared-ui";

export const Header = styled.header`
  padding: ${rem(18)} ${rem(24)};
`;

export const Content = styled(DashboardContent)`
  padding-top: 0;
`;
