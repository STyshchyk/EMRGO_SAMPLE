import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const TwoFAstepper = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */

  justify-content: center;
  align-items: center;
`;
export const SelectOption = styled.form`
  display: flex;
  flex-direction: column;
  width: calc(659px - 3rem);
  gap: ${rem(24)};
  padding: 2.5rem;
  h1,
  p {
    text-align: center;
  }
  p {
    margin-top: 13px;
  }
  div:has(label) {
    margin-top: 85px;
  }
`;
