import {produce} from "immer";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

import {IOpportunityFetch} from "../TradeOpportunities/AddOpportunityModal/AddOpportunity.types";
import {IIssuer} from "../TradeOpportunities/ManageIssuers/ManageIssuers.types";
import {ISellside} from "../TradeOpportunities/ManageSellside/ManageSellside.types";
import {ICurrencyStore, IIssuerStore, IModal, IOpportunityStore, ISellSideStore} from "./store.types";

export const useTradeOpportunitiesStore = create<IModal<IOpportunityFetch>>()(
  immer((set) => ({
    isModalOpen: false,
    modifyData: null,
    modalActions: {
      deleteModifyData: () =>
        set(
          produce((state) => ({
            modifyData: null
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
        )
    }
  }))
);

export const useAddIssuerStore = create<IModal<IIssuer>>()((set, getState) => ({
  isModalOpen: false,
  modifyData: null,
  modalActions: {
    deleteModifyData: () =>
      set(
        produce((state) => ({
          modifyData: null
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
      )
  }
}));

export const useMFAModal = create<IModal<any>>()((set, getState) => ({
  isModalOpen: false,
  modalActions: {
    setModalOpen: (flag) =>
      set(
        produce((state) => {
          state.isModalOpen = flag;
        })
      )
  }
}));

export const useTradeInterestModal = create<IModal<any>>()((set, getState) => ({
  isModalOpen: false,
  opportunityData: null,
  modalActions: {
    setModalOpen: (flag) =>
      set(
        produce((state) => {
          state.isModalOpen = flag;
        })
      ),
    setOpportunityData: (opp) =>
      set(
        produce((state) => {
          state.opportunityData = opp;
        })
      )
  }
}));

export const useAddSellsideStore = create<IModal<ISellside>>()((set) => ({
  isModalOpen: false,
  modalActions: {
    setModalOpen: (flag) =>
      set(
        produce((state) => {
          state.isModalOpen = flag;
        })
      )
  }
}));

export const useSellSideStore = create<ISellSideStore>()((set) => ({
  sellSideData: [],
  sellSideActions: {
    setSellSite: (data) =>
      set(
        produce((state) => {
          state.sellSideData = data;
        })
      )
  }
}));
export const useIssuerStore = create<IIssuerStore>()((set) => ({
  issuerData: [],
  issuerAction: {
    setIsssuer: (data) =>
      set(
        produce((state) => {
          state.issuerData = data;
        })
      )
  }
}));
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
      )
  }
}));

export const useCurrencyStore = create<ICurrencyStore>()((set) => ({
  currencyData: [],
  csdData: [],
  industryData: [],
  custodyData: [],
  currencyAction: {
    setCurrency: (data) =>
      set(
        produce((state) => {
          state.currencyData = data;
        })
      ),
    setCDS: (data) =>
      set(
        produce((state) => {
          state.csdData = data;
        })
      ),
    setCustody: (data) =>
      set(
        produce((state) => {
          state.custodyData = data;
        })
      ),
    setIndustry: (data) =>
      set(
        produce((state) => {
          state.industryData = data;
        })
      )
  }
}));
