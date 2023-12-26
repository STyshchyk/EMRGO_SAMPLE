import { PropsWithChildren } from "react";

export interface IClientSecureMessagingContext {
  messagesList: any;
  checked: string[];
  isCheckModeSelected: boolean;
  setCheckMode: React.Dispatch<React.SetStateAction<boolean>>;
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}

export type IClientSecureMessagingProps = PropsWithChildren;
