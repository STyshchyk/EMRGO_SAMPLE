import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";





export const MinorNavbar = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${rem(12)} ${rem(24)};
  margin-top: 0.5rem;

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
    `};
`;

export const MinorNavbarListItem = styled.span`
  display: inline;
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}
  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `};
`;

const activeLinkStyles = css`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.white.100")}!important;
      &,
      &:hover {
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.green3")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")}!important;
      &,
      &:hover {
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.dark")};
      }
    `}
`;

interface ILinkProps {
  active?: boolean;
}

const listItemContentStyles = css`
  display: flex;
  align-items: center;
  column-gap: ${rem(16)};
  padding: ${rem(12)} ${rem(48)};
  border-radius: ${rem(4)};
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
      color: ${getTheme("colors.black.100")}!important;
      &:hover {
        background-color: ${getTheme("colors.black.10")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")}!important;
      &:hover {
        background-color: ${getTheme("colors.white.10")};
      }
    `}
`;

export const MinorNavbarListItemLink = styled.a<ILinkProps>`
  ${linkStyles}
  ${getTheme("typography.medium.01")}

  ${(props) =>
    props.active &&
    css`
      ${getTheme("typography.semiBold.01")}
      ${activeLinkStyles}
    `}

  &.active {
    ${getTheme("typography.semiBold.01")}
    ${activeLinkStyles}
  }
`;

// export const MinorNavbarListItemSecondaryLink = styled.a<ILinkProps>`
//   ${linkStyles}
//   ${getTheme("typography.medium.02")}

//   ${(props) =>
//     props.active &&
//     css`
//       ${getTheme("typography.semiBold.02")}
//       ${activeLinkStyles}
//     `}

//   &.active {
//     ${getTheme("typography.semiBold.02")}
//     ${activeLinkStyles}
//   }
// `;

// export const MinorNavbarListItemContent = styled.div`
//   ${listItemContentStyles}
// `;

// export const MinorNavbarListItemIcon = styled.span`
//   display: inline-flex;
//   font-size: ${rem(24)};
// `;