import { createContext, PropsWithChildren, useContext } from "react";

import * as constants from "@emrgo-frontend/constants";
import { fetchUserProfile } from "@emrgo-frontend/services";
import { useUser } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { IAccountsWrapperContext } from "./AccountsWrapper.types";

const AccountsWrapperContext = createContext<IAccountsWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const AccountsWrapperProvider = ({ children }: PropsWithChildren) => {
  const { updateUserConfig } = useUser();

  useQuery([constants.queryKeys.account.profile.fetch], {
    staleTime: 60 * 60,
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUserConfig(user);
    },
  });

  const state: IAccountsWrapperContext = {};

  return (
    <AccountsWrapperContext.Provider value={state}>{children}</AccountsWrapperContext.Provider>
  );
};

export const useAccountsWrapperContext = () => useContext(AccountsWrapperContext);
