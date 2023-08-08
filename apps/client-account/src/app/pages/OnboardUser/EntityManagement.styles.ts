import { rem } from "polished";
import styled from "styled-components";

import { AccountPanelContent } from "../../components/AccountPanelContent";

export const OnboardUser = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */


`;


export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: start;
  gap: ${rem(24)};
`;

export const QuestionnairePanelContent = styled(AccountPanelContent)`
  padding-bottom: ${rem(8)};
`;


export const EntityDetails = styled.div`
 
 & > div:nth-child(1) {
    padding-bottom: ${rem(24)};
  }
`;
