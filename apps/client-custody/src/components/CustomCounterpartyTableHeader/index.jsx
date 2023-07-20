import React from "react";
import { useTranslation } from "react-i18next";

import { MTableHeader } from "@material-table/core";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import style from "./style.module.scss";

// const useStyles = makeStyles({
//   tableCell: {
//     padding: '0px 8px',
//   },
// });

const CustomCounterpartyTableHeader = (props) => {
  const { columns } = props;
  const { t } = useTranslation(["counterparty"]);

  const map = new Map();
  columns?.map(({ field }) => map.set(field, field));

  // Improve this - repetitive on table.js
  // used on ui table
  const content = columns?.map(({ field }) => {
    if (field === "deliveryOrReceiveAgentIdType") {
      if (map.has("deliveryOrReceiveIdentifier")) {
        return (
          <TableCell className={style.tableCell} colSpan={2}>
            {t("Counterparty SSI.Headers.DeliveryOrReceive Agent")}
          </TableCell>
        );
      }
      return (
        <TableCell className={style.tableCell} colSpan={1}>
          {t("Counterparty SSI.Headers.DeliveryOrReceive Agent")}
        </TableCell>
      );
    }

    if (field === "deliveryOrReceiveIdentifier") {
      if (map.has("deliveryOrReceiveAgentIdType")) {
        return null;
      }
      return (
        <TableCell className={style.tableCell} colSpan={1}>
          {t("Counterparty SSI.Headers.DeliveryOrReceive Agent")}
        </TableCell>
      );
    }

    if (field === "sellerOrBuyerIdType") {
      if (map.has("sellerOrBuyerIdentifier")) {
        return (
          <TableCell className={style.tableCell} colSpan={2}>
            {t("Counterparty SSI.Headers.SellerOrBuyer")}
          </TableCell>
        );
      }

      return (
        <TableCell className={style.tableCell} colSpan={1}>
          {t("Counterparty SSI.Headers.SellerOrBuyer")}
        </TableCell>
      );
    }

    if (field === "sellerOrBuyerIdentifier") {
      if (map.has("sellerOrBuyerIdType")) {
        return null;
      }

      return (
        <TableCell className={style.tableCell} colSpan={1}>
          {t("Counterparty SSI.Headers.SellerOrBuyer")}
        </TableCell>
      );
    }

    return <TableCell />;
  });

  return (
    <>
      <TableHead>
        <TableRow>
          {content}
          <TableCell />
        </TableRow>
      </TableHead>
      <MTableHeader {...props} />
    </>
  );
};

export default CustomCounterpartyTableHeader;
