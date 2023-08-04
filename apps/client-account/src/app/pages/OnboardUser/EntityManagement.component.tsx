import { FC } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import {
  Button,
  DashboardContent,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  QuestionnaireItem,
  QuestionnaireItems,
  useToast
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useQuery } from "@tanstack/react-query";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { SubHeading } from "../../components/Shared";
import { onboarderUsers } from "./Data/data";
import { useEntityManagementContext } from "./EntityManagement.provider";
import { getOnboardedUsers } from "./EntityManagement.service";
import * as Styles from "./EntityManagement.styles";
import { IEntityManagementProps } from "./EntityManagement.types";
import { InvitedUsersTable } from "./InvitedUsersTable";
import { OnboardUserModal } from "./OnboardUserModal";

const enitityIdDetails = [
  {
    id: "1",
    label: "AUM1129384X",
    hasCompleted: false
  }, {
    id: "2",
    label: "Elefant Capital",
    hasCompleted: false
  }];

const entityOperationDetails = [
  {
    id: "1",
    label: "Portfolio Details",
    hasCompleted: false
  }, {
    id: "2",
    label: "Client Banking Details",
    hasCompleted: false
  }, {
    id: "3",
    label: "Account Opening (Safekeeping & Cash)",
    hasCompleted: false
  }, {
    id: "4",
    label: "Authorised Representatives",
    hasCompleted: false
  }
];

export const EntityManagementComponent: FC<IEntityManagementProps> = ({ children }: IEntityManagementProps) => {
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

  const { isShown, setIsShow } = ensureNotNull(useEntityManagementContext());
  return (
    <Styles.OnboardUser>
      <DashboardContent>

        <Styles.Container>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Entity Identification Details</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <Styles.QuestionnairePanelContent>
              <QuestionnaireItems>
                {enitityIdDetails.map((item) => (
                  <QuestionnaireItem
                    key={item.id}
                    completed={item.hasCompleted}
                    timeRemaining={"2"}
                  >
                    {item.label}
                  </QuestionnaireItem>
                ))}
              </QuestionnaireItems>
            </Styles.QuestionnairePanelContent>

          </AccountPanel>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Entity Operational Details</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <Styles.QuestionnairePanelContent>
              <QuestionnaireItems>
                {entityOperationDetails.map((item) => (
                  <QuestionnaireItem
                    key={item.id}
                    completed={item.hasCompleted}
                    timeRemaining={"1"}
                  >
                    {item.label}
                  </QuestionnaireItem>
                ))}
              </QuestionnaireItems>
            </Styles.QuestionnairePanelContent>
          </AccountPanel>

        </Styles.Container>


        <Panel>
          <PanelHeader>
            Entity Personnel
            <div style={{ marginLeft: "auto" }}>
              <Button onClick={() => {
                setIsShow(true);
              }}
              >
                Add user
              </Button>
            </div>
          </PanelHeader>

          <PanelContent>
            <SubHeading>List of users part of Elefant Capital on the EMRGO platform</SubHeading>
            {data && <InvitedUsersTable users={data} />}
          </PanelContent>
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
    </Styles.OnboardUser>);
};
