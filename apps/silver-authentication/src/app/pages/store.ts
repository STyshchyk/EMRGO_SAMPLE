import {IUser} from "@emrgo-frontend/types";
import { produce } from "immer";
import store from "store";
import { create } from "zustand";

import routes from "../constants/routes";
import { IMFA } from "../services";

const hydratedUser = store.get("user");



export interface IUserData {
  user: IUser | null;
  credentials: { login: string; password: string } | null;
  mfa: IMFA | null;
  updateUser: (user: IUser | null) => void;
  setCredentials: (credentials: any) => void;
  setVerifyMFA: (flag: boolean) => void;
  setMFA: (mfa: IMFA) => void;
  removeUser: () => void;
}

export const useUserStore = create<IUserData>()((set) => ({
  user: hydratedUser || null,
  mfa: null,
  credentials: null,
  updateUser: (newUser) =>
    set(
      produce((state) => {
        state.user = newUser;
        store.set("user", newUser);
      })
    ),
  setCredentials: (credentials) =>
    set(
      produce((state) => {
        state.credentials = credentials;
      })
    ),
  setMFA: (newMFA) =>
    set(
      produce((state) => {
        state.mfa = newMFA;
      })
    ),
  removeUser: () =>
    set(
      produce((state) => {
        state.user = null;
        store.set("user", null);
        window.location.assign(routes.auth.login);
      })
    ),
  setVerifyMFA: (flag) =>
    set(
      produce((state) => {
        state.user.verifyMFA = flag;
        store.set("user", state.user);
      })
    ),
}));
