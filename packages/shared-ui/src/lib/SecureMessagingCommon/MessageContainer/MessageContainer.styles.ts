import { getTheme } from "@emrgo-frontend/theme";
import { Card } from "@mui/material";
import styled, { css } from "styled-components";

import { ScrollStyles } from "../../ScrollBar";

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  ${ScrollStyles};
  overflow-y: auto;
  padding-right: 0.25rem;
  /* Layout */ /* Element Styles */ /* Text styles */
`;

export const MessagesBox = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding-bottom: 1rem;
  /* use !important to prevent breakage from child margin settings */
`;
export const MessageInput = styled.div`
  width: 100%;
  margin-top: 1rem;
`;
export const Subject = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;

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

export const MessageItem = styled(Card)<{ isSender?: boolean }>`
  /* Layout */ /* Element Styles */ /* Text styles */
  display: flex;
  flex-direction: column;
  align-self: ${({ isSender }) => (isSender ? "end" : "auto")};
  padding: 1rem;
  margin-top: 1rem;
  width: 76%;

  /* use !important to prevent breakage from child margin settings */
`;

export const MessageHeader = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  display: flex;
  flex-direction: row;
  padding-bottom: 0.25rem;

  & span:first-child {
    ${getTheme("typography.regular02")}
  }

  & span:last-child {
    ${getTheme("typography.semiBold.03Tight")};
    margin-left: auto;
  }

  ${(props) =>
    props.theme.mode === "light" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.light")};
    `}
  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.light")};
    `} /* use !important to prevent breakage from child margin settings */
`;
export const MessageContent = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  margin-top: 0.25rem;
  /* use !important to prevent breakage from child margin settings */
`;

export const Date = styled.span``;
