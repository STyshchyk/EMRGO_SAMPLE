import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { queryKeys } from "@emrgo-frontend/constants";
import { silverPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import { Button, DashboardContent, Modal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { useTradeOpportunitiesStore } from "../store/store";
import { AddOpportunity } from "./AddOpportunityModal";
import { BankPanel } from "./BankPanel";
import { useTradeOpportunitiesContext } from "./TradeOpportunities.provider";
import { getOppotunities } from "./TradeOpportunities.service";
import * as Styles from "./TradeOpportunities.styles";
import { ITradeOpportunitiesProps } from "./TradeOpportunities.types";

export const FileInput = styled.input`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out 0s;
  background: rgba(28, 27, 31, 0.05);
  border: 1px solid rgb(232, 232, 233);
  width: 100%;
`;

export const TradeOpportunitiesComponent: FC<
  ITradeOpportunitiesProps
> = ({}: ITradeOpportunitiesProps) => {
  const {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    downloadData,
    data,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus
  } = ensureNotNull(useTradeOpportunitiesContext());

  const { isModalOpen, modalActions } = useTradeOpportunitiesStore();
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();
  const {
    data: opportunitiesData,
    isError,
    isFetched
  } = useQuery({
    queryFn: getOppotunities,
    queryKey: [queryKeys.primaries.tradeOpportunities.fetch]
  });
  return (
    <DashboardContent>
      {/*<Styles.Banners>*/}
      {/*  <Banner />*/}
      {/*  {isAboutUsDisplayed && <AboutUs onClose={() => setIsAboutUsDisplayed(false)} />}*/}
      {/*</Styles.Banners>*/}
      <Styles.Button>
        <Button
          onClick={() => {
            modalActions.setModalOpen(true);
          }}
        >
          Add Opportunity
        </Button>
        <Button
          onClick={() => {
            navigate(routes.primaries.tradeOpportunity.manageIssuers);
          }}
        >
          Manage Issuers
        </Button>
        <Button
          onClick={() => {
            navigate(routes.primaries.tradeOpportunity.manageSellside);
          }}
        >
          Manage Sellside
        </Button>
      </Styles.Button>
      <Modal
        isOpen={isModalOpen}
        width={1068}
        variant="darkened"
        onClose={() => {
          modalActions.setModalOpen(false);
          if (modalActions.deleteModifyData) modalActions.deleteModifyData();
        }}
        title={"Add Opportunity"}
        showCloseButton={true}
      >
        <AddOpportunity />
      </Modal>

      {!isError && opportunitiesData &&
        opportunitiesData.map((bank) => <BankPanel key={bank.bankId} bank={bank} />)}

    </DashboardContent>
  );
};
