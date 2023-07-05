import { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { Panel, PanelContent, PanelHeader, useToast } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { doGetInvitedUsers } from "../../Admin.services";
import { IvitedUsersTable } from "../InvitedUsersTable";
import * as Styles from "./InvitedUsers.styles";
import { IInvitedUsersProps } from "./InvitedUsers.types";

export const InvitedUsersComponent: FC<IInvitedUsersProps> = ({}: IInvitedUsersProps) => {
  const { showErrorToast } = useToast();

  const { data, isError, isFetched } = useQuery(
    [queryKeys.administration.users],
    doGetInvitedUsers,
    {
      enabled: true,
      onError: () => {
        if (isError && isFetched) showErrorToast("Error while fetching invited users");
      }
    }
  );
  return (
    <Styles.Content>
      <Panel>
        <PanelHeader>Users</PanelHeader>
        <PanelContent>{data && <IvitedUsersTable users={data} />}</PanelContent>
      </Panel>
    </Styles.Content>
  );
};
