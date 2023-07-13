import { produce } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { IUserNew } from "./Users/User.types";

export interface IModal<T> {
  isModalOpen: boolean;
  modifyData?: T | null;
  modalActions: {
    setModifyData?: (data: T) => void;
    deleteModifyData?: () => void;
    setModalOpen: (flag: boolean) => void;
  };
}

export const useInviteUserModal = create<IModal<IUserNew>>()((set) => ({
  isModalOpen: false,
  modifyData: null,
  modalActions: {
    deleteModifyData: () =>
      set(
        produce((state) => ({
          modifyData: null,
        }))
      ),
    setModifyData: (data) =>
      set(
        produce((state) => {
          state.modifyData = data;
        })
      ),
    setModalOpen: (flag) =>
      set(
        produce((state) => {
          state.isModalOpen = flag;
        })
      ),
  },
}));

export interface IInvitedIsers {
  users: IUserNew[] | null;
  setUsers: (data: IUserNew[] | null) => void;
}

// setModalOpen: (flag) => set((state) => void (state.isModalOpen = flag)),
export const useInvitedUsersStore = create<IInvitedIsers>()(
  immer((set) => ({
    users: null,
    setUsers: (data) =>
      set((state) => {
        state.users = data;
      }),
  }))
);
// setUsers: async () =>
//   set((state) => {
//     doGetInvitedUsers().then((response) => {
//       state.users = response.data;
//     });
//   }),
