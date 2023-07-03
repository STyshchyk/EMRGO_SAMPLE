import { rem } from "polished";
import styled from "styled-components";

import { getTheme } from "@emrgo-frontend/theme";

export const BannerSlideTitle = styled.h2`
  margin: 0;
  padding-bottom: ${rem(4)};
  ${getTheme("typography.heading.02")}
`;
