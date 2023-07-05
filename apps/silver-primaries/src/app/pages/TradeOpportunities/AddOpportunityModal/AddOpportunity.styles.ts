import {
  CheckNotificationIcon as CheckNotificationIconBase,
  ErrorIcon as ErrorIconBase
} from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

const maxWidth = 292;
export const AddOpportunity = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
  overflow-y: auto;
  width: 1068px;
`;
export const Wrapper = styled.div`
  /* Layout */
  display: flex;
  min-height: 0;

  gap: 50px;

  form {
    width: calc(100% - 48px);
  }
`;

export const Title = styled.h2`
  /* Layout */
  margin-bottom: 20px;

  /* Text styles */
  ${getTheme("typography.heading.02")} /* Theme */ ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.100")};
    `}
`;

export const Subtitle = styled.div`
  /* Text styles */
  ${getTheme("typography.regular.01")} /* Theme */ ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;
export const TwoCol = styled.div`
  display: flex;
  gap: ${rem(50)};
  justify-content: flex-start;
  align-items: center;

  & > label:nth-child(1) {
    width: 175px;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  & > div:nth-child(2) {
    flex-grow: 1;
    max-width: 243px;
    font-size: 14px;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    color: rgb(239, 0, 0);
    opacity: 1;
    display: block;
    background: url(https://mywildalberta.ca/images/GFX-MWA-Parks-Reservations.png) no-repeat;
    width: 20px;
    height: 20px;
    border-width: thin;
  }
}

`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const FileInput = styled.input`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out 0s;
  background: rgba(28, 27, 31, 0.05);
  border: 1px solid rgb(232, 232, 233);
`;

export const MyError = styled.div`
  /* Layout */
  padding-top: 0.5rem;
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};

  /* Variants */

  span {
    ${({ theme }) => css`
      ${theme.mode === "light" &&
      css`
        color: ${getTheme("colors.black.80")};
      `}
      ${theme.mode === "dark" &&
      css`
        color: ${getTheme("colors.white.80")};
      `}
    `}
  }
`;

export const MyErrorIcon = styled(ErrorIconBase)`
  width: ${rem(24)};
  height: ${rem(24)};

  /* Variants */
  ${({ theme }) => css`
    ${theme.mode === "light" &&
    css`
      color: ${getTheme("colors.red")};
    `}
    ${theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.orange")};
    `}
  `}
`;

export const MyCheckNotificationIcon = styled(CheckNotificationIconBase)`
  color: ${getTheme("colors.green3")};
  font-size: ${rem(24)};
`;
