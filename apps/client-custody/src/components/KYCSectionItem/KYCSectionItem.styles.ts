import { CheckNotificationIcon } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const KYCSectionItem = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  gap: ${rem(16)};
  height: ${rem(48)};
  padding: 0 ${rem(12)};

  /* Element Styles */
  background: ${getTheme("colors.white.100")};
  border-radius: ${rem(4)};
`;

export const Text = styled.span`
  ${getTheme("typography.heading.03")}
  color: ${getTheme("colors.black.100")};
`;

export const Spacer = styled.span`
  flex: 1;
`;
export const Time = styled.span`
  ${getTheme("typography.semiBold.01")}
  color: ${getTheme("colors.green3")};
`;

export const CompletedIcon = styled(CheckNotificationIcon)`
  display: inline-flex;
  color: ${getTheme("colors.green3")};
  font-size: ${rem(24)};
`;
