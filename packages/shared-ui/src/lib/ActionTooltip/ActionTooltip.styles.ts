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
      color: ${getTheme("colors.green3")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.green5")};
    `}
`;

export const TooltipButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  appearance: none;
  cursor: pointer;
  position: relative;
  border-radius: 10px;
  padding: 5px 10px;
  gap: 5px 0px;
  background-color: rgba(4, 37, 49, 0);
  width: max-content;
  z-index: 1000;
  //border: 1px solid #446875;
`;

export const TooltipButtonActions = styled.button<{ $disabled?: boolean }>`
  display: flex;
  margin: 5px 0px;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: ${rem(12)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};

  /* ${(props) => props.$disabled && `disabled: true`} */


  ${(props) =>
    props.theme.mode === "light" &&
    css`
      color: ${props.$disabled ? getTheme("colors.grey") : getTheme("colors.black.100")};
      &:hover {
        color: ${props.$disabled ? getTheme("colors.grey") : getTheme("colors.green5")};
      }
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      color: ${props.$disabled ? getTheme("colors.grey") : getTheme("colors.white.100")} ;
      &:hover {
        color: ${props.$disabled ? getTheme("colors.grey") : getTheme("colors.green5")} ;
      }
    `}

`;
