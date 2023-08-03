import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@emrgo-frontend/shared-ui";

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
import FormControl from "@mui/material/FormControl";
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

import selectStyles from "../../styles/cssInJs/reactSelect";
import style from "./style.module.scss";

const AddQuoteModal = ({ isModalOpen, setIsModalOpen, handleAddQuote, issuances }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { t } = useTranslation(["bulletin_board", "components"]);
  // const dispatch = useDispatch();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const issuanceOptions = issuances?.map((issuance) => ({ value: issuance, label: issuance.name }));

  // const issuanceOriginal = issuances ? issuances[0] : {};
  // const issuanceTemp1 = { ...issuanceOriginal, name: 'Green Sukuk 2022', wsn: 'W0000546821' };
  // const issuanceTemp2 = { ...issuanceOriginal, name: 'Covid 19 Relief Fund', wsn: 'W0000123456' };
  // const customIssuances = [issuanceOriginal, issuanceTemp1, issuanceTemp2];
  // const issuanceOptions = customIssuances.map((issuance) => ({ value: issuance, label: issuance.name }));

  const customIssuanceFilter = (candidate, input) => {
    const loweredInput = input.toLowerCase();
    const searchableString = `${candidate?.value?.name} ${candidate?.value?.wsn}`.toLowerCase();
    return searchableString.includes(loweredInput);
  };

  return (
    <Formik
      initialValues={{
        issuance: null,
        offerPrice: 0,
        offerQuantity: 0,
        bidPrice: 0,
        bidQuantity: 0,
      }}
      validateOnMount={false}
      onSubmit={(values, { resetForm }) => {
        const requestPayload = {
          sukukId: values?.issuance?.value?.id,
          askSize: values?.bidQuantity,
          askPrice: values?.bidPrice,
          bidSize: values?.offerQuantity,
          bidPrice: values?.offerPrice,
        };
        handleAddQuote(requestPayload);
        setTimeout(() => {
          handleClose();
          resetForm();
        }, 1000);
      }}
    >
      {({ handleSubmit, values, resetForm, setFieldValue }) => (
        <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
          <Dialog
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="send-onboarding-invitation"
            maxWidth="md"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">
              {t("bulletin_board:Modals.Add Quote Modal.Add Quote")}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Fragment>
                  <Box my={1} className="full-width">
                    <FormControl className={style.input__form_control}>
                      <FormControl className={style.input__form_control}>
                        <Select
                          closeMenuOnSelect
                          placeholder={t("bulletin_board:Modals.Add Quote Modal.Search Securities")}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.sourceEntity}
                          isClearable
                          options={issuanceOptions}
                          filterOption={customIssuanceFilter}
                          onChange={(selectedIssuance) => {
                            setFieldValue("issuance", selectedIssuance);
                          }}
                        />
                      </FormControl>
                    </FormControl>
                  </Box>
                </Fragment>

                <Box my={3} className="full-width">
                  <Grid container spacing={3}>
                    <Grid item xs={12} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Add Quote Modal.Security")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">{values?.issuance?.value?.name}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Add Quote Modal.Currency")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          {values?.issuance?.value?.currencyName?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Add Quote Modal.WSN")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">{values?.issuance?.value?.wsn}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Add Quote Modal.Maturity")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          {values?.issuance?.value?.maturityDate
                            ? moment(values?.issuance?.value?.maturityDate).format("DD-MMM-YY")
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} container>
                      <Grid item xs={6}>
                        <Typography className={style.bold} align="left">
                          {t("bulletin_board:Modals.Add Quote Modal.ISIN")}
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
                          "bulletin_board:Modals.Add Quote Modal.Add Optional Pricing Information"
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box className={style.indication__offer}>
                            <Typography variant="h6">
                              {t("bulletin_board:Modals.Add Quote Modal.Indicative Offer")}
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Add Quote Modal.Price")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Add Quote Modal.Price")}
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
                                {t("bulletin_board:Modals.Add Quote Modal.Quantity(M)")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Add Quote Modal.Quantity(M)")}
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
                              {t("bulletin_board:Modals.Add Quote Modal.Indicative Bid")}
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={4} container alignContent="center">
                              <Typography className={style.bold} align="left">
                                {t("bulletin_board:Modals.Add Quote Modal.Price")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Add Quote Modal.Price")}
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
                                {t("bulletin_board:Modals.Add Quote Modal.Quantity(M)")}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                fullWidth
                                component={TextField}
                                label={t("bulletin_board:Modals.Add Quote Modal.Quantity(M)")}
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
                {t("bulletin_board:Modals.Add Quote Modal.Cancel")}
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={values.issuance === null}
                color="primary"
              >
                {t("bulletin_board:Modals.Add Quote Modal.Publish")}
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
