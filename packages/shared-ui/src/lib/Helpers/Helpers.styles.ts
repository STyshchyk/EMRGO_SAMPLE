import { getTheme } from "@emrgo-frontend/theme";
import { ellipsis, rem, rgba } from "polished";
import styled, { css } from "styled-components";

export const Span = styled.span<{ $width: number; $lines?: number }>`
  /* Layout */
  position: relative;

  ${({ $width, $lines }) =>
    $width &&
    css`
      ${ellipsis($width, $lines ? $lines : 1)}
    `}
`;
