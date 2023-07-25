import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AddQuoteModal from "../../../components/BulletinBoard/AddQuoteModal";
import DeleteQuoteModal from "../../../components/BulletinBoard/DeleteQuoteModal";
import EditQuoteModal from "../../../components/BulletinBoard/EditQuoteModal";
import QuotesTableBroker from "../../../components/BulletinBoard/QuotesTableBroker";
import PageTitle from "../../../components/PageTitle";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as quotesActionCreators from "../../../redux/actionCreators/quotes";
import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";
import * as quotesSelectors from "../../../redux/selectors/quotes";

const QuoteBoardBroker = () => {
  const { t } = useTranslation(["bulletin_board"]);

  const dispatch = useDispatch();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const issuances = useSelector(issuanceSelectors.selectAllIssuancesData);
  const quotes = useSelector(quotesSelectors.selectQuotes);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchIssuances = (payload) =>
      dispatch(issuanceActionCreators.doFetchAllIssuances(payload));
    const readQuotes = (payload) => dispatch(quotesActionCreators.doReadQuoteRequest(payload));
    fetchIssuances();
    readQuotes();
  }, [dispatch, currentEntityGroupID]);

  const handleEditQuoteClick = (payload) => {
    setEditModalOpen(true);
    setSelectedQuote(payload);
  };

  const handleDeleteQuoteClick = (payload) => {
    setDeleteModalOpen(true);
    setSelectedQuote(payload);
  };

  const handleEditQuote = (payload) => {
    dispatch(quotesActionCreators.doUpdateQuoteRequest(payload));
  };

  const handleDeleteQuote = (payload) => {
    dispatch(quotesActionCreators.doDeleteQuoteRequest(payload));
  };

  const handleAddQuote = (payload) => {
    dispatch(quotesActionCreators.doCreateQuoteRequest(payload));
  };

  const actions = [
    {
      callback: handleEditQuoteClick,
      icon: <EditIcon fontSize="small" />,
      label: t("bulletin_board:Context Menu.Edit Quote"),
    },
    {
      callback: handleDeleteQuoteClick,
      icon: <DeleteIcon fontSize="small" />,
      label: t("bulletin_board:Context Menu.Delete Quote"),
    },
  ];

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
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setAddModalOpen(true);
              }}
            >
              {t("bulletin_board:Add Quote")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <AddQuoteModal
        isModalOpen={addModalOpen}
        options={{}}
        setIsModalOpen={setAddModalOpen}
        handleAddQuote={handleAddQuote}
        issuances={issuances}
      />
      <EditQuoteModal
        isModalOpen={editModalOpen}
        options={{}}
        setIsModalOpen={setEditModalOpen}
        handleEditQuote={handleEditQuote}
        quote={selectedQuote}
      />
      <DeleteQuoteModal
        isModalOpen={deleteModalOpen}
        options={{}}
        setIsModalOpen={setDeleteModalOpen}
        handleDeleteQuote={handleDeleteQuote}
        quote={selectedQuote}
      />
      <QuotesTableBroker
        data={rows}
        loading={false}
        actions={actions}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
      />
      <Box mt={5}>
        <Typography display="inline">Emrgo Disclaimer:</Typography>
        <Typography display="inline">
          {t(
            "bulletin_board:Disclaimer.You acting as broker are responsible for the services you offer to clients engaged through the Bulletin Board"
          )}
          .{" "}
        </Typography>
        <Typography display="inline">
          {t(
            "bulletin_board:Disclaimer.Your relationship with Emrgo is governed by the broker Onboarding Terms which you have accepted"
          )}
          .{" "}
        </Typography>
        <Typography display="inline">
          {t(
            "bulletin_board:Disclaimer.Upon confirming indications of interest frim clients, you undertake to execute trades outside Emrgo and generate on Emrgo Post Trade Instructions for Emrgo to process according to its custody rulebook"
          )}
        </Typography>
      </Box>
    </Fragment>
  );
};

export default QuoteBoardBroker;
