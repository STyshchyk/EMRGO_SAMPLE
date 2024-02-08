import { getTheme } from "@emrgo-frontend/theme";
import Card from "@mui/material/Card";
import styled, { css } from "styled-components";

export const CreateNewMessageContainer = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
`;
export const Subject = styled(Card)`
  /* Layout */ /* Element Styles */ /* Text styles */
  padding: 1rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  display: flex;
  ${getTheme("typography.regular.01")};

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
export const MessageInput = styled.div`
  width: 100%;
  margin-top: 1rem;
`;
