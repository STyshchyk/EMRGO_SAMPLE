import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IDataRoomContext } from "./DataRoom.types";

const DataRoomContext = createContext<IDataRoomContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the DataRoom template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const DataRoomProvider = ({ children }: PropsWithChildren) => {
  const state: IDataRoomContext = {};

  return <DataRoomContext.Provider value={state}>{children}</DataRoomContext.Provider>;
};

export const useDataRoomContext = () => useContext(DataRoomContext);
