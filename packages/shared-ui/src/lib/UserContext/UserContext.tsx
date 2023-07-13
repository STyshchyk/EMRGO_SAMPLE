import React, {createContext, useContext, useState} from "react";

import {IUser} from "@emrgo-frontend/types";
import store from "store";

import {IUserData} from "./UserContext.types";

const UserContext = createContext<IUserData | undefined>(undefined);

export function UserProvider({children}: { children: React.ReactNode }) {
  const hydratedUser = store.get("user");
  const [user, setUser] = useState<IUser | null>(hydratedUser || null);

  const updateUser = (newUser: IUser | null) => {
    setUser(newUser);
    store.set("user", newUser);
  };

  const removeUser = () => {
    setUser(null);
    store.set("user", null);
  };

  const userData: IUserData = {user, updateUser, removeUser};

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
