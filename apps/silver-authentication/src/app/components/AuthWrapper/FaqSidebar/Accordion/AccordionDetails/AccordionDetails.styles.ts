import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const AccordionDetails = styled.div`
  padding-top: ${rem(16)};
  ${getTheme("typography.regular.03Tight")}
`;
