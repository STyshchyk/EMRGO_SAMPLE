import { FC } from "react";

import { Panel, PanelContent, PanelHeader } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";


import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
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
    entityName: "client"
  },
  {
    firstName: "Johh",
    lastName: "Doe2",
    kycTS: "n/a",
    kyc: "Pending",
    emailID: "jogndoe2@wethaq.com",
    clientProfileTS: "n/a",
    entityName: "client"
  },
  {
    firstName: "Johh",
    lastName: "Doe3",
    kycTS: "n/a",
    kyc: "Approved",
    emailID: "jogndoe3@wethaq.com",
    clientProfileTS: "n/a",
    entityName: "client"
  }
];
export const OnboardedUsers: FC<IOnboarderUsersProps> = ({}) => {
  const { data, isError, isFetching } = useQuery({ queryFn: getEntities, queryKey: [queryKeys.onboarding.fetch] });

  return (
    <Styles.OnboarderUsers>
      <>
        <Styles.Content>
          <Panel>
            <PanelHeader>Users</PanelHeader>
            {/*<PanelContent>{data && <O users={data} />}</PanelContent>*/}
            <PanelContent>
              {!isError && data && <OnboardedUserTable onboarderUsers={data} />}
            </PanelContent>
          </Panel>
        </Styles.Content>
      </>
    </Styles.OnboarderUsers>
  );
};
