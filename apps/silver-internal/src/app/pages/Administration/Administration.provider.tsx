import { createContext, PropsWithChildren, useContext } from "react";

import { IAdministrationContext, IAdministrationProps } from "./Administration.types";

const AdministrationContext = createContext<IAdministrationContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Administration template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const AdministrationProvider = ({ children }: PropsWithChildren) => {
  const state: IAdministrationContext = {
    numberOfNewTradeOpportunities: 1,
    getUsers: () => {},
  };

  return <AdministrationContext.Provider value={state}>{children}</AdministrationContext.Provider>;
};

export const useAdministrationContext = () => useContext(AdministrationContext);
