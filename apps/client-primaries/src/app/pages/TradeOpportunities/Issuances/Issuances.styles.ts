import { rem } from "polished";
import styled from "styled-components";

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(auto, ${rem(156)}) minmax(auto, ${rem(156)}) auto;
  column-gap: ${rem(16)};
`;
