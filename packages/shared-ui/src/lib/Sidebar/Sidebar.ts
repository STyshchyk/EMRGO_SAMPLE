import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      border-right: 1px solid ${getTheme("colors.strokes.light")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      border-right: 1px solid ${getTheme("colors.strokes.dark")};
    `}
`;

export const SidebarHeader = styled.header<{ $isHidden: boolean }>`
  padding: ${rem(24)};
  width: ${(props) => (!props.$isHidden ? `100%` : `93%`)};
  overflow: clip;
`;

export const SidebarFooter = styled.footer`
  margin-top: auto;
  padding-bottom: ${rem(12)};
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarListItem = styled.li`
  white-space: nowrap;

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;

const listItemContentStyles = css`
  display: flex;
  align-items: center;
  column-gap: ${rem(16)};
  padding: ${rem(12)} ${rem(24)};
`;

const linkStyles = css`
  ${listItemContentStyles}
  width: 100%;
  text-decoration: none;
  cursor: pointer;

  &,
  &:hover {
    color: inherit;
  }

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.black.10")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.white.10")};
      }
    `}
`;

const activeLinkStyles = css`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      &,
      &:hover {
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.green3")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      &,
      &:hover {
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.dark")};
      }
    `}
`;

const disabledLinkStyles = css`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      &,
      &:hover {
        opacity: 0.4;
        cursor: default;
        background-color: ${getTheme("colors.white.100")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      &,
      &:hover {
        opacity: 0.4;
        cursor: default;
        background-color: ${getTheme("colors.green1")};
      }
    `}
`;

interface ILinkProps {
  active?: boolean;
  disabled?: boolean;
}

export const SidebarListItemLink = styled.a<ILinkProps>`
  ${linkStyles}
  ${getTheme("typography.medium.01")}

  ${(props) =>
    props.active &&
    css`
      ${getTheme("typography.semiBold.01")}
      ${activeLinkStyles}
    `}

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      ${disabledLinkStyles}
    `}

  &.active {
    ${getTheme("typography.semiBold.01")}
    ${activeLinkStyles}
  }
`;

export const SidebarListItemSecondaryLink = styled.a<ILinkProps>`
  ${linkStyles}
  ${getTheme("typography.medium.02")}

  ${(props) =>
    props.active &&
    css`
      ${getTheme("typography.semiBold.02")}
      ${activeLinkStyles}
    `}


  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      ${disabledLinkStyles}
    `}

  &.active {
    ${getTheme("typography.semiBold.02")}
    ${activeLinkStyles}
  }
`;

export const SidebarListItemContent = styled.div`
  ${listItemContentStyles}
`;

export const SidebarListItemIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
`;
