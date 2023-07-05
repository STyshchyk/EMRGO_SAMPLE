import { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { Table, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useTradeOpportunitiesStore } from "../../../store/store";
import { shownSellside } from "../Sellside.service";
import * as Styles from "./SellsideTable.styles";
import { ISellsideTableProps } from "./SellsideTable.types";

const columnHelper = createColumnHelper<any>();

export const SellsideTable: FC<ISellsideTableProps> = ({ sellSide }) => {
  const { modalActions } = useTradeOpportunitiesStore();
  const { showErrorToast } = useToast();
  const client = useQueryClient();
  const { mutate: setShownSellside } = useMutation(shownSellside, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.primaries.tradeOpportunities.sellSide.fetch]).then(() => {
      });
    },
    onError: () => {
      showErrorToast("Error setting status for Issuer");
    }
  });
  const columns = [
    columnHelper.accessor("id", {
      header: "Entity ID"
    }),
    columnHelper.accessor("name", {
      header: "Entity name"
    }),
    columnHelper.accessor("logo", {
      header: "Entity Logo",
      cell: (props) => <Styles.TableImg src={`${props.getValue()}`} alt={"Logo img"} />
    })

  ];

  const table = useReactTable({
    columns,
    data: sellSide,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table
    table={table}

  />;
};
