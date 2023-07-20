import { createContext, PropsWithChildren, useContext, useState } from "react";

import custody from "./data/custody";
import paymentInstructionData from "./data/payment-instruction";
import pendingSettlement from "./data/pending-settlement";
import standardSettlementInstructionData from "./data/standard-settlement-instruction";
import {
  IPaymentInstruction,
  IPostTradeContext,
  IStandardSettlementInstruction,
} from "./PostTrade.types";

const PostTradeContext = createContext<IPostTradeContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the PostTrade template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const PostTradeProvider = ({ children }: PropsWithChildren) => {
  const [paymentInstruction, setPaymentInstruction] = useState<IPaymentInstruction | undefined>();
  const [standardSettlementInstruction, setStandardSettlementInstruction] = useState<
    IStandardSettlementInstruction | undefined
  >();

  const viewPayment = () => {
    setPaymentInstruction(paymentInstructionData);
  };

  const viewCustody = () => {
    setStandardSettlementInstruction(standardSettlementInstructionData);
  };

  const downloadPaymentInstructionPdf = (id: number) => {
    console.log("Download payment instruction PDF", id);
  };

  const downloadPaymentInstructionCsv = (id: number) => {
    console.log("Download payment instruction CSV", id);
  };

  const downloadStandardSettlementInstructionPdf = (id: number) => {
    console.log("Download standard settlement instruction PDF", id);
  };

  const downloadStandardSettlementInstructionCsv = (id: number) => {
    console.log("Download standard settlement instruction CSV", id);
  };

  const state: IPostTradeContext = {
    custody,
    pendingSettlement,
    viewPayment,
    viewCustody,
    downloadPaymentInstructionPdf,
    downloadPaymentInstructionCsv,
    paymentInstruction,
    setPaymentInstruction,
    downloadStandardSettlementInstructionPdf,
    downloadStandardSettlementInstructionCsv,
    standardSettlementInstruction,
    setStandardSettlementInstruction,
  };

  return <PostTradeContext.Provider value={state}>{children}</PostTradeContext.Provider>;
};

export const usePostTradeContext = () => useContext(PostTradeContext);
