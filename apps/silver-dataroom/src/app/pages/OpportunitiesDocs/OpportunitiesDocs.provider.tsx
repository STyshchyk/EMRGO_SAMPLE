import { createContext, PropsWithChildren, useContext } from "react";

import { IOpportunitiesDocsContext } from "./OpportunitiesDocs.types";

const OpportunitiesDocsContext = createContext<IOpportunitiesDocsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the OpportunitiesDocs template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const OpportunitiesDocsProvider = ({ children }: PropsWithChildren) => {
  const state: IOpportunitiesDocsContext = {};

  return (
    <OpportunitiesDocsContext.Provider value={state}>{children}</OpportunitiesDocsContext.Provider>
  );
};

export const useOpportunitiesDocsContext = () => useContext(OpportunitiesDocsContext);
