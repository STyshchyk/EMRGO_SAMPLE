import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IOnboardUserContext } from "./OnboardUser.types";

const OnboardUserContext = createContext<IOnboardUserContext | null>(null);

/**
  * @description
  * @param {PropsWithChildren} { children }
  * @returns {JSX.Element}
  * Integration point for the OnboardUser template. Put any integration logic here.
  * For example, if you need to fetch data from an API, you can do that here.
  *
  * TODO: Implement this code.
  */
export const OnboardUserProvider = ({ children }: PropsWithChildren) => {
  const state: IOnboardUserContext = {};

  return <OnboardUserContext.Provider value={state}>{children}</OnboardUserContext.Provider>
};

export const useOnboardUserContext = () => useContext(OnboardUserContext);
