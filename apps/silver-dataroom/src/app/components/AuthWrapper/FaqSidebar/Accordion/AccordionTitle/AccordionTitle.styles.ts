import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const ToggleButton = styled.button`
  display: inline-flex;
  column-gap: ${rem(16)};
  align-items: center;
  justify-content: space-between;
  appearance: none;
  background-color: transparent;
  color: ${getTheme("colors.black.100")};
  padding: 0;
  text-align: left;

  &,
  &:hover {
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const Title = styled.h4`
  ${getTheme("typography.medium.02Tight")}
  margin: 0;
`;

export const Icon = styled.span`
  display: inline-flex;
  font-size: ${rem(24)};
`;
