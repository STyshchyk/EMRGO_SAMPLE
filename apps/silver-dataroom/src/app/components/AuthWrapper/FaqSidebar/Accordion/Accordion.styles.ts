import { rem } from "polished";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${rem(16)};
  padding: ${rem(16)} 0;
`;
