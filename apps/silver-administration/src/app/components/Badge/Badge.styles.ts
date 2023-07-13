import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const Badge = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: ${rem(16)};
  width: ${rem(16)};
  border-radius: 50%;
  color: ${getTheme("colors.white.100")};
  background-color: ${getTheme("colors.red")};

  ${getTheme("typography.semiBold.03Tight")}
`;
