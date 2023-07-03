import { ErrorIcon as ErrorIconBase } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const Error = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};
  span {
    color: ${getTheme("colors.white.80")};
  }
`;

export const ErrorIcon = styled(ErrorIconBase)`
  color: ${getTheme("colors.orange")};
  width: ${rem(24)};
  height: ${rem(24)};
`;
