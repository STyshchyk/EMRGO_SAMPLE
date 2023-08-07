import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled from "styled-components";

export const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
`;

export const Heading = styled.h1`
  ${getTheme("typography.heading.01")}
  color: ${getTheme("colors.white.100")};
  margin: 0;
`;

export const SubHeading = styled.p`
  ${getTheme("typography.regular.02")}
  color: ${getTheme("colors.white.70")};
  margin: 0;
`;

export const Footer = styled.footer`
  margin-top: auto;
`;
