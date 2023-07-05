import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IPrimariesWrapperContext } from "./PrimariesWrapper.types";

const PrimariesWrapperContext = createContext<IPrimariesWrapperContext | null>(null);

/**
  * @description
  * @param {PropsWithChildren} { children }
  * @returns {JSX.Element}
  * Integration point for the PrimariesWrapper template. Put any integration logic here.
  * For example, if you need to fetch data from an API, you can do that here.
  *
  * TODO: Implement this code.
  */
export const PrimariesWrapperProvider = ({ children }: PropsWithChildren) => {
  const state: IPrimariesWrapperContext = {};

  return <PrimariesWrapperContext.Provider value={state}>{children}</PrimariesWrapperContext.Provider>
};

export const usePrimariesWrapperContext = () => useContext(PrimariesWrapperContext);
