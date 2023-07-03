import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ITroubleSigningInContext } from "./TroubleSigningIn.types";

const TroubleSigningInContext = createContext<ITroubleSigningInContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the TroubleSigningIn template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const TroubleSigningInProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const state: ITroubleSigningInContext = {
    onSubmit: () => {
      console.log("onSubmit");
      navigate("/trouble-signing-in-thanks");
    },
  };

  return (
    <TroubleSigningInContext.Provider value={state}>{children}</TroubleSigningInContext.Provider>
  );
};

export const useTroubleSigningInContext = () => useContext(TroubleSigningInContext);
