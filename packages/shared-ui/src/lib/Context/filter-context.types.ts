import React, { PropsWithChildren } from "react";

export interface IFilterContext {
  filters: TFilterValue[] | null;
  setFilters: React.Dispatch<React.SetStateAction<TFilterValue>>;
  setFilterValue: (
    value: any,
    key: string | number,
    label: string,
    type: string,
    isDefault?: boolean
  ) => void;
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
