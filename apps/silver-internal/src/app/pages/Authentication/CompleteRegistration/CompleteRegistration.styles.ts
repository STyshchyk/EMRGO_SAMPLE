import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const CompleteRegistration = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(112)};
  width: calc(100vw - 6.25rem);
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;
export const HelpListItem = styled.li`
  margin: 0;
  padding: 0;

  list-style: none;

  ${getTheme("typography.regular.02")}
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: ${rem(112)};
  margin-left: -6.25rem;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  width: 544px;
  justify-content: center;
  align-items: center;
`;
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  width: 544px;
  justify-content: stretch;
  align-items: center;
`;
export const Spacer = styled.div`
  flex: 1;
`;
