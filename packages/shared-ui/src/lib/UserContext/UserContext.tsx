import React, { createContext, useContext, useState } from "react";

import { IMFA, IUser, IUserConfigData } from "@emrgo-frontend/types";
import store from "store";

import { IUserData } from "./UserContext.types";

const UserContext = createContext<IUserData | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const hydratedUser = store.get("user");
  const [userConfig, setUserConfig] = useState<IUserConfigData | null>(hydratedUser || null);
  const [mfa, setMfaState] = useState<IMFA | null>(null);

  const updateUserConfig = (newUserConfig: IUserConfigData | null) => {
    setUserConfig(newUserConfig);
    store.set("user", newUserConfig);
  };

  const updateUser = (newUser: IUser | null) => {
    setUserConfig({
      permissions: userConfig?.permissions || [],
      roles: userConfig?.roles || [],
      user: newUser,
    });
    store.set("user", { ...userConfig, user: newUser });
  };

  const removeUser = () => {
    setUserConfig(null);
    store.set("user", null);
  };

  const setMFA = (newMFA: IMFA) => {
    setMfaState(newMFA);
  };

  const setVerifyMFA = (flag: boolean) => {
    store.set("user", { ...userConfig, verifyMFA: flag });
  };

  const userDataContext: IUserData = {
    user: userConfig?.user,
    roles: userConfig?.roles,
    permissions: userConfig?.permissions,
    mfa,
    updateUserConfig,
    updateUser,
    removeUser,
    setMFA,
    setVerifyMFA,
  };

  return <UserContext.Provider value={userDataContext}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
