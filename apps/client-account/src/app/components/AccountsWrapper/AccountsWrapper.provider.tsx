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
  const { updateUser } = useUser();

  useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUser(user);
    },
  });

  const state: IAccountsWrapperContext = {};

  return (
    <AccountsWrapperContext.Provider value={state}>{children}</AccountsWrapperContext.Provider>
  );
};

export const useAccountsWrapperContext = () => useContext(AccountsWrapperContext);
