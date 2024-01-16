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

export const MessagesBox = styled.div<{ isEmpty?: boolean }>`
  /* Layout */ /* Element Styles */ /* Text styles */
  display: flex;
  flex-direction: column;

  ${(props) =>
    !props.isEmpty
      ? css`
          height: 100%;
          justify-content: center;
          align-items: center;
        `
      : css`
          margin-top: auto;
        `}

  padding-bottom: 1rem;
  /* use !important to prevent breakage from child margin settings */
`;

export const MessageItem = styled(Card)<{ $isSender?: boolean }>`
  /* Layout */ /* Element Styles */ /* Text styles */
  display: flex;
  flex-direction: column;
  align-self: ${({ $isSender }) => ($isSender ? "end" : "auto")};
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
    `}
`;
export const MessageContent = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  margin-top: 0.25rem;
  /* use !important to prevent breakage from child margin settings */
`;

export const MessageFilesContainer = styled.div`
  /* Layout */ /* Element Styles */ /* Text styles */
  ${(props) =>
    props.theme.mode === "light" &&
    css`
      border-top: 1px solid ${getTheme("colors.strokes.light")};
    `}
  ${(props) =>
    props.theme.mode === "dark" &&
    css`
      border-top: 1px solid ${getTheme("colors.light")};
    `}
  display: flex;
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  gap: 0.5rem;
  /* use !important to prevent breakage from child margin settings */
`;

export const Date = styled.span``;
