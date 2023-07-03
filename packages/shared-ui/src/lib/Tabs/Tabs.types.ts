import { PropsWithChildren } from "react";

export interface ITabsProps extends PropsWithChildren {
  /** The value of the currently selected tab */
  value: string;
  /** Callback fired when the value changes.*/
  onChange?: (value: string) => void;
}

export interface ITabsContext {
  tab: string;
  setTab: (tab: string) => void;
}
