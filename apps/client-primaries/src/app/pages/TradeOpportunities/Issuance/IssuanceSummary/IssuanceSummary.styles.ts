import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { OpportunityStatusLabel } from "../../../../components/OpportunityStatusLabel";

export const Container = styled.section`
  display: flex;
  align-items: center;
  column-gap: ${rem(16)};
  padding: ${rem(12)} ${rem(16)};
  border: 1px solid transparent;
  border-radius: ${rem(4)};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.white.100")};
      border-color: ${getTheme("colors.strokes.light")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.green1")};
      border-color: ${getTheme("colors.strokes.dark")};
    `}
`;

export const Title = styled.h1`
  flex: 1;
  margin: 0;
  ${getTheme("typography.semiBold.01")}
`;

export const Status = styled(OpportunityStatusLabel)`
  ${getTheme("typography.medium.01")}
`;

export const WatchlistButton = styled.button`
  display: inline-flex;
  align-items: center;
  column-gap: ${rem(1)};
  appearance: none;
  border: none;
  cursor: pointer;
  padding: ${rem(1)} ${rem(8)} ${rem(1)} ${rem(5)};
  border-radius: ${rem(2)};
  ${getTheme("typography.medium.02Tight")};

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      background-color: ${getTheme("colors.black.5")};
      color: ${getTheme("colors.black.100")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      background-color: ${getTheme("colors.white.5")};
      color: ${getTheme("colors.white.100")};
    `}
`;

export const WatchlistButtonIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(22)};
`;
