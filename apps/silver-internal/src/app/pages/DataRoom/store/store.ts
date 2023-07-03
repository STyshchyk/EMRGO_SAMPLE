import { produce } from "immer";
import { create } from "zustand";

export interface IModal<T> {
  isModalOpen: boolean;
  modifyData?: T | null;
  modalActions: {
    setModifyData?: (data: T) => void;
    deleteModifyData?: () => void;
    setModalOpen: (flag: boolean) => void;
  };
}


export const useAddDocumentsModal = create<IModal<any>>()((setState) => ({
  isModalOpen: false,
  modalActions: {
    setModalOpen: (flag) =>
      setState(
        produce((state) => {
          state.isModalOpen = flag;
        })
      )
  }
}));
