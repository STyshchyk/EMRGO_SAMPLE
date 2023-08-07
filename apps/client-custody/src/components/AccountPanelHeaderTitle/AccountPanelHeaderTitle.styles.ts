import { PanelHeaderTitle } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import styled from "styled-components";

export const AccountPanelHeaderTitle = styled(PanelHeaderTitle)`
  ${getTheme("typography.medium.01")}
`;
