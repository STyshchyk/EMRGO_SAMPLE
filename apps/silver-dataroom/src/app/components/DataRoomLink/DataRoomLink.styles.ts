import { Link } from "react-router-dom";

import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const DataRoomLinkLabel = styled.span`
  visibility: hidden;
  padding: 0 ${rem(4)};
  ${getTheme("typography.medium.03")}
`;

export const DataRoomLink = styled(Link)`
  display: flex;
  align-items: center;
  border-radius: ${rem(2)};
  font-size: ${rem(24)};

  &:hover {
    ${DataRoomLinkLabel} {
      visibility: inherit;
    }
  }

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};

      &:hover {
        background-color: ${getTheme("colors.black.5")};
        color: ${getTheme("colors.black.100")};
      }
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};

      &:hover {
        background-color: ${getTheme("colors.white.5")};
        color: ${getTheme("colors.white.100")};
      }
    `}
`;
