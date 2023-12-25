import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const ClientSecureMessaging = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
`;
export const TabHeader = styled.div`
  display: flex;
  column-gap: ${rem(8)};
  padding: 0 ${rem(24)};
  min-height: 57px;
  align-items: center;
  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.dark")};
    `}
`;
export const Container = styled.div<{ $isHidden?: boolean }>`
  display: grid;
  height: calc(100vh - 57px);
  grid-template-columns: minmax(auto, ${rem(260)}) 1fr;

  transition: grid-template-columns ease 1s;
`;
export const Content = styled.main`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  position: relative;
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
