import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const Hyperlink = styled.a`
  display: inline-flex;
  align-items: center;
  column-gap: ${rem(4)};
  text-decoration: none;
  padding: 0 ${rem(4)};
  margin: 0 ${rem(-4)};
  font-weight: ${getTheme("typography.medium.02.fontWeight")};

  &,
  &:link,
  &:visited,
  &:hover,
  &:active {
    ${(props) =>
      props.theme.mode === "light" &&
      css`
        color: ${getTheme("colors.green3")};
      `};

    ${(props) =>
      props.theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.green5")};
      `};
  }

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      &:hover {
        background-color: ${getTheme("colors.white.5")};
        border-radius: ${rem(2)};
      }
    `};
`;

export const HyperlinkIcon = styled.span`
  display: inline-flex;
  /* This calculation is needed to keep icon size relative to the text font size.
    Example in the design system has icon size set to 24px, while text size is 14px,
    so 24 / 14 produces the relationship factor between the two, which is then 
    converted to em unit, which itself expresses relative size to parent's
    font size*/
  font-size: calc((24 / 14) * 1em);
  margin-left: ${rem(-4)};
`;
