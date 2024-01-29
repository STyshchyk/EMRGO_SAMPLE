import React, { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clientAccountRoutes } from "@emrgo-frontend/constants";
import { useFetchGroups, useFilters, useUser } from "@emrgo-frontend/shared-ui";

import { IClientSecureMessagingContext } from "./ClientSecureMessaging.types";

const ClientSecureMessagingContext = createContext<IClientSecureMessagingContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ClientSecureMessaging template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */

export const ClientSecureMessagingProvider = ({ children }: PropsWithChildren) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [isCheckModeSelected, setCheckMode] = React.useState(false);
  const { setUserType } = useFilters();
  const { user } = useUser();
  const navigate = useNavigate();
  const { data } = useFetchGroups("client");
  useEffect(() => {
    setUserType("client");
    navigate(clientAccountRoutes.secureMessaging.inbox.home);
  }, []);

  const state: IClientSecureMessagingContext = {
    messagesList: data,
    user,
    checked,
    isCheckModeSelected,
    setCheckMode,
    setChecked,
  };
  return (
    <ClientSecureMessagingContext.Provider value={state}>
      {children}
    </ClientSecureMessagingContext.Provider>
  );
};

export const useClientSecureMessagingContext = () => useContext(ClientSecureMessagingContext);
