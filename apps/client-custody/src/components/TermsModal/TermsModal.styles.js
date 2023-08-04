import { rem } from "polished";
import styled, { css } from "styled-components";

import colors from "../../constants/Theme/colors";
import typography from "../../constants/Theme/typography";

export const Wrapper = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const Title = styled.h2`
  /* Layout */
  margin: 0;
  color: ${colors.black["100"]};

  ${typography.heading["02"]}
`;

export const Subtitle = styled.div`
  color: ${colors.black["60"]};
  /* Text styles */
  ${typography.regular["01"]}
`;

export const Content = styled.div`
  /* Layout */
  overflow: auto;
  width: 100%;
  padding: 0;
  margin: ${rem(24)} 0;
  flex-grow: 1;

  /* Element Styles */
  border-radius: ${rem(4)};
  color: ${colors.black["100"]};
  background: ${colors.white["100"]};
  border: 1px solid ${colors.strokes.light};
  /* Text styles */

  ${typography.regular["01"]}

  p {
    margin: ${rem(16)} 0;
  }
`;

export const Footer = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(16)};
`;

export const IconButton = styled.button`
  /* Layout */
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
  background: transparent;
  font-size: ${rem(24)};
  cursor: pointer;

  /* Animation */
  transition: all 0.2s ease-in-out;
  color: ${colors.green3};

  :hover {
    background: ${colors.black["5"]};
  }
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
