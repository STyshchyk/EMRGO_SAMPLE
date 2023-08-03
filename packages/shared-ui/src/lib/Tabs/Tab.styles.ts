import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

interface ITabProps {
  $isActive: boolean;
}

export const Tab = styled.button<ITabProps>`
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  width: "100%";
  padding: ${rem(15)} ${rem(8)};
  ${getTheme("typography.regular.01")}
  border-bottom: ${rem(2)} solid transparent;

  ${({ $isActive }) =>
    $isActive &&
    css`
      border-bottom-color: currentColor;
      ${getTheme("typography.semiBold.01")}
    `}
  ${({ theme, $isActive }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};

      ${$isActive &&
      css`
        color: ${getTheme("colors.green3")};
      `}
    `}
    ${({ theme, $isActive }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};

      ${$isActive &&
      css`
        color: ${getTheme("colors.green5")};
      `}
    `};
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${rem(4)};
`;

export const ContentSizer = styled(Content)`
  height: 0;
  overflow: hidden;
  visibility: hidden;
  ${getTheme("typography.semiBold.01")};
`;
