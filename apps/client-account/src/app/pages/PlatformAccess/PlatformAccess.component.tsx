import { FC } from "react";

import { accountIdentification } from "@emrgo-frontend/constants";
import {
  Button,
  DashboardContent,
  QuestionnaireItem,
  QuestionnaireItems,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { usePlatformAccessContext } from "./PlatformAccess.provider";
import * as Styles from "./PlatformAccess.styles";
import { IPlatformAccessProps } from "./PlatformAccess.types";

export const PlatformAccessComponent: FC<IPlatformAccessProps> = (props: IPlatformAccessProps) => {
  const {
    user,
    userProfilingQuestionnaireItems,
    kycQuestionnaireItems,
    onInvestmentProfileStartForm,
    onKYCStartForm,
    onInvestmentProfileSubmit,
    onKYCSubmit,
  } = ensureNotNull(usePlatformAccessContext());

  const entityKycStatus = user?.entityKycStatus;
  const clientKycStatus = user?.clientKycStatus;

  const firstInvestmentProfileIncompleteForm = userProfilingQuestionnaireItems?.find(
    (form) => form.hasCompleted === false
  );

  const areAllInvestmentProfileSectionsComplete = userProfilingQuestionnaireItems?.every(
    (form) => form.hasCompleted
  );

  const firstKYCIncompleteForm = kycQuestionnaireItems?.find((form) => form.hasCompleted === false);

  const areAllKYCSectionsComplete = kycQuestionnaireItems?.every((form) => form.hasCompleted);

  return (
    <DashboardContent>
      <Styles.Container>
        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>User Profiling Questionnaire</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <Styles.QuestionnairePanelContent>
            <QuestionnaireItems>
              {userProfilingQuestionnaireItems.map((item) => (
                <QuestionnaireItem
                  key={item.id}
                  timeRemaining={`${item.timeRemaining} minutes`}
                  completed={item.hasCompleted}
                >
                  {item.label}
                </QuestionnaireItem>
              ))}
            </QuestionnaireItems>
          </Styles.QuestionnairePanelContent>
          <AccountPanelFooter>
            {clientKycStatus === accountIdentification.KYC_STATUS_PENDING ? (
              <div>
                {!areAllInvestmentProfileSectionsComplete && (
                  <Button
                    size="large"
                    onClick={() =>
                      onInvestmentProfileStartForm(
                        firstInvestmentProfileIncompleteForm?.formId || "",
                        firstInvestmentProfileIncompleteForm?.formReferenceId || ""
                      )
                    }
                  >
                    Start {firstInvestmentProfileIncompleteForm?.label}
                  </Button>
                )}

                {areAllInvestmentProfileSectionsComplete && (
                  <Button size="large" onClick={onInvestmentProfileSubmit}>
                    Submit Investment Profile
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}
          </AccountPanelFooter>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>KYC Questionnaire</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <Styles.QuestionnairePanelContent>
            <QuestionnaireItems>
              {kycQuestionnaireItems.map((item) => (
                <QuestionnaireItem
                  key={item.id}
                  timeRemaining={`${item.timeRemaining} minutes`}
                  completed={item.hasCompleted}
                >
                  {item.label}
                </QuestionnaireItem>
              ))}
            </QuestionnaireItems>
          </Styles.QuestionnairePanelContent>
          <AccountPanelFooter>
            {entityKycStatus === accountIdentification.KYC_STATUS_PENDING ? (
              <div>
                {!areAllKYCSectionsComplete && (
                  <Button
                    size="large"
                    onClick={() =>
                      onKYCStartForm(
                        firstKYCIncompleteForm?.formId || "",
                        firstKYCIncompleteForm?.formReferenceId || ""
                      )
                    }
                  >
                    Start {firstKYCIncompleteForm?.label}
                  </Button>
                )}

                {areAllKYCSectionsComplete && (
                  <Button size="large" onClick={onKYCSubmit}>
                    Submit KYC
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}
          </AccountPanelFooter>
        </AccountPanel>
      </Styles.Container>
    </DashboardContent>
  );
};
