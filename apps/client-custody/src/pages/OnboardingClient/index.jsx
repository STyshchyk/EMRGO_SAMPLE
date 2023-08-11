import * as React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { accountIdentification } from "@emrgo-frontend/constants";
import {
  Button,
  DashboardContent,
  QuestionnaireItem,
  QuestionnaireItems,
  useRefreshProfile,
  useToast,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { dashboardApi } from "../../services/APIService";
import * as Styles from "./OnboardingClient.styles";

export const fetchInvestorProfileForms = async () => {
  const promise = dashboardApi({
    method: "get",
    url: `v2/client/kyc/forms`,
    params: {
      kycType: "user",
    },
  });
  const data = await (await promise).data;
  return data || [];
};

export const createInvestmentFormSession = async (requestPayload) => {
  const promise = dashboardApi({
    method: "post",
    url: `v2/client/kyc/forms`,
    data: requestPayload,
  });
  const data = await (await promise).data;
  return data || [];
};

export const submitInvestorProfileForms = async () => {
  const promise = dashboardApi({
    method: "put",
    url: `v2/client/kyc/submit`,
    params: {
      kycType: "user",
    },
  });
  const data = await (await promise).data;
  return data || [];
};
export const fetchKYCForms = async () => {
  const promise = dashboardApi({
    method: "get",
    url: `v2/client/kyc/forms`,
    params: {
      kycType: "entity",
    },
  });
  const data = await (await promise).data;
  return data || [];
};

const OnboardingClient = () => {
  const refreshProfile = useRefreshProfile();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccessToast } = useToast();

  const { data: investmentProfileForms, refetch: investmentProfileRefetch } = useQuery({
    staleTime: Infinity,
    queryKey: [constants.queryKeys.account.clientInvestmentProfile.fetch],
    queryFn: () => fetchInvestorProfileForms(),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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

  const investmentProfileFormItems = investmentProfileForms?.forms;
  const kycFormItems = kycForms?.forms;

  const redirectPath = constants.clientAccountRoutes.account.platformAccess;

  const onInvestmentProfileStartForm = (formId, formReferenceId) => {
    const requestPayload = {
      formReferenceId,
    };

    doInvestmentProfileCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.clientInvestmentProfile.form, {
          typeFormId: formId,
        })}/?session=${sessionId}&redirect=${encodeURI(redirectPath)}`;

        navigate(route);
      },
    });
  };

  const onKYCStartForm = (formId, formReferenceId) => {
    const requestPayload = {
      formReferenceId,
    };

    doKYCCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.kyc.form, {
          typeFormId: formId,
        })}/?session=${sessionId}&redirect=${redirectPath}`;

        navigate(route);
      },
    });
  };

  const onInvestmentProfileSubmit = () => {
    doSubmitInvestmentProfile(undefined, {
      onSuccess: (response) => {
        investmentProfileRefetch();
        refreshProfile();
      },
    });
  };

  const onKYCSubmit = () => {
    navigate("thank-you");
  };

  useEffect(() => {
    if (searchParams.has("form")) {
      const callbackFormId = searchParams.get("form");
      if (callbackFormId) {
        searchParams.delete("form");
        if (investmentProfileForms) {
          const completedForm = investmentProfileForms?.forms.find(
            (form) => form.formId === callbackFormId
          );
          showSuccessToast(`Successfully completed Investor Profile ${completedForm?.label} form`);

          setTimeout(() => {
            investmentProfileRefetch();
          }, 1000);
        }
        setSearchParams(searchParams);
      }
    } else {
      investmentProfileRefetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const userProfilingQuestionnaireItems = investmentProfileFormItems || [];
  const kycQuestionnaireItems = kycFormItems || [];

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
      </Styles.Container>
    </DashboardContent>
  );
};

export default OnboardingClient;
