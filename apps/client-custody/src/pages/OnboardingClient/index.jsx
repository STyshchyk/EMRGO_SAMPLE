import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import {accountIdentification} from "@emrgo-frontend/constants";
import {
    Button,
    DashboardContent,
    QuestionnaireItem,
    QuestionnaireItems,
    useRefreshProfile,
    useToast,
    useUser,
} from "@emrgo-frontend/shared-ui";
import {navigateModule} from "@emrgo-frontend/utils";
import {useMutation, useQuery} from "@tanstack/react-query";
import {reverse} from "named-urls";

import {AboutUs} from "../../components/AboutCustody";
import {AccountPanel} from "../../components/AccountPanel";
import {AccountPanelFooter} from "../../components/AccountPanelFooter";
import {AccountPanelHeader} from "../../components/AccountPanelHeader";
import {AccountPanelHeaderTitle} from "../../components/AccountPanelHeaderTitle";
import LoadingIndicator from "../../components/LoadingIndicator";
import * as authActionCreators from "../../redux/actionCreators/auth";
import {
    createInvestmentFormSession,
    fetchKYCForms,
    submitCustodyKYCForms,
} from "../../services/KYC";
import * as Styles from "./OnboardingClient.styles";
import {number} from "yup";

const OnboardingClient = () => {
    const dispatch = useDispatch();
    const refreshProfile = useRefreshProfile();
    const {user} = useUser();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const {showSuccessToast} = useToast();
    const [isAboutCustodyDisplayed, setAboutCustodyDisplayed] = useState(true);

    const {data: kycForms, refetch: kycRefetch} = useQuery({
        staleTime: Infinity,
        queryKey: [constants.queryKeys.account.kyc.fetch],
        queryFn: () => fetchKYCForms(),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {mutate: doKYCCreateFormSession} = useMutation(createInvestmentFormSession);
    const {mutate: doSubmitCustodyKYCForms} = useMutation(submitCustodyKYCForms);

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
        doSubmitCustodyKYCForms(undefined, {
            onSuccess: (response) => {
                // To keep redux in sync
                const fetchUserProfile = (payload) =>
                    dispatch(authActionCreators.doFetchUserProfile(payload));
                fetchUserProfile();
                refreshProfile();
                showSuccessToast(`Successfully submited regulatory onboarding for review`);
            },
        });
    };

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

    const kycQuestionnaireItems = kycFormItems || [];

    const entityKycStatus = user?.entityKycStatus;
    const clientKycStatus = user?.clientKycStatus;
    const entityCustodyKycStatus = user?.entityCustodyKycStatus;

    const incompleteKYC = entityKycStatus !== accountIdentification?.KYC_STATUS_APPROVED
        || clientKycStatus !== accountIdentification?.KYC_STATUS_APPROVED || entityCustodyKycStatus !== accountIdentification?.KYC_STATUS_APPROVED

    const pending = entityKycStatus === accountIdentification?.KYC_STATUS_PENDING
        || clientKycStatus === accountIdentification?.KYC_STATUS_PENDING || entityCustodyKycStatus === accountIdentification?.KYC_STATUS_PENDING

    const review = entityKycStatus === accountIdentification?.KYC_STATUS_SUBMITTED
        || clientKycStatus === accountIdentification?.KYC_STATUS_SUBMITTED || entityCustodyKycStatus === accountIdentification?.KYC_STATUS_SUBMITTED


    const redirectToKYC = () => {
        navigateModule("account", constants.clientAccountRoutes.account.platformAccess);
    };

    const firstKYCIncompleteForm = kycQuestionnaireItems?.find((form) => form.hasCompleted === false);

    const areAllKYCSectionsComplete = kycQuestionnaireItems?.every((form) => form.hasCompleted);
    if (!user) return <LoadingIndicator height={100}/>;
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
                        {entityCustodyKycStatus === accountIdentification?.KYC_STATUS_PENDING && (
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
                                        Submit Regulatory Onboarding
                                    </Button>
                                )}
                            </div>
                        )}

                        {entityCustodyKycStatus === accountIdentification?.KYC_STATUS_SUBMITTED && (
                            <Styles.Text>
                                Your Regulatory Onbaording is in-review. Please check back later to use the custody
                                module.{" "}
                            </Styles.Text>
                        )}

                        {incompleteKYC && (
                            <div className="mt-8">
                                <Styles.Text>
                                    {pending && (
                                        <React.Fragment>
                                            Please complete KYC to use the custody module.{" "}
                                            <a className="cursor-pointer" onClick={() => redirectToKYC()}>
                                                Complete KYC now
                                            </a>
                                        </React.Fragment>
                                    )}

                                    {!pending && review && (
                                        <React.Fragment>
                                            Your KYC is in-review. Please check back later to use the custody
                                            module.{" "}
                                        </React.Fragment>
                                    )}
                                </Styles.Text>
                            </div>
                        )}
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
