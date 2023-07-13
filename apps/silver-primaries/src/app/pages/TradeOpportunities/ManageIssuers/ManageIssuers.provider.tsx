import { createContext, PropsWithChildren, useContext } from "react";

import { IManageIssuersContext } from "./ManageIssuers.types";

const ManageIssuersContext = createContext<IManageIssuersContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ManageIssuers template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ManageIssuersProvider = ({ children }: PropsWithChildren) => {
  const state: IManageIssuersContext = {};

  return <ManageIssuersContext.Provider value={state}>{children}</ManageIssuersContext.Provider>;
};

export const useManageIssuersContext = () => useContext(ManageIssuersContext);
