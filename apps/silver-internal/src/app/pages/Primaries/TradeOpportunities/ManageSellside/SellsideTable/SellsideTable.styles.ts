import { rem } from "polished";
import styled from "styled-components";

import * as Invited from "../../../../Administration/Users/InvitedUsersTable/IvitedUsersTable.styles";

export const SellsideTable = styled.div`
  /* Layout */
  /* Element Styles */
  /* Text styles */
`;
export const Button = styled(Invited.Button)``;

export const ButtonBox = styled(Invited.ButtonBox)``;

export const ButtonActions = styled(Invited.ButtonActions)``;

export const TableImg = styled.img<{ src: string }>`
  max-height: ${rem(24)};
  background-color: rgba(156, 108, 18, 0.25);
  content: url(${({ src }) => src});
`;

