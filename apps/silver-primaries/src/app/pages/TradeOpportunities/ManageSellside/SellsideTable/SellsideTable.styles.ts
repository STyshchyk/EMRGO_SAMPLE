import { rem } from "polished";
import styled from "styled-components";


export const SellsideTable = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;


export const TableImg = styled.img<{ src: string }>`
  max-height: ${rem(24)};
  background-color: rgba(156, 108, 18, 0.25);
  content: url(${({ src }) => src});
`;

