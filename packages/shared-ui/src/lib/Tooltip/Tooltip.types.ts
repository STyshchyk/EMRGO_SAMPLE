import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

import { ReferenceType, UseFloatingReturn, useInteractions } from "@floating-ui/react";

export interface ITooltipProps {
  content: ReactNode;
  children: ReactElement;
  className?: string;
}

export interface ITooltipContext<Type extends ReferenceType>
  extends UseFloatingReturn<Type>,
    ReturnType<typeof useInteractions> {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
