import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IPlatformContext } from "./Platform.types";

const PlatformContext = createContext<IPlatformContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Platform template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const PlatformProvider = ({ children }: PropsWithChildren) => {
  const state: IPlatformContext = {};

  return <PlatformContext.Provider value={state}>{children}</PlatformContext.Provider>;
};

export const usePlatformContext = () => useContext(PlatformContext);
