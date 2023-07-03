import { rem } from "polished";
import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(24)};
`;

export const UserNameDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${rem(24)};
`;
