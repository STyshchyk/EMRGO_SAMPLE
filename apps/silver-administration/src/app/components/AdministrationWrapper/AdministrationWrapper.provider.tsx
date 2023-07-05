import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IAdministrationWrapperContext } from "./AdministrationWrapper.types";

const AdministrationWrapperContext = createContext<IAdministrationWrapperContext | null>(null);

/**
  * @description
  * @param {PropsWithChildren} { children }
  * @returns {JSX.Element}
  * Integration point for the AdministrationWrapper template. Put any integration logic here.
  * For example, if you need to fetch data from an API, you can do that here.
  *
  * TODO: Implement this code.
  */
export const AdministrationWrapperProvider = ({ children }: PropsWithChildren) => {
  const state: IAdministrationWrapperContext = {};

  return <AdministrationWrapperContext.Provider value={state}>{children}</AdministrationWrapperContext.Provider>
};

export const useAdministrationWrapperContext = () => useContext(AdministrationWrapperContext);
