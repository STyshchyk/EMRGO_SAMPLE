import { CloseOutlined as CloseIconBase } from "@mui/icons-material";
import { rem } from "polished";
import styled, { css } from "styled-components";

import colors from "../../../constants/Theme/colors";
import typography from "../../../constants/Theme/typography";

export const Wrapper = styled.div`
  /* Layout */
  width: ${({ $width = 800 }) => $width};
  max-height: calc(100vh - ${rem(140)});
  padding: ${rem(24)};
  position: relative;
  top: 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;

  /* Element Styles */
  border-radius: ${rem(4)};

  /* Theme */
  ${({ variant = "default" }) =>
    variant === "default" &&
    css`
      border: 1px solid ${colors.strokes.light};
      background: ${colors.white["100"]};
      color: ${colors.black["100"]};
    `}

  ${({ theme, variant = "default" }) =>
    variant === "darkened" &&
    css`
      border: 1px solid ${colors.strokes.light};
      background: ${colors.light};
      color: ${colors.black["100"]};
    `}



  /* Animation */
  transition: all 0.2s ease-in-out;
  ${({ $reveal }) =>
    $reveal
      ? `
        opacity: 1;
        transform: translate(0, 0)`
      : `
        opacity: 0;
        transform: translate(0, -2rem)
        `};
`;

export const Header = styled.div`
  display: flex;
  position: relative;
`;

export const Title = styled.h2`
  margin: 0 ${rem(48)} 0 0;

  ${typography.heading["01"]}
  color: ${colors.black["100"]};
`;

export const CloseButton = styled.button`
  /* Layout */
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(24)};
  height: ${rem(24)};
  margin: 0;
  padding: 0;

  /* Element Style */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${colors.black["100"]};
  background: ${colors.black["5"]};
`;

export const CloseIcon = styled(CloseIconBase)`
  width: ${rem(24)};
  height: ${rem(24)};
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const Content = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;
