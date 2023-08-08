import { FC } from "react";

import {
  Button,
  DashboardContent,
  Input,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  QuestionnaireItem,
  QuestionnaireItems,
  useToast} from "@emrgo-frontend/shared-ui";
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
    {
      id: "1",
      label: "Portfolio Details",
      callback: onViewPlatformDetails
    }, {
      id: "2",
      label: "Client Banking Details",
      callback: onViewBankingDetails
    }, {
      id: "3",
      label: "Account Opening (Safekeeping & Cash)",
      callback: onViewCashAccounts
    }, {
      id: "4",
      label: "Authorised Representatives",
      callback: onViewAuthRepresentatives
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
              <Styles.EntityDetails>
                <Input disabled value={"AUM1129384X"} />
                <Input disabled value={"Elefant Capital"} />
              </Styles.EntityDetails>
            </AccountPanelContent>
          </AccountPanel>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Entity Operational Details</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <Styles.QuestionnairePanelContent>
              <UserItems>
                {entityOperationDetails.map((item) => (
                  <UserItem
                    key={item.id}
                    handleCallback={item.callback}
                  >
                    {item.label}
                  </UserItem>
                ))}
              </UserItems>
            </Styles.QuestionnairePanelContent>
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
            <SubHeading>List of users part of Elefant Capital on the EMRGO platform</SubHeading>
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
