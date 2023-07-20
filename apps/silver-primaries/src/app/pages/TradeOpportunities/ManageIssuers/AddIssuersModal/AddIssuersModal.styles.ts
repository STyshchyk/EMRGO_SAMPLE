import { rem } from "polished";
import styled from "styled-components";

const maxWidth = 458;

export const AddIssuersModal = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;
export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(24)};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 16px;
  & > label:first-child {
    width: 175px;
  }
  & > div > div:has(input[type="text"]) {
    width: 292px;
  }
  button {
    margin-left: auto;
  }
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;
