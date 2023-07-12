import { getTheme } from "@emrgo-frontend/theme";
import { ellipsis, rem, rgba } from "polished";
import styled, { css } from "styled-components";


export const Span = styled.span<{ $width: number }>`
  /* Layout */
  ${({ $width }) =>
    $width &&
    css`
      ${ellipsis($width)}
    `
  }
`;
