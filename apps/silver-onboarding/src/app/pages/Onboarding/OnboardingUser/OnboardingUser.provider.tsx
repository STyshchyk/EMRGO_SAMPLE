import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IOnboardingUserContext } from "./OnboardingUser.types";

const OnboardingUserContext = createContext<IOnboardingUserContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the OnboardingUser template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const OnboardingUserProvider = ({ children }: PropsWithChildren) => {
  const state: IOnboardingUserContext = {};

  return <OnboardingUserContext.Provider value={state}>{children}</OnboardingUserContext.Provider>;
};

export const useOnboardingUserContext = () => useContext(OnboardingUserContext);
