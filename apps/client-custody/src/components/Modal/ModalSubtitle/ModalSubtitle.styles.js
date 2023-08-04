import { rem } from "polished";
import styled, { css } from "styled-components";

import colors from "../../../constants/Theme/colors";
import typography from "../../../constants/Theme/typography";

const ModalSubtitle = styled.h3`
  margin: ${rem(4)} 0 0 0;
  ${typography.regular["02"]}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${colors.black["60"]};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${colors.white["60"]};
    `}
`;
export default ModalSubtitle;
