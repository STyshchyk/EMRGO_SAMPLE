import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

import BackgroundImage from "./Assets/background.jpg";

export const Container = styled.div`
  display: flex;
  position: relative;
  border-radius: ${rem(4)};
  color: ${getTheme("colors.white.100")};
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.75) 31.77%, rgba(0, 0, 0, 0.5) 100%),
    url(${BackgroundImage});
  background-size: cover;
`;
