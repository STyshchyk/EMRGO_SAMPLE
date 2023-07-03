import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { ITroubleSigningInThanksContext } from "./TroubleSigningInThanks.types";

const TroubleSigningInThanksContext = createContext<ITroubleSigningInThanksContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the TroubleSigningInThanks template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const TroubleSigningInThanksProvider = ({ children }: PropsWithChildren) => {
  const state: ITroubleSigningInThanksContext = {};

  return (
    <TroubleSigningInThanksContext.Provider value={state}>
      {children}
    </TroubleSigningInThanksContext.Provider>
  );
};

export const useTroubleSigningInThanksContext = () => useContext(TroubleSigningInThanksContext);
