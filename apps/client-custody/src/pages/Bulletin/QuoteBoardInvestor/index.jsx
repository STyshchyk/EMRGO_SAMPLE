import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import QuotesTableInvestor from "../../../components/BulletinBoard/QuotesTableInvestor";
import PageTitle from "../../../components/PageTitle";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as quotesActionCreators from "../../../redux/actionCreators/quotes";
import * as authSelectors from "../../../redux/selectors/auth";
import * as quotesSelectors from "../../../redux/selectors/quotes";

const QuoteBoardInvestor = () => {
  const { t } = useTranslation(["bulletin_board"]);

  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState("");
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const quotes = useSelector(quotesSelectors.selectQuotes);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const readQuotes = (payload) => dispatch(quotesActionCreators.doReadQuoteRequest(payload));
    readQuotes();
  }, [dispatch, currentEntityGroupID]);

  const actions = [];

  const getTableData = (transfers) => {
    const entries = [];
    transfers.forEach((transfer) => {
      entries.push({
        broker: transfer.broker || "",
        security: transfer.sukuk.name || "",
        issuer: transfer.issuer || "",
        wsn: transfer.sukuk.wsn || "",
        bidSize: transfer.bidSize || "",
        bidYield: transfer.bidYield || "",
        bidPrice: transfer.bidPrice || "",
        askPrice: transfer.askPrice || "",
        askYield: transfer.askYield || "",
        askSize: transfer.askSize || "",
        outstandingAmount: transfer.sukuk.issuanceAmount || "",
        dv01: transfer?.dv01 || "",
        createdAt: transfer?.createdAt || "",
        notification: transfer?.notification || false,
        id: transfer.id,
        currency: transfer.sukuk.currencyName.name,
        maturityDate: transfer.sukuk.maturityDate,
      });
    });
    return entries;
  };

  const rows = getTableData(quotes);

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={10}>
          <PageTitle title={t("bulletin_board:Indicative Offers")} />
        </Grid>
        <Grid item xs={2} container justifyContent="flex-end">
          <Grid item container direction="column" justifyContent="center">
            <Button color="primary" variant="contained" disabled onClick={() => {}}>
              {t("bulletin_board:Message Broker")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <QuotesTableInvestor
        data={rows}
        loading={false}
        actions={actions}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
      />
    </Fragment>
  );
};

export default QuoteBoardInvestor;
