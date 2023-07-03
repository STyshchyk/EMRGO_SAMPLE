import React, { FC, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants";
import { useOpportunityStore } from "../../Primaries/store/store";
import { IInvestmentBank } from "../../Primaries/TradeOpportunities/AddOpportunityModal/AddOpportunity.types";
import { getOppotunities } from "../../Primaries/TradeOpportunities/TradeOpportunities.service";
import { BankPanel } from "./BankPanel";
import * as Styles from "./OpportunitiesDocs.styles";
import { IOpportunitiesDocsProps } from "./OpportunitiesDocs.types";


export const OpportunitiesDocsComponent: FC<IOpportunitiesDocsProps> = ({}: IOpportunitiesDocsProps) => {
  const opportunities = useOpportunityStore(state => state.opportunityData);
  const oppActions = useOpportunityStore(state => state.opportunityAction);
  const [oppo, setOppo] = useState<IInvestmentBank | null>(null);
  const { data } = useQuery([queryKeys.primaries.tradeOpportunities.fetch], {
    queryFn: () => getOppotunities(),
    placeholderData: opportunities,
    onSuccess: (data) => {
      oppActions.setOpportunity(data);
    }
  });

  return <Styles.OpportunitiesDocs>
    <Styles.DashboardContent>
      {data &&
        data.map((bank) => <BankPanel key={bank.bankId} bank={bank} />)}
    </Styles.DashboardContent>
  </Styles.OpportunitiesDocs>;
};
