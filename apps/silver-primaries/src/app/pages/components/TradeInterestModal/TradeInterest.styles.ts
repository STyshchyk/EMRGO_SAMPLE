import {
  CheckNotificationIcon as CheckNotificationIconBase,
  ErrorIcon as ErrorIconBase
} from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

const maxWidth = 292;
export const AddSellsideModal = styled.div``;
export const SellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: max-content;
  padding: 3px;
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
  gap: ${rem(105)};
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 20px;

  label {
    width: 125px;
  }

  &:first-child {
    margin-bottom: 20px;
  }
`;

export const OneCol = styled.div`
  display: flex;
  max-width: ${rem(maxWidth)};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  width: 100%;
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
  color: ${getTheme("colors.red")};
  width: ${rem(24)};
  height: ${rem(24)};
`;

export const CheckNotificationIcon = styled(CheckNotificationIconBase)`
  color: ${getTheme("colors.green3")};
  font-size: ${rem(24)};
`;
