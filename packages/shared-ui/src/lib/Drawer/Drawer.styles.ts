import { rem } from "polished";
import styled, { css } from "styled-components";

interface IDrawerProps {
  $isOpen: boolean;
}

export const Drawer = styled.section<IDrawerProps>`
  display: flex;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: ${rem(480)};
  z-index: 2;
  opacity: 0;
  transform: translateX(100%);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 0.3s;
  box-shadow: 0px ${rem(-4)} ${rem(16)} rgba(0, 0, 0, 0.25);

  ${(props) =>
    props.$isOpen &&
    css`
      opacity: 1;
      transform: none;
    `};
`;
