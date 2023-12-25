import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IClientSecureMessagingContext } from "./ClientSecureMessaging.types";

const ClientSecureMessagingContext = createContext<IClientSecureMessagingContext | null>(null);

/**
  * @description
  * @param {PropsWithChildren} { children }
  * @returns {JSX.Element}
  * Integration point for the ClientSecureMessaging template. Put any integration logic here.
  * For example, if you need to fetch data from an API, you can do that here.
  *
  * TODO: Implement this code.
  */
export const ClientSecureMessagingProvider = ({ children }: PropsWithChildren) => {
  const state: IClientSecureMessagingContext = {};

  return <ClientSecureMessagingContext.Provider value={state}>{children}</ClientSecureMessagingContext.Provider>
};

export const useClientSecureMessagingContext = () => useContext(ClientSecureMessagingContext);
