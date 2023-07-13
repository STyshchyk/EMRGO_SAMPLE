import { rem } from "polished";
import styled from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const TicketText = styled.p`
  margin: 0;
  ${getTheme("typography.regular.03")}

  & + & {
    margin-top: ${rem(4)};
  }
`;