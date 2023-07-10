import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { ITradeManagementContext } from "./TradeManagement.types";

const TradeManagementContext = createContext<ITradeManagementContext | null>(null);

/**
  * @description
  * @param {PropsWithChildren} { children }
  * @returns {JSX.Element}
  * Integration point for the TradeManagement template. Put any integration logic here.
  * For example, if you need to fetch data from an API, you can do that here.
  *
  * TODO: Implement this code.
  */
export const TradeManagementProvider = ({ children }: PropsWithChildren) => {
  const state: ITradeManagementContext = {};

  return <TradeManagementContext.Provider value={state}>{children}</TradeManagementContext.Provider>
};

export const useTradeManagementContext = () => useContext(TradeManagementContext);
