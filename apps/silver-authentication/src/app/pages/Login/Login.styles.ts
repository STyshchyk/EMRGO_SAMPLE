import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const LoginForm = styled.div<{ $isAligned?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  min-height: 100vh;
  ${({ $isAligned }) =>
    $isAligned &&
    css`
      justify-content: center;
      align-items: center;
    `}
`;

export const Spacer = styled.div`
  flex: 1;
`;
export const HelpListItem = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;

  ${getTheme("typography.regular.02")}
`;
export const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(32)};
  height: ${rem(32)};
  padding: 0;

  /* Element Styles */
  border: none;
  background-color: ${getTheme("colors.white.20")};
  border-radius: 50%;

  /* Interaction Styles */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${getTheme("colors.white.30")};
  }
`;
