import React, { PropsWithChildren } from "react";

import { TWrapperType } from "@emrgo-frontend/types";

export interface IFilterContext {
  filters: TFilterValue | null;
  isNewMsgGroup: TWriteType;
  userType: TWrapperType | null;
  setUserType: React.Dispatch<React.SetStateAction<TWrapperType | null>>;
  setFilterValue: (
    value: any,
    key: string,
    label: string,
    type: string,
    filterValue: string
  ) => void;
  auditUrl: string;
  setAuditUrl: React.Dispatch<React.SetStateAction<string>>;
  messageType: TMessageType;
  setFilters: React.Dispatch<React.SetStateAction<TFilterValue | null>>;
  setNewMsgGroup: (state: TWriteType) => void;
  setMessageType: React.Dispatch<React.SetStateAction<TMessageType>>;
  clearFilterValue: (keys: string[]) => void;
}

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
