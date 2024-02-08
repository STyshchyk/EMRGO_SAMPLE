import React, { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clientAccountRoutes } from "@emrgo-frontend/constants";
import { useFetchGroups, useFilters, useUser } from "@emrgo-frontend/shared-ui";

import { ISilverSecureMessagingContext } from "./SilverSecureMessaging.types";

const SilverSecureMessagingContext = createContext<ISilverSecureMessagingContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the SilverSecureMessaging template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const SilverSecureMessagingProvider = ({ children }: PropsWithChildren) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [isCheckModeSelected, setCheckMode] = React.useState(false);
  const { setUserType } = useFilters();
  const { user } = useUser();
  const navigate = useNavigate();
  const { data } = useFetchGroups("internal");
  useEffect(() => {
    setUserType((prevState) => {
      return "internal";
    });
    navigate(clientAccountRoutes.secureMessaging.inbox.home);
  }, []);

  const state: ISilverSecureMessagingContext = {
    messagesList: data,
    user,
    checked,
    isCheckModeSelected,
    setCheckMode,
    setChecked,
  };
  return (
    <SilverSecureMessagingContext.Provider value={state}>
      {children}
    </SilverSecureMessagingContext.Provider>
  );
};

export const useSilverSecureMessagingContext = () => useContext(SilverSecureMessagingContext);
