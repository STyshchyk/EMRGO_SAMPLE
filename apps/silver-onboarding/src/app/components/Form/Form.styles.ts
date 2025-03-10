import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

const maxWidth = 458;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
`;

export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(24)};
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

export const OneColCheck = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
  padding-left: ${rem(4)};
`;

export const Heading = styled.h1<{ align?: string }>`
  ${getTheme("typography.heading.01")}
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;

export const SubHeading = styled.p<{ align?: string }>`
  ${getTheme("typography.regular.02")}
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.70")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.70")};
    `}
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;

export const HeadingCustom = styled.h1<{ align?: string }>`
  ${getTheme("typography.heading.01")}
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;

export const SubHeadingCustom = styled.p<{ align?: string }>`
  ${getTheme("typography.regular.02")}
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;
