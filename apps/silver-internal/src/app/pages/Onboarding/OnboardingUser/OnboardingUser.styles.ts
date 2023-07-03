import { rem } from "polished";
import styled from "styled-components";

export const OnboardingUser = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;
export const Banners = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: ${rem(24)};
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(auto, ${rem(156)}) minmax(auto, ${rem(156)}) auto;
  column-gap: ${rem(16)};
`;
export const Button = styled.div`
  display: inline-block;
  width: max-content;
`;
