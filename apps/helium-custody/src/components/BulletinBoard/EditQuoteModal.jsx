import React from "react";
import { useTranslation } from "react-i18next";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import cx from "classnames";
// import { useDispatch, useSelector } from 'react-redux';
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

// import ReactSelectCurrencyOption from '../ReactSelectCurrencyOption';

// import * as authSelectors from '../../redux/selectors/auth';
// import * as billingAndPaymentsActionCreators from '../../redux/actionCreators/billingAndPayments';
// import * as accountsActionCreators from '../../redux/actionCreators/accounts';
// import * as billingAndPaymentsSelectors from '../../redux/selectors/billingAndPayments';
// import * as accountsSelectors from '../../redux/selectors/accounts';
// doFetchPaymentAccounts
// import useWethaqAPIParams from '../../hooks/useWethaqAPIParams';

// import { addAccountSchema } from '../../validationSchemas';

import style from "./style.module.scss";

const AddQuoteModal = ({ isModalOpen, setIsModalOpen, handleEditQuote, quote }) => {
  const [expanded, setExpanded] = React.useState("panel1");
  const { t } = useTranslation(["bulletin_board", "components"]);
  // const dispatch = useDispatch();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Formik
      initialValues={{
        quoteId: quote?.id,
        offerPrice: Number(quote?.bidPrice || 0),
        offerQuantity: Number(quote?.bidSize || 0),
        bidPrice: Number(quote?.askPrice || 0),
        bidQuantity: Number(quote?.askSize || 0),
      }}
      enableReinitialize
      validateOnMount={false}
      onSubmit={(values, { resetForm }) => {
        const requestPayload = {
          quoteId: values?.quoteId,
          askSize: values?.bidQuantity,
          askPrice: values?.bidPrice,
          bidSize: values?.offerQuantity,
          bidPrice: values?.offerPrice,
        };
        handleEditQuote(requestPayload);
        setTimeout(() => {
          handleClose();
          resetForm();
        }, 1000);
      }}
    >
      {({ handleSubmit, values, resetForm }) => (
        <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
          <Dialog
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="send-onboarding-invitation"
            maxWidth="md"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">
              {t("bulletin_board:Modals.Edit Quote Modal.Edit Quote")}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Box my={3} className="full-width">
                  <Grid container spacing={3}>
                    <Grid item xs={12} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Edit Quote Modal.Security")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">{quote?.security}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Edit Quote Modal.Currency")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">{quote?.currency}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Edit Quote Modal.WSN")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">{quote?.wsn}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Edit Quote Modal.Maturity")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          {quote?.maturityDate
                            ? moment(quote?.maturityDate).format("DD-MMM-YY")
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Edit Quote Modal.ISIN")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right"></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <Box my={1} className="full-width">
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                    elevation={0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography>
                        {" "}
                        {t(
                          "bulletin_board:Modals.Edit Quote Modal.Edit Optional Pricing Information"
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box className={style.indication__offer}>
                            <Typography variant="h6">
                              {t("bulletin_board:Modals.Edit Quote Modal.Indicative Offer")}
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Edit Quote Modal.Price")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Edit Quote Modal.Price")}
                                name="offerPrice"
                                variant="filled"
                                type="number"
                                min="0"
                                // eslint-disable-next-line  react/jsx-no-duplicate-props
                                inputProps={{
                                  min: 0,
                                }}
                              />
                            </Grid>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Edit Quote Modal.Quantity(M)")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Edit Quote Modal.Quantity(M)")}
                                name="offerQuantity"
                                variant="filled"
                                type="number"
                                min="0"
                                // eslint-disable-next-line  react/jsx-no-duplicate-props
                                inputProps={{
                                  min: 0,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Box className={style.indication__bid}>
                            <Typography variant="h6">
                              {t("bulletin_board:Modals.Edit Quote Modal.Indicative Bid")}
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Edit Quote Modal.Price")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Edit Quote Modal.Price")}
                                name="bidPrice"
                                variant="filled"
                                type="number"
                                min="0"
                                // eslint-disable-next-line  react/jsx-no-duplicate-props
                                inputProps={{
                                  min: 0,
                                }}
                              />
                            </Grid>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Edit Quote Modal.Quantity(M)")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Edit Quote Modal.Quantity(M)")}
                                name="bidQuantity"
                                variant="filled"
                                type="number"
                                min="0"
                                // eslint-disable-next-line  react/jsx-no-duplicate-props
                                inputProps={{
                                  min: 0,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                  resetForm();
                }}
                color="primary"
              >
                {t("bulletin_board:Modals.Edit Quote Modal.Cancel")}
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={values.issuance === null}
                color="primary"
              >
                {t("bulletin_board:Modals.Edit Quote Modal.Update")}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

AddQuoteModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddQuoteModal;
