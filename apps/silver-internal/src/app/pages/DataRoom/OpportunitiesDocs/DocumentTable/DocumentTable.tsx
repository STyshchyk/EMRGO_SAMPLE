import { useParams } from "react-router-dom";

import { ActionTooltip, Table, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { queryKeys } from "../../../../constants";
import { trimDate } from "../../../../utils";
import { IOppotunityDocument } from "../../../Primaries/TradeOpportunities/AddOpportunityModal/AddOpportunity.types";
import { deleteOpportunityDocument } from "../../DataRoom.service";
import * as Styles from "./DocumentTable.styles";
import { IDocumentTableProps } from "./DocumentTable.types";


const columnHelper = createColumnHelper<IOppotunityDocument>();

export const DocumentTable = ({ documents }: IDocumentTableProps) => {
  const { id } = useParams();
  const client = useQueryClient();

  const { showErrorToast } = useToast();
  const { mutate: doDeleteOpportunityDocument } = useMutation(deleteOpportunityDocument, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.primaries.tradeOpportunities.documents, id]).then(() => {
      });
    },
    onError: () => {
      showErrorToast("Error while trying to delete document");
    }
  });
  const columns =
    [
      columnHelper.accessor("name", {
        header: "Document Title"
      }),
      columnHelper.accessor("updatedAt", {
        header: "Date Uploaded",
        cell: (props) => {
          return trimDate(props.getValue());
        }
      }),
      columnHelper.accessor("isPublic", {
        header: "Stage",
        cell: (props) => {
          return props.getValue() ? "Open" : "Client Questionnaire";
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
                      doDeleteOpportunityDocument({ opportunityId: rowData.opportunityId, docId: rowData.id });
                    }}
                  >
                    Delete Document
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
    data: documents,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table
    table={table}
    // onRowClick={(row) => console.log(row)}

  />;
};
