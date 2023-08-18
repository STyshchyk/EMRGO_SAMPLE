import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";

import {
  createFormSession as createInvestmentFormSession,
  fetchInvestorProfileForms,
  submitInvestorProfileForms,
} from "../InvestmentProfile/InvestmentProfile.services";
import { IInvestmentProfileSection } from "../InvestmentProfile/InvestmentProfile.types";
import { fetchKYCForms } from "../KYC/KYC.services";
import { IKYCSection } from "../KYC/KYC.types";
import { IPlatformAccessContext } from "./PlatformAccess.types";

const PlatformAccessContext = createContext<IPlatformAccessContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const PlatformAccessProvider = ({ children }: PropsWithChildren) => {
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
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: doInvestmentProfileCreateFormSession } = useMutation(createInvestmentFormSession);
  const { mutate: doKYCCreateFormSession } = useMutation(createInvestmentFormSession);
  const { mutate: doSubmitInvestmentProfile } = useMutation(submitInvestorProfileForms);

  const investmentProfileFormItems = investmentProfileForms?.forms;
  const kycFormItems = kycForms?.forms;

  const redirectPath = constants.clientAccountRoutes.account.platformAccess;

  const onInvestmentProfileStartForm = (formId: string, formReferenceId: string) => {
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

  const onKYCStartForm = (formId: string, formReferenceId: string) => {
    const requestPayload = {
      formReferenceId,
    };

    doKYCCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.kyc.form, {
          typeFormId: formId,
        })}/?session=${sessionId}&redirect=${encodeURI(redirectPath)}`;

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
            (form: IInvestmentProfileSection) => form.formId === callbackFormId
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
          const completedForm = kycForms?.forms.find(
            (form: IKYCSection) => form.formId === callbackFormId
          );
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

  const state: IPlatformAccessContext = {
    user: user,
    userProfilingQuestionnaireItems: investmentProfileFormItems || [],
    kycQuestionnaireItems: kycFormItems || [],
    onInvestmentProfileStartForm: onInvestmentProfileStartForm,
    onKYCStartForm: onKYCStartForm,
    onInvestmentProfileSubmit,
    onKYCSubmit,
  };

  return <PlatformAccessContext.Provider value={state}>{children}</PlatformAccessContext.Provider>;
};

export const usePlatformAccessContext = () => useContext(PlatformAccessContext);
