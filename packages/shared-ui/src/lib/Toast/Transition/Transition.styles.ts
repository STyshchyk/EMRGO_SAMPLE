import styled, { css, keyframes } from "styled-components";

const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(40%) scale(0.6);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const exitAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(40%) scale(0.6);
  }
`;

interface ITransitionProps {
  $isVisible: boolean;
}

export const Transition = styled.div<ITransitionProps>`
  ${({ $isVisible }) =>
    $isVisible &&
    css`
      animation: ${enterAnimation} 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
    `}

  ${({ $isVisible }) =>
    !$isVisible &&
    css`
      animation: ${exitAnimation} 0.4s forwards cubic-bezier(0.06, 0.71, 0.55, 1);
    `}
`;
