import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

import { AccountPanelContent } from "../../components/AccountPanelContent";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
  gap: ${rem(24)};
`;

export const QuestionnairePanelContent = styled(AccountPanelContent)`
  padding-bottom: ${rem(8)};
`;

export const Text = styled.p`
  margin: 0;
  ${getTheme("typography.regular.03Tight")}
`;
