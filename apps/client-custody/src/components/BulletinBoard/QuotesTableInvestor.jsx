import React, { Fragment } from "react";
// import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";

import {
  currencyRenderer,
  floatRenderer,
  fontColorRenderer,
  quoteDateRenderer,
  tooltipRenderer,
} from "../../constants/paymentAndStatuses/renderers";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";

const QuotesTable = ({ data }) => {
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["bulletin_board"]);

  const headCells = [
    {
      title: t("bulletin_board:Headers.Broker ID"),
      field: "broker",
      width: 140,
    },
    {
      title: t("bulletin_board:Headers.Security"),
      field: "security",
      width: 100,
      render: (rowData) => tooltipRenderer(rowData.security, rowData.security),
    },
    {
      title: t("bulletin_board:Headers.Issuer"),
      field: "issuer",
      width: 150,
      render: (rowData) => tooltipRenderer(rowData.issuer, rowData.issuer),
    },
    {
      title: t("bulletin_board:Headers.WSN"),
      field: "wsn",
      width: 120,
      render: (rowData) => tooltipRenderer(rowData.wsn, rowData.wsn),
    },
    {
      title: t("bulletin_board:Headers.Bid Sz (M)"),
      field: "bidSize",
      width: 120,
      render: (rowData) => (rowData.bidSize !== "0.00" ? rowData.bidSize : ""),
    },
    {
      title: t("bulletin_board:Headers.Bid Yld"),
      field: "bidYield",
      render: (rowData) =>
        rowData.bidYield !== "0.00" ? fontColorRenderer(rowData.bidYield, "red") : "",
      width: 100,
    },
    {
      title: t("bulletin_board:Headers.Bid Px"),
      field: "bidPrice",
      render: (rowData) =>
        rowData.bidPrice !== "0.00"
          ? fontColorRenderer(floatRenderer(rowData.bidPrice), "red")
          : "",
      width: 100,
    },
    {
      title: t("bulletin_board:Headers.Ask Px"),
      field: "askPrice",
      render: (rowData) =>
        rowData.askPrice !== "0.00"
          ? fontColorRenderer(floatRenderer(rowData.askPrice), "green")
          : "",
      width: 120,
    },
    {
      title: t("bulletin_board:Headers.Ask Yld"),
      field: "askYield",
      render: (rowData) =>
        rowData.askYield !== "0.00"
          ? fontColorRenderer(floatRenderer(rowData.askYield), "green")
          : "",
      width: 120,
    },
    {
      title: t("bulletin_board:Headers.Ask Sz (M)"),
      field: "askSize",
      width: 120,
      render: (rowData) => (rowData.askSize !== "0.00" ? rowData.askSize : ""),
    },
    {
      title: t("bulletin_board:Headers.Issuance Amt (M)"),
      field: "outstandingAmount",
      render: (rowData) => currencyRenderer(rowData.outstandingAmount / 1000),
      width: 175,
    },
    {
      title: t("bulletin_board:Headers.DV01"),
      field: "dv01",
      width: 120,
      render: (rowData) => (rowData.dv01 !== "0.00" ? rowData.dv01 : ""),
    },
    {
      title: t("bulletin_board:Headers.Time"),
      field: "createdAt",
      render: (rowData) => quoteDateRenderer(rowData.createdAt),
      width: 120,
    },
    {
      title: t("bulletin_board:Headers.Notification"),
      field: "notification",
      width: 120,
      render: (rowData) => {
        let icon = "";
        if (rowData.notification) {
          icon = (
            <IconButton aria-label="turn off notifications" size="large">
              <NotificationsIcon color="secondary" />
            </IconButton>
          );
        } else {
          icon = (
            <IconButton aria-label="turn on notifications" size="large">
              <NotificationsNoneIcon color="secondary" />
            </IconButton>
          );
        }
        return icon;
      },
    },
  ];

  return (
    <Fragment>
      <MaterialTable
        size="small"
        title=""
        columns={headCells}
        data={data}
        options={{
          ...tableStyles,
          searchFieldVariant: "outlined",
          pageSize: 5,
          actionsColumnIndex: -1,
          tableLayout: "fixed",
        }}
        localization={mtableLocalization}
      />
    </Fragment>
  );
};

export default QuotesTable;
