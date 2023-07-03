import { createContext, useContext } from "react";

import { ReferenceType } from "@floating-ui/react";

import { ITooltipContext } from "./Tooltip.types";

export const TooltipContext = createContext<ITooltipContext<ReferenceType> | null>(null);

export const useTooltipContext = () => {
  const value = useContext(TooltipContext);

  if (!value) {
    throw new Error("useTooltipContext must be used within Tooltip");
  }

  return value;
};
