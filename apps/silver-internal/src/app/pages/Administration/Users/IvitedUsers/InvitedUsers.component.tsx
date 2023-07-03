import { FC } from "react";

import { useQuery } from "@tanstack/react-query";
import { Panel, PanelContent, PanelHeader, useToast } from "@emrgo-frontend/shared-ui";

import { queryKeys } from "../../../../constants";
import { doGetInvitedUsers } from "../../Admin.services";
import { IvitedUsersTable } from "../InvitedUsersTable";
import { IInvitedUsersProps } from "./InvitedUsers.types";

import * as Styles from "./InvitedUsers.styles";

export const InvitedUsersComponent: FC<IInvitedUsersProps> = ({}: IInvitedUsersProps) => {
  const { data, isError, isFetched } = useQuery(
    [queryKeys.administration.users],
    doGetInvitedUsers,
    {
      enabled: true,
      onError: () => {
        const { showErrorToast } = useToast();
        if (isError && isFetched) showErrorToast("Error while fetching invited users");
      },
    }
  );
  return (
    <>
      <Styles.Content>
        <Panel>
          <PanelHeader>Users</PanelHeader>
          <PanelContent>{data && <IvitedUsersTable users={data} />}</PanelContent>
        </Panel>
      </Styles.Content>
    </>
  );
};
