import DatePicker from "react-datepicker";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const TabHeaderWrapper = styled.div`
  display: flex;
  column-gap: ${rem(8)};
  padding: 0 ${rem(24)} 0 ${rem(32)};
  min-height: 85px;
  align-items: center;

  & > span:first-child {
    white-space: nowrap;
  }

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.light")};
      background-color: #ffffff;
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      border-bottom: 1px solid ${getTheme("colors.strokes.dark")};
      background-color: ${getTheme("colors.green1")};
    `}
`;

export const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0 0 40%;
  flex-wrap: nowrap;
  border-radius: 0.25rem;
  ${({ theme }) =>
    css`
      ${theme.mode === "light" &&
      css`
        border: 1px solid ${getTheme("colors.strokes.light")};
        &:hover {
          border: 1px solid ${getTheme("colors.green3")};
        }
      `}
      ${theme.mode === "dark" &&
      css`
        border: 1px solid ${getTheme("colors.strokes.dark")};
        &:hover {
          border: 1px solid ${getTheme("colors.green5")};
        }
      `}
    `}

  & > div:first-child {
    flex: 1 0 30%;
  }

  & > div:nth-child(2) {
    flex: 2 4 60%;
  }

  & > button {
    flex: 0 0 auto;
  }
`;

export const FilterWrapper = styled.div`
  flex: 1 1 auto;
  flex-wrap: wrap;
`;
export const Spacer = styled.div`
  display: flex;
  flex-basis: ${rem(330)};
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  flex: 2 4 60%;
  flex-direction: column;
  -webkit-box-flex: 1;
  gap: 0.5rem;
  position: relative;
  & > div.react-datepicker-wrapper {
    overflow: visible;
    & > div.react-datepicker__input-container {
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      ${({ theme }) =>
        css`
          ${theme.mode === "light" &&
          css`
            background: ${getTheme("colors.white.100")};
            color: ${getTheme("colors.black.60")};
          `}
          ${theme.mode === "dark" &&
          css`
            background: ${getTheme("colors.white.0")};
            color: ${getTheme("colors.white.60")};
          `}
        `}
    }
  }
`;

export const DatePickerStyled = styled(DatePicker)`
  background-color: royalblue;
  width: 100%;
  border: unset;
  outline: none;
  padding: 0 0.75rem;
  height: 100%;
  ${getTheme("typography.medium.02Tight")}
  border-radius: ${rem(4)};
  border: 1px solid transparent;

  ${({ theme }) =>
    css`
      ${theme.mode === "light" &&
      css`
        background: ${getTheme("colors.white.100")};
        color: ${getTheme("colors.black.60")};

        &:hover {
          border: 1px solid ${getTheme("colors.green3")};
        }
      `}
      ${theme.mode === "dark" &&
      css`
        background: ${getTheme("colors.white.0")};
        color: ${getTheme("colors.white.60")};
        &:hover {
          border: 1px solid ${getTheme("colors.green5")};
        }
      `}
    `}
`;
export const ClearButton = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 10px;
  cursor: pointer;
  svg {
    font-size: 1rem;
  }
`;
