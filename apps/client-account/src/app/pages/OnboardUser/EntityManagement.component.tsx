import { FC } from "react";

import {
  Button,
  DashboardContent,
  Input,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  useUser
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelContent } from "../../components/AccountPanelContent";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { SubHeading } from "../../components/Shared";
import { useEntityManagementContext } from "./EntityManagement.provider";
import * as Styles from "./EntityManagement.styles";
import { IEntityManagementProps } from "./EntityManagement.types";
import { InvitedUsersTable } from "./InvitedUsersTable";
import { OnboardUserModal } from "./OnboardUserModal";
import { UserItem, UserItems } from "./UserItems";


export const EntityManagementComponent: FC<IEntityManagementProps> = ({ children }: IEntityManagementProps) => {
  const { user } = useUser()

  const {
      onboardedUsers,
      isOnboardUserModalOpen,
      setIsOnboardUserModalOpen,
      onViewPlatformDetails,
      onViewBankingDetails,
      onViewCashAccounts,
      onViewAuthRepresentatives
    } = ensureNotNull(useEntityManagementContext());

  const entityOperationDetails = [
    // {
    //   id: "1",
    //   label: "Portfolio Details",
    //   callback: onViewPlatformDetails
    // },
    {
      id: "1",
      label: "Client Banking Details",
      callback: onViewBankingDetails,
      disabled:true,
    },
    {
      id: "2",
      label: "Account Opening (Safekeeping & Cash)",
      callback: onViewCashAccounts,
      disabled:true,
    },
    {
      id: "3",
      label: "Authorised Representatives",
      callback: onViewAuthRepresentatives,
      disabled:true,
    }
  ];


  return (
    <Styles.OnboardUser>
      <DashboardContent>

        <Styles.Container>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Entity Identification Details</AccountPanelHeaderTitle>
            </AccountPanelHeader>

            <AccountPanelContent>
              <Styles.EntityIdentityDetails>
                <Input disabled value={user?.entityId || ""} />
                <Input disabled value={user?.entityName || ""} />
              </Styles.EntityIdentityDetails>
            </AccountPanelContent>
          </AccountPanel>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Entity Operational Details</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <Styles.EntityDetailsPanelContent>
              <UserItems>
                {entityOperationDetails.map((item) => (
                  <UserItem
                    key={item.id}
                    handleCallback={item.callback}
                    disabled = {item.disabled}
                  >
                    {item.label}
                  </UserItem>
                ))}
              </UserItems>
            </Styles.EntityDetailsPanelContent>
          </AccountPanel>
        </Styles.Container>


        <Panel>
          <PanelHeader>
            Entity Personnel
            <div style={{ marginLeft: "auto" }}>
              <Button onClick={() => {
                setIsOnboardUserModalOpen(true);
              }}
              >
                Add user
              </Button>
            </div>
          </PanelHeader>

          <PanelContent>
            <SubHeading>List of users part of {user?.entityName} on the EMRGO platform</SubHeading>
            {onboardedUsers && <InvitedUsersTable users={onboardedUsers} />}
          </PanelContent>
        </Panel>

        <Modal
          isOpen={isOnboardUserModalOpen}
          title={"Onboard User"}
          onClose={() => {
            setIsOnboardUserModalOpen(false);
          }}
          width={768}
          showCloseButton={true}
          variant={"darkened"}
        >
          <OnboardUserModal />
        </Modal>
      </DashboardContent>
    </Styles.OnboardUser>);
};
