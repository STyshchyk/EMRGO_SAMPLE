import { createContext, PropsWithChildren, useContext } from "react";

import { IPrimariesContext } from "./Primaries.types";

const PrimariesContext = createContext<IPrimariesContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Primaries template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const PrimariesProvider = ({ children }: PropsWithChildren) => {
  const state: IPrimariesContext = {
    numberOfNewTradeOpportunities: 1,
  };

  return <PrimariesContext.Provider value={state}>{children}</PrimariesContext.Provider>;
};

export const usePrimariesContext = () => useContext(PrimariesContext);
