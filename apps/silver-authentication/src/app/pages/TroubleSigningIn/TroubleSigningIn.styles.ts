import { TextBox as TextBoxBase } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const TroubleSigningIn = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
`;

// Login page specific textarea overrides
export const TextBox = styled(TextBoxBase)`
  max-width: ${rem(458)};
  background: ${getTheme("colors.white.100")};
  color: ${getTheme("colors.black.100")};

  &::placeholder {
    color: ${getTheme("colors.black.60")};
  }
`;
