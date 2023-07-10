import { useNavigate } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  ActionTooltip,
  currencyRenderer,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast
} from "@emrgo-frontend/shared-ui";
import { IOpportunityFetch } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { CountdownTimer } from "../../components/CountdownTimer";
import { getOpportunityStatusLabel } from "../../helpers";
import { useOpportunityStore, useTradeInterestModal, useTradeOpportunitiesStore } from "../../store";
import { showOpportunity, TShown } from "../TradeOpportunities.service";
import { ITradeInterestTableProps } from "./TradeInterestTable.types";
import { ITradeInterest } from "../TradeInterestModal";

const columnHelper = createColumnHelper<ITradeInterest>();

export const TradeInterestTable = ({ tradeInterest }: ITradeInterestTableProps) => {
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("opportunityId", {
      header: "Opportunity Id",
    }),
    columnHelper.accessor("userId", {
      header: "User Id",
    }),
    columnHelper.accessor("detail", {
      header: "Details",
    }),
  ];
  const table = useReactTable({
    columns,
    data: tradeInterest,
    getCoreRowModel: getCoreRowModel(),

  });
  return (
    <Table
      table={table}
      // onRowClick={(row) => console.log(row)}
      displayShown={true}
    />
  );
};
