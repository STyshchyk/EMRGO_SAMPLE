import { createContext, PropsWithChildren, useContext } from "react";

import { IManageSellsideContext } from "./ManageSellside.types";

const ManageSellsideContext = createContext<IManageSellsideContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ManageSellside template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ManageSellsideProvider = ({ children }: PropsWithChildren) => {
  const state: IManageSellsideContext = {};

  return <ManageSellsideContext.Provider value={state}>{children}</ManageSellsideContext.Provider>;
};

export const useManageSellsideContext = () => useContext(ManageSellsideContext);
