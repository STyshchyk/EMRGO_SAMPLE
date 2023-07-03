import { createContext, PropsWithChildren, useContext, useState } from "react";

import { IAccordionContext } from "./Accordion.types";

const AccordionContext = createContext<IAccordionContext | null>(null);

export const AccordionProvider = ({ children }: PropsWithChildren) => {
  const [panel, setPanel] = useState("");

  const value = { panel, setPanel };

  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
};

export const useAccordion = () => {
  const value = useContext(AccordionContext);

  if (!value) {
    throw new Error("useAccordion must be used within Accordion");
  }

  return value;
};
