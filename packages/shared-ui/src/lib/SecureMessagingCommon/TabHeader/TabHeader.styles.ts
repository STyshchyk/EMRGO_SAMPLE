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
