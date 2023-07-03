import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

interface IDrawerProps {
  $isOpen: boolean;
}

export const Drawer = styled.aside<IDrawerProps>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  width: ${rem(393)};
  padding: ${rem(24)};
  background-color: ${getTheme("colors.white.80")};
  color: ${getTheme("colors.black.100")};
  backdrop-filter: blur(4px);
  z-index: 2;
  opacity: 0;
  transform: translateX(100%);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 0.3s;

  ${(props) =>
    props.$isOpen &&
    css`
      opacity: 1;
      transform: none;
    `};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${rem(16)};
`;

export const Title = styled.h2`
  margin: 0;
  ${getTheme("typography.heading.01")}
`;

export const AboutPoints = styled.ul`
  margin: 0;
  padding-left: ${rem(20)};
  ${getTheme("typography.regular.02")}
`;

export const Divider = styled.hr`
  margin: ${rem(24)} 0;
  border-bottom: none;
  border-color: ${getTheme("colors.black.10")};
`;
