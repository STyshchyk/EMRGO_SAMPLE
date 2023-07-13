import { rem } from "polished";
import styled from "styled-components";

export const SignupFrame = styled.div`
  /* Layout */
  width: 100vw;
  height: 100vh;
  display: flex;

  /* Element Styles */
  background: linear-gradient(44.8deg, #012a38 1.73%, #8eb4c1 238.74%);
`;

export const PageContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  overflow: auto;
`;

export const FormContent = styled.div`
  /* Layout */
  width: 50%;
  min-width: ${rem(500)};
  margin-left: ${rem(100)};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: ${rem(30)};
  position: fixed;
  width: 100vw;
`;
