import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const SixDigitCodeInput = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(16)};
`;

export const Input = styled.input`
  width: ${rem(48)};
  height: ${rem(48)};

  /* Element Styles */
  border: 1px solid ${getTheme("colors.strokes.dark")};
  background: ${getTheme("colors.white.100")};
  border-radius: ${rem(4)};

  /* Text styles */
  text-align: center;
  ${getTheme("typography.heading.01")}
  color: ${getTheme("colors.black.100")};

  /* Active State */
  &:focus {
    outline: none;
    border: 1px solid ${getTheme("colors.green5")};
  }

  /* Hide arrows in number input in Chrome, Safari, Edge, and Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Hide arrows in number input in Firefox */
  -moz-appearance: textfield;
`;
