import { IconButton } from "@emrgo-frontend/shared-ui";
import { rem } from "polished";
import styled from "styled-components";

export const ModalHeader = styled.header`
  display: flex;
  column-gap: ${rem(16)};
  align-items: start;
`;

export const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

export const Content = styled.div``;
