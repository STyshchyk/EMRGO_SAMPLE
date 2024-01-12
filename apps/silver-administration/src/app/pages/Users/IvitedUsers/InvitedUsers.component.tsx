import { FC, useState } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  Input,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderRight,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { doGetInvitedUsers } from "../../Admin.services";
import { IvitedUsersTable } from "../InvitedUsersTable";
import * as Styles from "./InvitedUsers.styles";
import { IInvitedUsersProps } from "./InvitedUsers.types";

export const InvitedUsersComponent: FC<IInvitedUsersProps> = ({}: IInvitedUsersProps) => {
  const { showErrorToast } = useToast();
  const [searchKey, setSearchKey] = useState("");
  const { data, isError, isFetched } = useQuery(
    [queryKeys.administration.users],
    doGetInvitedUsers,
    {
      enabled: true,
      onError: () => {
        if (isError && isFetched) showErrorToast("Error while fetching invited users");
      },
      select: (data) => {
        const filteredData =
          searchKey &&
          data.filter((elem) => {
            return (
              elem.email.toLowerCase().includes(searchKey.toLowerCase()) ||
              elem.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
              elem.lastName.toLowerCase().includes(searchKey.toLowerCase()) ||
              elem.role.toLowerCase().includes(searchKey.toLowerCase())
            );
          });
        return searchKey ? filteredData : data;
      },
    }
  );
  return (
    <Styles.Content>
      <Panel>
        <PanelHeader>
          Users
          <PanelHeaderRight>
            <Input
              name={"search"}
              type={"search"}
              variant={"signup"}
              label={"Search"}
              value={searchKey}
              onChange={(event) => {
                setSearchKey(event.target.value);
              }}
            />
          </PanelHeaderRight>
        </PanelHeader>
        <PanelContent>{data && <IvitedUsersTable users={data} />}</PanelContent>
      </Panel>
    </Styles.Content>
  );
};
