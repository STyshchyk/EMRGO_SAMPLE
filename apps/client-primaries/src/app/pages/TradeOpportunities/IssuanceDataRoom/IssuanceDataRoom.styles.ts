import { rem } from "polished";
import styled from "styled-components";

export const Documents = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${rem(12)};
`;
