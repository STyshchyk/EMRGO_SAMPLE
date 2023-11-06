import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

const maxWidth = 458;

export const SignupForm = styled.form`
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


export const HelpItem = styled.div`
  ${getTheme("typography.regular.02")}
`;

