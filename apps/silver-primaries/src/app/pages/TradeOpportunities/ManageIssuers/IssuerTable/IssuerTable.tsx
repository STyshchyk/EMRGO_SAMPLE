import { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  ActionTooltip,
  Span,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useAddIssuerStore } from "../../../store/store";
import { shownIssuer } from "../Issuer.services";
import { IIssuer } from "../ManageIssuers.types";
import * as Styles from "./IssuerTable.styles";
import { IIssuerTableProps } from "./IssuerTable.types";

const columnHelper = createColumnHelper<IIssuer>();

export const IssuerTable: FC<IIssuerTableProps> = ({ issuances }) => {
  const { modalActions } = useAddIssuerStore();
  const { showErrorToast } = useToast();
  const client = useQueryClient();
  const { mutate: setShownIssuer } = useMutation(shownIssuer, {
    onSuccess: () => {
      client
        .invalidateQueries([queryKeys.primaries.tradeOpportunities.issuers.fetch])
        .then(() => {});
    },
    onError: () => {
      showErrorToast("Error setting status for Issuer");
    },
  });
  const columns = [
    columnHelper.accessor("id", {
      header: "Entity ID",
    }),
    columnHelper.accessor("name", {
      header: "Entity name",
    }),
    columnHelper.accessor("jurisdiction", {
      header: "Issuer Jurisdiction",
    }),
    columnHelper.accessor("industry", {
      header: "Industry",
      cell: ({ cell }) => <span>{cell.getValue() ? cell.getValue() : "N/A"}</span>,
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ cell }) => <Span $width={200}>{cell.getValue()}</Span>,
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
              <TooltipButtonBox>
                <TooltipButtonActions
                  onClick={() => {
                    if (rowData && modalActions.setModifyData) {
                      console.log("rowData", rowData);
                      modalActions.setModifyData(rowData);
                      modalActions.setModalOpen(true);
                    }
                  }}
                >
                  Modify Issuer
                </TooltipButtonActions>
                {/*<Styles.ButtonActions*/}
                {/*  onClick={() => {*/}
                {/*    if (!rowData.isShown) return;*/}
                {/*    setShownIssuer({*/}
                {/*      id: rowData.id,*/}
                {/*      status: TShown.hide*/}
                {/*    });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Hide Issuer*/}
                {/*</Styles.ButtonActions>*/}
                {/*<Styles.ButtonActions*/}
                {/*  onClick={() => {*/}
                {/*    if (rowData.isShown) return;*/}
                {/*    setShownIssuer({*/}
                {/*      id: rowData.id,*/}
                {/*      status: TShown.show*/}
                {/*    });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Show Issuer*/}
                {/*</Styles.ButtonActions>*/}
                {/*<Styles.ButtonActions*/}
                {/*  onClick={() => {*/}
                {/*    console.log("Resend info");*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Delete Issuer*/}
                {/*</Styles.ButtonActions>*/}
              </TooltipButtonBox>
            }
          ></ActionTooltip>
        );
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: issuances ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table
      table={table}
      // onRowClick={(row) => console.log(row)}
    />
  );
};
