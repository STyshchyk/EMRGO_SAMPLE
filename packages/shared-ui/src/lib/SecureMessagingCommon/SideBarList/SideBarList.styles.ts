import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const SideBarList = styled.nav`
  padding: 2rem 0;
  /* Layout */ /* Element Styles */ /* Text styles */
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarListItem = styled.li`
  width: 100%;
  position: relative;
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

  border-bottom: 1px solid ${getTheme("colors.strokes.light")};

  &:first-child {
    border-top: 1px solid ${getTheme("colors.strokes.light")};
  }
`;

const listItemContentStyles = css`
  display: flex;
  flex-direction: column;
  padding: ${rem(8)} ${rem(32)} ${rem(8)} ${rem(40)};
`;

const linkStyles = css`
  ${listItemContentStyles};
  width: 100%;
  text-decoration: none;
  cursor: pointer;
  position: relative;

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

const unreadLinkStyles = css`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      &,
      &:hover {
        color: ${getTheme("colors.white.60")};
        background-color: ${getTheme("colors.green2")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      &,
      &:hover {
        color: ${getTheme("colors.white.60")};
        background-color: ${getTheme("colors.green2")};
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
export const Initials = styled.span<{ isChecked?: boolean; $isCheckMode?: boolean }>`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%) translateX(0.25rem);
  display: ${(props) => (!!props.isChecked || !!props.$isCheckMode ? "none" : "flex")};
`;
export const Delete = styled.span<{ isChecked?: boolean; checkMode?: boolean }>`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  width: 26px;
  height: 100%;
  display: none;
  align-items: center;

  &:hover {
    background-color: rgba(255, 0, 0, 0.28);

    svg {
      fill: red !important;
    }
  }

  transition: all 0.5s ease;
  cursor: pointer;
`;

export const Select = styled.span<{ isChecked?: boolean; checkMode?: boolean }>`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  width: 26px;
  height: 26px;
  display: ${(props) => (!!props.isChecked || !!props.checkMode ? "flex" : "none")};
  cursor: pointer;
  z-index: 10000;
`;

export const SidebarListItemLink = styled.a<{
  $IsActive: boolean;
  $IsNew: boolean;
  $IsDisabled?: boolean;
}>`
  ${linkStyles};
  position: relative;

  ${({ $IsActive }) =>
    $IsActive &&
    css`
      ${getTheme("typography.regular.02")}
      ${activeLinkStyles}
    `}
  ${({ $IsNew }) =>
    $IsNew &&
    css`
      ${getTheme("typography.semiBold.02")}
      ${unreadLinkStyles}
    `}
  ${({ $IsDisabled }) =>
    $IsDisabled &&
    css`
      pointer-events: none;
      ${disabledLinkStyles}
    `}

  &.active {
    ${getTheme("typography.regular.02")}
    ${activeLinkStyles}
  }

  // TODO: to remove if message selection is enabled
  // &:hover ${Initials} {
  //   display: none;
  // }

  &:hover ${Select} {
    display: flex;
  }

  &:hover ${Delete} {
    display: flex;
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
  line-height: 20px;
`;
export const DateWrapper = styled.div<{ $isActive?: boolean; $isHover?: boolean }>`
  ${getTheme("typography.medium.04")};

  svg {
    transition: all 0.25s ease;
    border-radius: 0.25rem;

    ${(props) =>
      props.$isHover &&
      css`
        &:hover {
          background-color: ${getTheme("colors.grey")};
          fill: white;
        }
      `}

    ${(props) =>
      props.$isActive &&
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
