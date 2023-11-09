import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const HelpList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: ${rem(8)};

  list-style: none;
`;

export const HelpListItem = styled.li`
  margin: 0;
  padding: 0;

  list-style: none;

  ${getTheme("typography.regular.02")}
  color: ${getTheme("colors.white.100")};

`;
