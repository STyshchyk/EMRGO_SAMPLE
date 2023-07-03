import { PropsWithChildren } from "react";

export interface IAccordionPanelProps extends PropsWithChildren {
  id: string;
}

export interface IAccordionPanelContext {
  id: string;
}

export interface IAccordionPanelProviderProps extends PropsWithChildren {
  id: string;
}
