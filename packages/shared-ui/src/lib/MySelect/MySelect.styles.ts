import { Select } from "@emrgo-frontend/shared-ui";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { Error as GlobalError, ErrorIcon as GlobalErrorIcon } from "../Input/Input.styles";

export const MySelect = styled.div<{ $maxWidth?: number }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${rem(8)};
  max-width: ${({ $maxWidth }) => $maxWidth && rem($maxWidth)};
`;
const ReactSelectElement = styled(Select)``;

export const Error = styled(GlobalError)`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};

  /* Variants */


`;

export const ErrorIcon = styled(GlobalErrorIcon)`
  width: ${rem(24)};
  height: ${rem(24)};


`;
