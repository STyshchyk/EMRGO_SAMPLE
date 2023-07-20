import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const BannerPagination = styled.ul`
  display: flex;
  column-gap: ${rem(8)};
  position: absolute;
  inset: ${rem(24)};
  top: auto;
  z-index: 2;
  padding: 0;
  margin: 0;
  list-style: none;
`;

interface IPageButtonProps {
  $isPrevious: boolean;
}

export const PageButton = styled.button<IPageButtonProps>`
  display: inline-flex;
  appearance: none;
  background-color: ${getTheme("colors.white.30")};
  cursor: pointer;
  overflow: hidden;
  border: none;
  padding: 0;
  height: ${rem(8)};
  width: ${rem(48)};
  border-radius: 1px;

  ${({ $isPrevious }) =>
    $isPrevious &&
    css`
      background-color: ${getTheme("colors.green5")};
    `}
`;

export const AutoPlayProgress = styled.span`
  display: inline-block;
  content: "";
  height: 100%;
  background-color: ${getTheme("colors.green5")};
  width: 0;
`;
