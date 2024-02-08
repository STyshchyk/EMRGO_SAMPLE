import { ellipsis } from "polished";
import styled from "styled-components";

export const AttachedFile = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
`;
export const InfoWrapper = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
  font-size: 16px;
  width: 150px;

  & span:first-child {
    ${ellipsis("150", 1)};
  }

  & span:last-child {
    font-size: 12px;
  }
`;
