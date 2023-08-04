import styled, { css } from "styled-components";

import colors from "../../../constants/Theme/colors";
import typography from "../../../constants/Theme/typography";

const ModalTitle = styled.h2`
  margin: 0;
  ${typography.heading["01"]}
  color: ${colors.black["100"]};
`;

export default ModalTitle;
