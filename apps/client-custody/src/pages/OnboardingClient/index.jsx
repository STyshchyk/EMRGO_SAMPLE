import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";



import * as constants from "@emrgo-frontend/constants";
import { accountIdentification } from "@emrgo-frontend/constants";
import { Button, DashboardContent, QuestionnaireItem, QuestionnaireItems, useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";



import { AboutUs } from "../../components/AboutCustody";
import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { createInvestmentFormSession, fetchKYCForms, submitInvestorProfileForms } from "../../services/KYC";
import { baseAxiosInstance } from "../../services/wethaqAPIService/helpers";
import * as Styles from "./OnboardingClient.styles";





const OnboardingClient = () => {
  const refreshProfile = useRefreshProfile();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccessToast } = useToast();
  const [isAboutCustodyDisplayed, setAboutCustodyDisplayed] = useState(true);

  const { data: kycForms, refetch: kycRefetch } = useQuery({
    staleTime: Infinity,
    queryKey: [constants.queryKeys.account.kyc.fetch],
    queryFn: () => fetchKYCForms(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: doInvestmentProfileCreateFormSession } = useMutation(createInvestmentFormSession);
  const { mutate: doKYCCreateFormSession } = useMutation(createInvestmentFormSession);
  const { mutate: doSubmitInvestmentProfile } = useMutation(submitInvestorProfileForms);

  // const investmentProfileFormItems = investmentProfileForms?.forms;
  const kycFormItems = kycForms?.forms;

  const redirectPath = constants.clientCustodyRoutes.custody.onboarding.home;

  const onKYCStartForm = (formId, formReferenceId) => {
    const requestPayload = {
      formReferenceId,
    };

    doKYCCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.kyc.form, {
          typeFormId: formId,
        })}/?session=${sessionId}&module=custody&redirect=${redirectPath}`;

        navigateModule("account", route);
      },
    });
  };

  const onKYCSubmit = () => {
    navigateModule("account", "thank-you");
  };

  // useEffect(() => {
  //   if (searchParams.has("form")) {
  //     const callbackFormId = searchParams.get("form");
  //     if (callbackFormId) {
  //       searchParams.delete("form");
  //       if (investmentProfileForms) {
  //         const completedForm = investmentProfileForms?.forms.find(
  //           (form) => form.formId === callbackFormId
  //         );
  //         showSuccessToast(`Successfully completed Investor Profile ${completedForm?.label} form`);
  //
  //         setTimeout(() => {
  //           // investmentProfileRefetch();
  //         }, 1000);
  //       }
  //       setSearchParams(searchParams);
  //     }
  //   } else {
  //     // investmentProfileRefetch();
  //   }
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (searchParams.has("form")) {
      const callbackFormId = searchParams.get("form");
      if (callbackFormId) {
        searchParams.delete("form");
        if (kycForms) {
          const completedForm = kycForms?.forms.find((form) => form.formId === callbackFormId);
          showSuccessToast(`Successfully completed KYC ${completedForm?.label} form`);

          setTimeout(() => {
            kycRefetch();
          }, 1000);
        }
        setSearchParams(searchParams);
      }
    } else {
      kycRefetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const userProfilingQuestionnaireItems = investmentProfileFormItems || [];
  const kycQuestionnaireItems = kycFormItems || [];

  const entityKycStatus = user?.entityKycStatus;
  const clientKycStatus = user?.clientKycStatus;

  // const firstInvestmentProfileIncompleteForm = userProfilingQuestionnaireItems?.find(
  //   (form) => form.hasCompleted === false
  // );
  //
  // const areAllInvestmentProfileSectionsComplete = userProfilingQuestionnaireItems?.every(
  //   (form) => form.hasCompleted
  // );

  const firstKYCIncompleteForm = kycQuestionnaireItems?.find((form) => form.hasCompleted === false);

  const areAllKYCSectionsComplete = kycQuestionnaireItems?.every((form) => form.hasCompleted);

  return (
    <DashboardContent>
      <Styles.Container>
        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Regulatory Onboarding</AccountPanelHeaderTitle>
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
          </AccountPanelFooter>
        </AccountPanel>
        {isAboutCustodyDisplayed && (
          <AboutUs
            onClose={() => {
              setAboutCustodyDisplayed(false);
            }}
          />
        )}
      </Styles.Container>
    </DashboardContent>
  );
};

export default OnboardingClient;