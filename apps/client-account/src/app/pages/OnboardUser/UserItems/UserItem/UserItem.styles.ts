import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";



export const UserItem = styled.li`
  display: flex;
  align-items: center;
  border-radius: ${rem(4)};
  border: 1px solid transparent;
  padding: ${rem(12)};

  ${({ theme }) =>
    css`
      ${getTheme("typography.heading.05")}

      ${theme.mode === "light" &&
      css`
        border-color: ${getTheme("colors.strokes.light")};
        color: ${getTheme("colors.black.100")};
        background-color: ${getTheme("colors.black.5")};
      `}

      ${theme.mode === "dark" &&
      css`
        border-color: ${getTheme("colors.strokes.dark")};
        color: ${getTheme("colors.white.100")};
        background-color: ${getTheme("colors.white.5")};
      `}
    `}
`;


export const Spacer = styled.div`
  flex-grow: 1;
`;

