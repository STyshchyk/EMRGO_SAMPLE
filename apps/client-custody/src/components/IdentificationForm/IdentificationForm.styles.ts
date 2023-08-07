import { Widget } from "@typeform/embed-react";
import { rem } from "polished";
import styled from "styled-components";

export const IdentificationForm = styled.div`
  display: grid;
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  height: 100vh;
`;

export const FormWidget = styled(Widget)``;
