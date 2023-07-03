import { useNavigate } from "react-router-dom";

import { ActionTooltip, currencyRenderer, Table, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { queryKeys } from "../../../../constants";
import routes from "../../../../constants/routes";
import { CountdownTimer } from "../../components/CountdownTimer";
import { DataRoomLink } from "../../components/DataRoomLink";
import { getOpportunityStatusLabel } from "../../helpers";
import { useOpportunityStore, useTradeOpportunitiesStore } from "../../store";
import { IOpportunityFetch } from "../AddOpportunityModal/AddOpportunity.types";
import { showOpportunity, TShown } from "../TradeOpportunities.service";
import * as Styles from "./IssuanceTable.styles";
import { IIssuanceTableProps } from "./IssuanceTable.types";

//TODO : FIX this
const columnHelper = createColumnHelper<IOpportunityFetch>();

export const IssuanceTable = ({ opportunities }: IIssuanceTableProps) => {
  const { modalActions } = useTradeOpportunitiesStore();
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const setOportunityInfo = useOpportunityStore((state) => state.opportunityAction);
  const { mutate: setShownOpportunity } = useMutation(showOpportunity, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.primaries.tradeOpportunities.fetch]).then(() => {});
    },
    onError: () => {
      showErrorToast("Error setting status for Opportunity");
    },
  });

  const columns = [
    columnHelper.accessor("name", {
      header: "Issuance name",
    }),
    columnHelper.accessor("issuer.name", {
      header: "Issuer",
    }),
    columnHelper.accessor("type.name", {
      header: "Type",
      cell: ({ row }) => `${row.original.type?.name ?? "n/a"}`,
    }),
    columnHelper.accessor("currency.name", {
      header: "Currency",
      cell: (props) => `${props?.getValue() || "n/a"}`,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (props) => `${currencyRenderer(props.getValue()) || "n/a"}`,
    }),
    columnHelper.accessor("return", {
      header: "Return",
      cell: (props) => `${props?.getValue() || 0}%`,
    }),
    columnHelper.accessor("tenor", {
      cell: (props) => (props.getValue() ? `${props?.getValue()} years` : "n/a"),
    }),
    columnHelper.accessor("isin", {
      header: "ISIN",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return `${getOpportunityStatusLabel(row.original?.statusId) ?? "N/A"}`;
      },
    }),
    columnHelper.accessor("timeLeft", {
      header: "Time left",
      // TODO : Replace with countown time
      cell: (props) => <CountdownTimer date={props.getValue()} />,
      // cell: (props) => `${props.getValue() || "n/a"}`
    }),
    columnHelper.display({
      header: "Data room",
      id: "dataRoom",
      cell: ({ row }) => {
        return (
          // TODO: Replace with correct path when the data room page is ready
          <DataRoomLink
            to={`${routes.dash.dataRoom.opportunities}/manage-documents/${row.original.id}`}
            onClick={() => {
              setOportunityInfo.setOpportunityDocs(row.original);
            }}
          />
        );
      },
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <ActionTooltip
            title={
              <Styles.ButtonBox>
                <Styles.ButtonActions
                  onClick={() => {
                    modalActions.setModalOpen(true);
                    if (modalActions.setModifyData) {
                      modalActions.setModifyData(rowData);
                    }
                  }}
                >
                  Modify Opportunity
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    if (!rowData.isShown) return;
                    setShownOpportunity({
                      id: rowData.id,
                      status: TShown.hide,
                    });
                  }}
                >
                  Deactivate Opportunity
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    if (rowData.isShown) return;
                    setShownOpportunity({
                      id: rowData.id,
                      status: TShown.show,
                    });
                  }}
                >
                  Activate Opportunity
                </Styles.ButtonActions>
                {/*<Styles.ButtonActions*/}
                {/*  onClick={() => {*/}
                {/*    //TODO : ADD delete API*/}
                {/*  }}>*/}
                {/*  Delete Opportunity*/}
                {/*</Styles.ButtonActions>*/}
              </Styles.ButtonBox>
            }
          ></ActionTooltip>
        );
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: opportunities,
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
