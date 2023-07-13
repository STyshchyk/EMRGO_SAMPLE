import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const Container = styled.section`
  border: 1px solid ${getTheme("colors.black.10")};
  border-radius: ${rem(4)};
  padding: ${rem(16)};
`;
