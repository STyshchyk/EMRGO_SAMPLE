import { BiDotsVerticalRounded } from "react-icons/bi";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const ActionTooltip = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
  padding: 0;
  margin: 0 0 0 auto;
  background: none;
`;

export const PanelHeaderIconCustom = styled.span<{ margin?: string }>`
  display: inline-flex;
  font-size: ${rem(24)};
  user-select: none;
  margin: ${(props) => props.margin || "auto"};
`;
export const TableActionButton = styled(BiDotsVerticalRounded)`
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${getTheme("colors.green4")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green")};
    `}
`;

export const ButtonActions = styled.button`
  display: flex;
  margin: 5px 0px;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: ${rem(12)};

  &:hover {
    color: #11e4d9;
  }

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
`;
