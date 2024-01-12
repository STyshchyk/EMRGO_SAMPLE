import { FC, useState } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  Input,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderRight,
} from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { OnboardedUserTable } from "../OnboardedUserTable";
import { IOnboarderUser } from "../OnboardedUserTable/OnboardedUserTable.types";
import * as Styles from "./OnboardedUsers.styles";
import { IOnboarderUsersProps } from "./OnboardedUsers.types";
import { getEntities } from "./OnboardrdedUsers.service";

const testData: IOnboarderUser[] = [
  {
    firstName: "Johh",
    lastName: "Doe",
    kycTS: "n/a",
    kyc: "Pending",
    emailID: "jogndoe@wethaq.com",
    clientProfileTS: "n/a",
    entityName: "client",
  },
  {
    firstName: "Johh",
    lastName: "Doe2",
    kycTS: "n/a",
    kyc: "Pending",
    emailID: "jogndoe2@wethaq.com",
    clientProfileTS: "n/a",
    entityName: "client",
  },
  {
    firstName: "Johh",
    lastName: "Doe3",
    kycTS: "n/a",
    kyc: "Approved",
    emailID: "jogndoe3@wethaq.com",
    clientProfileTS: "n/a",
    entityName: "client",
  },
];
export const OnboardedUsers: FC<IOnboarderUsersProps> = ({}) => {
  const [searchKey, setSearchKey] = useState("");

  const { data, isError, isFetching } = useQuery({
    queryFn: getEntities,
    queryKey: [queryKeys.onboarding.fetch],
    select: (data) => {
      const filteredData =
        searchKey &&
        data.filter((elem) => {
          return (
            elem.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
            elem.lastName.toLowerCase().includes(searchKey.toLowerCase()) ||
            elem.entityName.toLowerCase().includes(searchKey.toLowerCase()) ||
            elem.email.toLowerCase().includes(searchKey.toLowerCase())
          );
        });
      return searchKey ? filteredData : data;
    },
  });

  return (
    <Styles.OnboarderUsers>
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

          <PanelContent>
            {!isError && data && <OnboardedUserTable onboardedUsers={data} />}
          </PanelContent>
        </Panel>
      </Styles.Content>
    </Styles.OnboarderUsers>
  );
};
