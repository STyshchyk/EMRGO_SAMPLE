import { FC } from "react";

import { Panel, PanelContent, PanelHeader, useToast } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../../constants";
import { doGetInvitedUsers } from "../../Admin.services";
import { IvitedUsersTable } from "../InvitedUsersTable";
import * as Styles from "./InvitedUsers.styles";
import { IInvitedUsersProps } from "./InvitedUsers.types";

export const InvitedUsersComponent: FC<IInvitedUsersProps> = ({}: IInvitedUsersProps) => {

  const { data, isError, isFetched } = useQuery(
    [queryKeys.administration.users],
    doGetInvitedUsers,
    {
      enabled: true,
      onError: () => {
        const { showErrorToast } = useToast();
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
