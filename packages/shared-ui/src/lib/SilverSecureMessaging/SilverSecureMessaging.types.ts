import React, { PropsWithChildren } from 'react';

export interface ISilverSecureMessagingContext {
  messagesList: any;
  checked: string[];
  isCheckModeSelected: boolean;
  isNewMsgGroup: boolean;
  setNewMsgGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckMode: React.Dispatch<React.SetStateAction<boolean>>;
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}

export type ISilverSecureMessagingProps = PropsWithChildren;
