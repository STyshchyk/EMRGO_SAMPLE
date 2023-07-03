import { PropsWithChildren } from "react";

export type TPanelVariants = "standard" | "raised";

export interface IPanelProps extends PropsWithChildren {
  variant?: TPanelVariants;
  className?: string;
}
