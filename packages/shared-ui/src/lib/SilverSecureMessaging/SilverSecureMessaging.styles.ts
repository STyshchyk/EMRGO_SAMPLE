import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const SilverSecureMessaging = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
`;
export const Container = styled.div<{ $isHidden?: boolean }>`
  display: grid;
  height: calc(100vh - 85px);
  grid-template-columns: minmax(auto, ${rem(300)}) 1fr;

  transition: grid-template-columns ease 1s;
`;
export const Content = styled.main`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  position: relative;
  padding: 1.5rem;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.light")};
      color: ${getTheme("colors.black.100")};
    `}
  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.dark")};
      color: ${getTheme("colors.white.100")};
    `};
`;
