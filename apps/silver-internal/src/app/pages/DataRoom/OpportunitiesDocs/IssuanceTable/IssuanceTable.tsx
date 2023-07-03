import { useNavigate } from "react-router-dom";

import { ActionTooltip, currencyRenderer, Table, useToast } from "@emrgo-frontend/shared-ui";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { CountdownTimer } from "../../../Primaries/components/CountdownTimer";
import { DataRoomLink } from "../../../Primaries/components/DataRoomLink";
import { useOpportunityStore } from "../../../Primaries/store";
import { IOpportunityFetch } from "../../../Primaries/TradeOpportunities/AddOpportunityModal/AddOpportunity.types";
import * as Styles from "./IssuanceTable.styles";
import { IIssuanceTableProps } from "./IssuanceTable.types";


const columnHelper = createColumnHelper<IOpportunityFetch>();

export const IssuanceTable = ({ opportunities }: IIssuanceTableProps) => {
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const setOportunityInfo = useOpportunityStore(state => state.opportunityAction);
  const columns =
    [
      columnHelper.accessor("name", {
        header: "Issuance name"
      }),
      columnHelper.accessor("issuer.name", {
        header: "Issuer"
      }),
      columnHelper.accessor("type.name", {
        header: "Type",
        cell: ({ row }) => `${row.original.type?.name ?? "n/a"}`
      }),
      columnHelper.accessor("currency.name", {
        header: "Currency",
        cell: (props) => `${props?.getValue() || "n/a"}`
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (props) => `${currencyRenderer(props.getValue()) || "n/a"}`
      }),
      columnHelper.accessor("return", {
        header: "Return",
        cell: (props) => `${props?.getValue() || 0}%`
      }),
      columnHelper.accessor("tenor", {
        cell: (props) => `${props?.getValue() || "n/a"}`
      }),
      columnHelper.accessor("isin", {
        header: "ISIN"
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => `${row.original.status?.name ?? "n/a"}`
      }),
      columnHelper.accessor("timeLeft", {
        header: "Time left",
        // TODO : Replace with countown time
        cell: (props) => <CountdownTimer date={props.getValue()} />
        // cell: (props) => `${props.getValue() || "n/a"}`
      }),
      columnHelper.display({
        header: "Data room",
        id: "dataRoom",
        cell: () => {
          return (
            // TODO: Replace with correct path when the data room page is ready
            <DataRoomLink to="/" />
          );
        }
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
                      setOportunityInfo.setOpportunityDocs(rowData);
                      navigate(`manage-documents/${rowData.id}`);
                    }}
                  >
                    Manage Documents
                  </Styles.ButtonActions>
                </Styles.ButtonBox>
              }
            ></ActionTooltip>
          );
        }
      })
    ];

  const table = useReactTable({
    columns,
    data: opportunities,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table
    table={table}
    // onRowClick={(row) => console.log(row)}
    displayShown={true}
  />;
};
