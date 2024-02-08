import React, { PropsWithChildren } from "react";

import { IUser } from "@emrgo-frontend/types";

export interface ISilverSecureMessagingContext {
  messagesList: any;
  user: IUser | null | undefined;
  checked: string[];
  isCheckModeSelected: boolean;

  setCheckMode: React.Dispatch<React.SetStateAction<boolean>>;
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}

export type ISilverSecureMessagingProps = PropsWithChildren;
