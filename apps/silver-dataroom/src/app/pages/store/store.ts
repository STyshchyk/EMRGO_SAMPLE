import { produce } from "immer";
import { create } from "zustand";

import { IOpportunityStore } from "./store.types";

export interface IModal<T> {
  isModalOpen: boolean;
  modifyData?: T | null;
  modalActions: {
    setModifyData?: (data: T) => void;
    deleteModifyData?: () => void;
    setModalOpen: (flag: boolean) => void;
  };
}

export const useOpportunityStore = create<IOpportunityStore>()((set) => ({
  opportunityData: [],
  opportunityDocs: null,
  opportunityAction: {
    setOpportunity: (data) =>
      set(
        produce((state) => {
          state.opportunityData = data;
        })
      ),
    setOpportunityDocs: (data) =>
      set(
        produce((state) => {
          state.opportunityDocs = data;
        })
      ),
  },
}));
export const useAddDocumentsModal = create<IModal<any>>()((setState) => ({
  isModalOpen: false,
  modalActions: {
    setModalOpen: (flag) =>
      setState(
        produce((state) => {
          state.isModalOpen = flag;
        })
      ),
  },
}));
