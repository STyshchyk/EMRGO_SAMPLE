import { ErrorIcon as ErrorIconBase } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

const maxWidth = 458;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
`;

export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(24)};
  max-width: ${rem(maxWidth)};
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

export const OneColCheck = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
  padding-left: ${rem(4)};
`;

export const Heading = styled.h1`
  ${getTheme("typography.heading.01")}
  color: ${getTheme("colors.white.100")};
  margin: 0;
`;

export const SubHeading = styled.p`
  ${getTheme("typography.regular.02")}
  color: ${getTheme("colors.white.70")};
  margin: 0;
`;

export const FormError = styled.div`
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

export const FormErrorIcon = styled(ErrorIconBase)`
  color: ${getTheme("colors.orange")};
  width: ${rem(24)};
  height: ${rem(24)};
`;
