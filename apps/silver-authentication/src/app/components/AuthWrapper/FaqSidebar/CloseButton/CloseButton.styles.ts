import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const CloseButton = styled.button`
  display: inline-flex;
  appearance: none;
  padding: ${rem(4)};
  border: none;
  font-size: ${rem(24)};
  border-radius: 50%;
  background-color: ${getTheme("colors.black.10")};
  color: ${getTheme("colors.black.100")};
`;
