import React, { createContext, PropsWithChildren, useContext, useState } from "react";

import { ensureNotNull } from "@emrgo-frontend/utils";

import {
  IFilterContext,
  IFilterProvider,
  TFilterValue,
  TMessageType,
} from "./filter-context.types";

const FilterContext = createContext<IFilterContext | null>(null);

export const FilterProvider = ({ children, version = "v1" }: IFilterProvider) => {
  const [filters, setFilters] = useState<TFilterValue | null>(null);
  const [messageType, setMessageType] = React.useState<TMessageType>("received");
  function setFilterValue(value: any, key: string, label: string, type: string, isDefault = false) {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = { value, label, type, key, isDefault };
      return updatedFilters;
    });
  }

  function clearFilterValue(keys: string[]) {
    const updatedFilters = { ...filters };

    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        delete updatedFilters[key];
      });
    } else {
      // If keys is a single string, delete that key
      delete updatedFilters[keys];
    }

    setFilters(updatedFilters);
  }

  const providerValue: IFilterContext = {
    filters,
    messageType,
    setMessageType,
    setFilters,
    setFilterValue,
    clearFilterValue,
  };

  return <FilterContext.Provider value={providerValue}>{children}</FilterContext.Provider>;
};

export const FilterConsumer = ({ children }: PropsWithChildren) => (
  <FilterContext.Consumer>
    {(context) => {
      if (context === undefined) {
        throw new Error("FilterConsumer must be used within a FilterProvider");
      }
      return children(context);
    }}
  </FilterContext.Consumer>
);

export const useFilters = () => {
  const context = ensureNotNull(useContext(FilterContext));

  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
