import React, { PropsWithChildren } from "react";

export interface IFilterContext {
  filters: TFilterValue | null;
  isNewMsgGroup: TWriteType;
  userType: TUserType;
  setUserType: React.Dispatch<React.SetStateAction<TUserType>>;
  setFilterValue: (
    value: any,
    key: string | number,
    label: string,
    type: string,
    isDefault?: boolean
  ) => void;
  messageType: TMessageType;
  setFilters: React.Dispatch<React.SetStateAction<TFilterValue>>;
  setNewMsgGroup: (state: TWriteType) => void;
  setMessageType: React.Dispatch<React.SetStateAction<TMessageType>>;
  clearFilterValue: (keys: string[]) => void;
}

export type TUserType = "client" | "internal";

export interface IFilterProvider extends PropsWithChildren {
  version?: string;
}

export type TFilterValue = {
  value: any;
  key: string | number;
  label: string;
  type: string;
  isDefault?: boolean;
};
export type TMessageType = "Received" | "Draft" | "Sent" | "Archived";
export type TWriteType = "none" | "sent" | "draft";
