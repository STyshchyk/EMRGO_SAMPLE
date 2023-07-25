import { createContext, PropsWithChildren, useContext } from "react";

import { useUserStore } from "../store";
import { ICompleteRegistrationContext } from "./CompleteRegistration.types";

const CompleteRegistrationContext = createContext<ICompleteRegistrationContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the CompleteRegistration template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const CompleteRegistrationProvider = ({ children }: PropsWithChildren) => {
  const { mfa } = useUserStore();
  const state: ICompleteRegistrationContext = {
    secret: mfa?.secret ?? "",
    otpauth_url: mfa?.otpauth_url ?? "",
  };

  return (
    <CompleteRegistrationContext.Provider value={state}>
      {children}
    </CompleteRegistrationContext.Provider>
  );
};

export const useCompleteRegistrationContext = () => useContext(CompleteRegistrationContext);
