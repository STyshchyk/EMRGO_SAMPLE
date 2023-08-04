import { rem } from "polished";
import styled from "styled-components";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${rem(24)};
  padding-top: ${rem(24)};
`;
export default ModalContent;
