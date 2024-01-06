import { getTheme } from "@emrgo-frontend/theme";
import styled, { css } from "styled-components";

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  /* Layout */ /* Element Styles */ /* Text styles */
`;
export const Subject = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  padding: 0.25rem 1rem;
  border-radius: 0.25rem;
  ${getTheme("typography.regular.01")}

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
    `}

  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
    `}
`;
export const Messages = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  margin-top: 1rem;
`;
