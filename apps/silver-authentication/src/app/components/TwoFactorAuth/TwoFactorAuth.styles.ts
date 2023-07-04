import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const TwoFactorAuth = styled.div<{ position?: string }>`
  position: ${(props) => props?.position || "relative"};
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export const CompleteRegistration = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: ${rem(112)};
  width: 100%;
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;
export const HelpListItem = styled.li`
  margin: 0;
  padding: 0;

  list-style: none;

  ${getTheme("typography.regular.02")}
`;

export const MainWrapper = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.isVisible ? "center" : "flex-start")};
  width: 100%;
  gap: ${rem(112)};
  flex-wrap: wrap;
`;

export const LeftColumn = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "flex" : "none")};
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
  justify-content: center;
  align-items: center;
`;
export const Spacer = styled.div`
  margin: 10px 0;
`;
