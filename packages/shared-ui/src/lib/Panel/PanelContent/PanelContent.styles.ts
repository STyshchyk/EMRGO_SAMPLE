import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const PanelContent = styled.div`
  flex: 1;
  position: relative;
  padding: ${rem(16)};
  ${getTheme("typography.medium.03")}
`;
