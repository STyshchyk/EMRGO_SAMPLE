import { createContext, FC, useContext } from "react";

import { IAccordionPanelContext, IAccordionPanelProviderProps } from "./AccordionPanel.types";

const AccordionPanelContext = createContext<IAccordionPanelContext | null>(null);

export const AccordionPanelProvider: FC<IAccordionPanelProviderProps> = ({ children, id }) => {
  const value = { id };

  return <AccordionPanelContext.Provider value={value}>{children}</AccordionPanelContext.Provider>;
};

export const useAccordionPanel = () => {
  const value = useContext(AccordionPanelContext);

  if (!value) {
    throw new Error("useAccordionPanel must be used within AccordionPanel");
  }

  return value;
};
