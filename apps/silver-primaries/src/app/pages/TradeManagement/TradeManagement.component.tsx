import React, { FC } from "react";

import { DashboardContent, Modal } from "@emrgo-frontend/shared-ui";

import { TradeInterest } from "../components/TradeInterestModal";
import { getExecutedStatusLabel } from "../helpers";
import { useTradeInterestModal } from "../store";
import { ExecutedTableComponent } from "./ExecutedTable";
import * as Styles from "./TradeManagement.styles";
import { ITradeManagementProps } from "./TradeManagement.types";

export const TradeManagementComponent: FC<ITradeManagementProps> = ({ children }: ITradeManagementProps) => {
  const { isModalOpen: isTradeOpen, modalActions: tradeActions } = useTradeInterestModal();

  return (
    <Styles.TradeManagement>
      <DashboardContent>
        <ExecutedTableComponent />
        <Modal
          isOpen={false}
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
      </DashboardContent>
    </Styles.TradeManagement>
  );
};
