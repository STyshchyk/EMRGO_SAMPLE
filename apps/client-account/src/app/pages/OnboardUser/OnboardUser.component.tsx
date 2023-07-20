import { FC, useEffect } from "react";

import {
  Button,
  DashboardContent,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  useToast,
  useUser
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useQuery } from "@tanstack/react-query";
import { date } from "yup";

import { onboarderUsers } from "./Data/data";
import { IvitedUsersTable } from "./InvitedUsersTable";
import { INewUser } from "./InvitedUsersTable/IvitedUsersTable.types";
import { OnboardUser } from "./OnboardUser";
import { useOnboardUserContext } from "./OnboardUser.provider";
import * as Styles from "./OnboardUser.styles";
import { IOnboardUserProps } from "./OnboardUser.types";
import { OnboardUserModal } from "./OnboardUserModal";
import { queryKeys } from "@emrgo-frontend/constants";
import { getOnboardedUsers } from "./OnboardUser.service";


export const OnboardUserComponent: FC<IOnboardUserProps> = ({ children }: IOnboardUserProps) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const { data } = useQuery({
    queryFn: getOnboardedUsers,
    enabled: false,//remove this to make request
    queryKey: [queryKeys.account.onboardedUsers.fetch],
    onError: () => {
      showErrorToast("Error fetching users");
    },
    placeholderData: onboarderUsers//remove this field after api is ready
  });


  const { isShown, setIsShow } = ensureNotNull(useOnboardUserContext());
  return <Styles.OnboardUser>
    <DashboardContent>
      <div>
        <Button onClick={() => {
          setIsShow(true);
        }}
        >
          Add user
        </Button>
      </div>
      <Panel>
        <PanelHeader>Onboarded Users</PanelHeader>
        <PanelContent>{data && <IvitedUsersTable users={data} />}</PanelContent>
      </Panel>
      <Modal
        isOpen={isShown}
        title={"Onboard User"}
        onClose={() => {
          setIsShow(false);
        }}
        width={768}
        showCloseButton={true}
        variant={"darkened"}
      >
        <OnboardUserModal />
      </Modal>
    </DashboardContent>
  </Styles.OnboardUser>;
};
