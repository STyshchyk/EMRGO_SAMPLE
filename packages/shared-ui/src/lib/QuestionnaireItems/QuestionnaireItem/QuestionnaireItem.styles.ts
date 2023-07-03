import { CheckNotificationIcon } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

import { TQuestionnaireItemVariants } from "./QuestionnaireItem.types";

interface IQuestionnaireItemProps {
  $variant: TQuestionnaireItemVariants;
}

export const QuestionnaireItem = styled.li<IQuestionnaireItemProps>`
  display: flex;
  align-items: center;
  border-radius: ${rem(4)};
  border: 1px solid transparent;
  padding: ${rem(12)};

  ${({ theme, $variant }) =>
    $variant === "default" &&
    css`
      ${getTheme("typography.heading.05")}

      ${theme.mode === "light" &&
      css`
        border-color: ${getTheme("colors.strokes.light")};
        color: ${getTheme("colors.black.100")};
        background-color: ${getTheme("colors.black.5")};

        ${RemainingTime}, ${CompletedIcon} {
          color: ${getTheme("colors.green3")};
        }
      `}

      ${theme.mode === "dark" &&
      css`
        border-color: ${getTheme("colors.strokes.dark")};
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.white.5")};
      `}
    `}

  ${({ $variant }) =>
    $variant === "signup" &&
    css`
      color: ${getTheme("colors.black.100")};
      border-color: ${getTheme("colors.strokes.light")};
      background-color: ${getTheme("colors.white.100")};
      ${getTheme("typography.heading.04")}

      ${RemainingTime} {
        ${getTheme("typography.semiBold.01")}
      }

      ${RemainingTime}, ${CompletedIcon} {
        color: ${getTheme("colors.green3")};
      }
    `}
`;

export const RemainingTime = styled.span`
  margin-left: auto;
  ${getTheme("typography.semiBold.02")}
`;

export const CompletedIcon = styled(CheckNotificationIcon)`
  margin-left: auto;
  font-size: ${rem(24)};
`;
