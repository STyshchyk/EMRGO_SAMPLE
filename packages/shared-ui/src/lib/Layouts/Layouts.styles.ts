import { rem } from "polished";
import styled from "styled-components";

export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(105)};
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 20px;

  label {
    width: 125px;
  }

  &:first-child {
    margin-bottom: 20px;
  }
`;

export const OneCol = styled.div`
  display: flex;
  max-width: 100%;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
