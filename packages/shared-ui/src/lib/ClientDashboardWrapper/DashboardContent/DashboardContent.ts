import { rem } from "polished";
import styled from "styled-components";

export const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  row-gap: ${rem(24)};
  padding: ${rem(24)};
  overflow: auto;
  height: 100%;
`;
