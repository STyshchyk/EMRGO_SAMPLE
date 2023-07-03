import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";

import { createFormSession, fetchInvestorProfileForms } from "./InvestmentProfile.services";
import { IInvestmentProfileContext, IInvestmentProfileSection } from "./InvestmentProfile.types";

const InvestmentProfileContext = createContext<IInvestmentProfileContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const InvestmentProfileProvider = ({ children }: PropsWithChildren) => {
  const firstName = "Ryan";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccessToast } = useToast();

  const { data: investmentProfileForms, refetch } = useQuery({
    staleTime: Infinity,
    queryKey: [constants.queryKeys.account.clientInvestmentProfile.fetch],
    queryFn: () => fetchInvestorProfileForms(),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: doCreateFormSession } = useMutation(createFormSession);

  const forms = investmentProfileForms?.forms;

  const onStartForm = (formId: string, formReferenceId: string) => {
    const requestPayload = {
      formReferenceId,
    };

    doCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.clientInvestmentProfile.form, {
          typeFormId: formId,
        })}/?session=${sessionId}`;

        navigate(route);
      },
    });
  };

  const onSubmit = () => {
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
            refetch();
          }, 1000);
        }
        setSearchParams(searchParams);
      }
    } else {
      refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: IInvestmentProfileContext = {
    forms,
    firstName,
    onStartForm,
    onSubmit,
  };

  return (
    <InvestmentProfileContext.Provider value={state}>{children}</InvestmentProfileContext.Provider>
  );
};

export const useInvestmentProfileContext = () => useContext(InvestmentProfileContext);
