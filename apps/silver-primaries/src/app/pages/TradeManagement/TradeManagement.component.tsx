import React, { FC, useState } from "react";

import { Button, DashboardContent, Modal } from "@emrgo-frontend/shared-ui";

import { TradeInterest } from "../components/TradeInterestModal";
import { getExecutedStatusLabel } from "../helpers";
import { useTradeInterestModal } from "../store";
import { ExecutedTableComponent } from "./ExecutedTable";
import * as Styles from "./TradeManagement.styles";
import { ITradeManagementProps } from "./TradeManagement.types";
import { SellsideEvidence } from "./SellsideEvidenceModal";

export const TradeManagementComponent: FC<ITradeManagementProps> = ({ children }: ITradeManagementProps) => {
  const { isModalOpen: isTradeOpen, modalActions: tradeActions } = useTradeInterestModal();
  const [sellSide, setSellSide] = useState(false);
  return (
    <Styles.TradeManagement>
      <DashboardContent>
        <div style={{ display: "flex", gap: "20px" }}>
          <Button onClick={() => setSellSide(true)}>Sell Side trade evidence</Button>
          <Button>Sell Side trade evidence</Button>
          <Button>Sell Side trade evidence</Button>
        </div>

        <ExecutedTableComponent />
        {/*<Modal*/}
        {/*  isOpen={false}*/}
        {/*  width={1068}*/}
        {/*  variant="darkened"*/}
        {/*  onClose={() => {*/}
        {/*    tradeActions.setModalOpen(false);*/}
        {/*    if (tradeActions.deleteModifyData) tradeActions.deleteModifyData();*/}
        {/*  }}*/}
        {/*  title={"Trade interest"}*/}
        {/*  showCloseButton={true}*/}
        {/*>*/}
        {/*  <TradeInterest />*/}
        {/*</Modal>*/}
        <Modal
          isOpen={sellSide}
          width={1068}
          variant="darkened"
          onClose={() => {
            setSellSide(false);
          }}
          title={"Sell-side trade Evidence"}
          showCloseButton={true}
        >
          <SellsideEvidence />
        </Modal>
      </DashboardContent>
    </Styles.TradeManagement>
  );
};
