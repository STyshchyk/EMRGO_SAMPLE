import { createContext, useContext } from "react";

import { ITabsContext } from "./Tabs.types";

export const TabsContext = createContext<ITabsContext | null>(null);

export const useTabs = () => {
  const value = useContext(TabsContext);

  if (!value) {
    throw new Error("useTabs must be used within Tabs");
  }

  return value;
};
