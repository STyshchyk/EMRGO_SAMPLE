import { AccountPanelContent } from "../../components/AccountPanelContent";
import styled from "styled-components";
import { rem } from "polished";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
  gap: ${rem(24)};
`;

export const QuestionnairePanelContent = styled(AccountPanelContent)`
  padding-bottom: ${rem(8)};
`;
