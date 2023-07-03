import { PropsWithChildren } from "react";

export type TQuestionnaireItemVariants = "signup" | "default";

export interface IQuestionnaireItemProps extends PropsWithChildren {
  timeRemaining: string;
  completed?: boolean;
  variant?: TQuestionnaireItemVariants;
}

export interface IQuestionnaireItemsProps extends PropsWithChildren {}
