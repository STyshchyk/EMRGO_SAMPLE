import { PropsWithChildren } from "react";

export interface IAccordionProps extends PropsWithChildren {}

export interface IAccordionContext {
  panel: string;
  setPanel: (panel: string) => void;
}
