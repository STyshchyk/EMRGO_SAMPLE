import { createContext, PropsWithChildren, useContext, useState } from "react";

import { IDashboardWrapperContext } from "./DashboardWrapper.types";

const DashboardWrapperContext = createContext<IDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the DashboardWrapper template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const DashboardWrapperProvider = ({ children }: PropsWithChildren) => {
  const state: IDashboardWrapperContext = {
    numberOfNotifications: 1,
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useDashboardWrapperContext = () => useContext(DashboardWrapperContext);
