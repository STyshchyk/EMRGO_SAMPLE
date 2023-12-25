import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { ScrollStyles } from "../../ScrollBar";

interface ILinkProps {
  active?: boolean;
  disabled?: boolean;
}

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

export const DashboardSidebar = styled(Sidebar)`
  overflow-y: auto;
  position: relative;
  overflow-x: clip;
  ${ScrollStyles}
`;
export const SidebarListItemIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarListItem = styled.li`
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
  flex-direction: column;
  column-gap: ${rem(16)};
  padding: ${rem(6)} ${rem(12)};
`;

const linkStyles = css`
  ${listItemContentStyles};
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

export const SidebarListItemLink = styled.a<ILinkProps>`
  ${linkStyles}
  ${(props) =>
    props.active &&
    css`
      ${getTheme("typography.regular.02")}
      ${activeLinkStyles}
    `}
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      ${disabledLinkStyles}
    `}
  &.active {
    ${getTheme("typography.regular.02")}
    ${activeLinkStyles}
  }
`;

export const TextWrapper = styled.div`
  ${getTheme("typography.medium.03")};
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 auto;
  padding-bottom: 0.1rem;
`;
export const DateWrapper = styled.div<{ isActive?: boolean; hover?: boolean }>`
  ${getTheme("typography.medium.04")};

  svg {
    transition: all 0.25s ease;
    border-radius: 0.25rem;

    ${(props) =>
      props.hover &&
      css`
        &:hover {
          background-color: ${getTheme("colors.grey")};
          fill: white;
        }
      `}

    ${(props) =>
      props.isActive &&
      css`
        fill: ${getTheme("colors.red")};
        &:hover {
          fill: red;
        }
      `}
  }
`;
export const Elipsis = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0.5rem;
`;
export const SidebarListItemContent = styled.div`
  ${listItemContentStyles}
`;