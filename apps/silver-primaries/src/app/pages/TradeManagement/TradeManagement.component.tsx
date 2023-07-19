import React, { FC, useState } from "react";

import { Button, DashboardContent, Modal } from "@emrgo-frontend/shared-ui";

import { TradeInterest } from "../components/TradeInterestModal";
import { useTradeInterestModal, useTradeTicketStore } from "../store";
import { ExecutedTableComponent } from "./ExecutedTable";
import * as Styles from "./TradeManagement.styles";
import { ITradeManagementProps } from "./TradeManagement.types";
import { SellsideEvidence } from "./SellsideEvidenceModal";
import { TradeTicket } from "./TradeTicketModal";

export const TradeManagementComponent: FC<ITradeManagementProps> = ({ children }: ITradeManagementProps) => {
  const { isModalOpen: isTradeOpen, modalActions: tradeActions } = useTradeInterestModal();
  const { isModalOpen: isTicketOpen, modalActions: ticketActions } = useTradeTicketStore();
  const [sellSide, setSellSide] = useState(false);
  return (
    <Styles.TradeManagement>
      <DashboardContent>
        <div style={{ display: "flex", gap: "20px" }}>
          <Button onClick={() => setSellSide(true)}>Sell Side trade evidence</Button>
          <Button onClick={() => {
            if (ticketActions.setModalOpen)
              ticketActions.setModalOpen(true);
          }}
          >
            Trade Ticket
          </Button>
          <Button onClick={() => {
            if (tradeActions.setModalOpen)
              tradeActions.setModalOpen(true);
          }}
          >
            Trade interest
          </Button>
        </div>

        <ExecutedTableComponent />
        <Modal
          isOpen={isTradeOpen}
          width={1068}
          variant="darkened"
          onClose={() => {
            tradeActions.setModalOpen(false);
            if (tradeActions.deleteModifyData) tradeActions.deleteModifyData();
          }}
          title={"Trade interest"}
          showCloseButton={true}
        >
          <TradeInterest />
        </Modal>
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
        <Modal
          isOpen={isTicketOpen}
          width={1068}
          variant="darkened"
          onClose={() => {
            if (ticketActions.setModalOpen) ticketActions.setModalOpen(false);
          }}
          title={"Sell-side trade Evidence"}
          showCloseButton={true}
        >
          <TradeTicket/>
        </Modal>
      </DashboardContent>
    </Styles.TradeManagement>
  );
};
