import { FC, useEffect } from "react";

import { Button, DashboardContent, Panel, PanelContent, PanelHeader, useUser, Modal } from "@emrgo-frontend/shared-ui";
import { date } from "yup";

import { onboarderUsers } from "./Data/data";
import { IvitedUsersTable } from "./InvitedUsersTable";
import { INewUser } from "./InvitedUsersTable/IvitedUsersTable.types";
import * as Styles from "./OnboardUser.styles";
import { IOnboardUserProps } from "./OnboardUser.types";
import { useOnboardUserContext } from "./OnboardUser.provider";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { OnboardUser } from "./OnboardUser";
import { OnboardUserModal } from "./OnboardUserModal";


export const OnboardUserComponent: FC<IOnboardUserProps> = ({ children }: IOnboardUserProps) => {
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
        <PanelContent>{onboarderUsers && <IvitedUsersTable users={onboarderUsers} />}</PanelContent>
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
