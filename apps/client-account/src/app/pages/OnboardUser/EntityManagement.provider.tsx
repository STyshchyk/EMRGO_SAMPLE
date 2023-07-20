import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IEntityManagementContext } from "./EntityManagement.types";

const EntityManagementContext = createContext<IEntityManagementContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the OnboardUser template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const EntityManagementProvider = ({ children }: PropsWithChildren) => {
  const [isShown2, setIsShow2] = useState(false);


  const state: IEntityManagementContext = {
    isShown: isShown2,
    setIsShow: setIsShow2
  };


  return <EntityManagementContext.Provider value={state}>{children}</EntityManagementContext.Provider>;
};

export const useEntityManagementContext = () => useContext(EntityManagementContext);
