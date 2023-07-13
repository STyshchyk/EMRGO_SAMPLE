import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IOnboardingContext } from "./Onboarding.types";

const OnboardingContext = createContext<IOnboardingContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Onboarding template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const OnboardingProvider = ({ children }: PropsWithChildren) => {
  const state: IOnboardingContext = {};

  return <OnboardingContext.Provider value={state}>{children}</OnboardingContext.Provider>;
};

export const useOnboardingContext = () => useContext(OnboardingContext);
