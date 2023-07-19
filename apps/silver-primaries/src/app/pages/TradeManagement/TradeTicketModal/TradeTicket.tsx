import React, { FC, useEffect } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { doGetAllSellside, doGetCurrencies } from "@emrgo-frontend/services";
import { postOpportunity, updateOpportunity } from "@emrgo-frontend/services";
import { Button, FormikInput, FormikInputCustom, MySelect, useToast } from "@emrgo-frontend/shared-ui";
import { Grid } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";

import { HeadingCustom } from "../../../components/Form";
import { compareDates, convertDate, convertDateModify } from "../../../utils";
import { useCurrencyStore, useIssuerStore, useSellSideStore, useTradeOpportunitiesStore } from "../../store";
import { ITradeTicketProps } from "./TradeTicket.types";
import * as Styles from "./TradeTicket.styles";

export const TradeTicket: FC<ITradeTicketProps> = () => {
  const { modifyData } = useTradeOpportunitiesStore();
  const { mutate: doPostOpportunity } = useMutation(postOpportunity);
  const { mutate: doUpdateOpportunity } = useMutation(updateOpportunity);
  const modalActions = useTradeOpportunitiesStore((state) => state.modalActions);
  const queryClient = useQueryClient();
  const { showErrorToast } = useToast();


  return (
    <Styles.TradeTicket>
      <Styles.Wrapper>
        <Formik
          enableReinitialize={!!modifyData}

          // In case if modify mode is selected populate values automatically
          initialValues={{
          }}
          validationSchema={null}
          onSubmit={(values, formikHelpers) => {

            formikHelpers.setSubmitting(false);
          }}
        >
          {({ values, setFieldValue, errors, handleSubmit, isValid, initialErrors }) => (
            <form onSubmit={handleSubmit}>
              <Styles.Wrapper>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Styles.TwoCol style={{ marginTop: "20px" }}>
                      <label htmlFor="sellSide">Sellside</label>
                      <Field
                        name="sellSide"
                        id={"sellSide"}
                        options={sellSideData}
                        value={values.sellSide}
                        // isDisabled={modifyData}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option}
                        placeholder="Select sellside"
                        component={FormikInputCustom}
                        type={"select"}
                        onChange={(selected: any) => {
                          console.log(selected);
                          setFieldValue("sellSide", selected);
                        }}
                      />
                    </Styles.TwoCol>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6} style={{ marginTop: "50px" }}>
                    <HeadingCustom style={{ marginBottom: "20px" }}>
                      Opportunity Overview
                    </HeadingCustom>
                    <Styles.TwoCol>
                      <label htmlFor="name">Issuance Name</label>
                      <Field
                        id="name"
                        name="name"
                        as={"input"}
                        type={"text"}
                        label={"Enter Issuance Name"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="issuer">Issuer</label>
                      <Field
                        name="issuer"
                        id="issuer"
                        options={issuerData}
                        // isDisabled={modifyData}
                        value={values.issuer}
                        placeholder="Select issuer"
                        component={FormikInputCustom}
                        type={"select"}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option}
                        onChange={async (selected: any) => {
                          console.log(selected);
                          await setFieldValue("issuer", selected);
                          await setFieldValue("issuerJurisdiction", selected.jurisdiction);
                          await setFieldValue("industry", selected.industry ? selected.industry : "N/A");
                        }}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="issuerJurisdiction">Issuer Jurisdiction</label>
                      <Field
                        id="issuerJurisdiction"
                        name="issuerJurisdiction"
                        value={values.issuerJurisdiction ?? ""}
                        disabled={true}
                        label={"Issuer Jurisdiction"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="industry">Industry</label>
                      <Field
                        id="industry"
                        name="industry"
                        value={values.industry ?? ""}
                        as={"input"}
                        type={"text"}
                        disabled={true}
                        label={"Enter Industry"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="productType">Product Type</label>
                      <Field
                        id="productType"
                        name="productType"
                        as={"input"}
                        type={"text"}
                        label={"Product Type"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="productDetails">Product Details</label>
                      <Field
                        id="productDetails"
                        name="productDetails"
                        as={"input"}
                        type={"text"}
                        label={"Product Details"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="tenor">Tenor</label>
                      <Field
                        id="tenor"
                        name="tenor"
                        as={"input"}
                        type={"number"}
                        label={"Tenor"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="currencyDropDownData">Currency</label>
                      <Field
                        id="currencyDropDownData"
                        name="currencyDropDownData"
                        // isDisabled={modifyData}
                        as={"input"}
                        options={currencyData}
                        value={values.currencyDropDownData}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option}
                        onChange={(selected: any) => {
                          console.log(selected);
                          setFieldValue("currencyDropDownData", selected);
                        }}
                        type={"text"}
                        label={"Currency"}
                        component={MySelect}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="amount">Amount</label>
                      <Field
                        id="amount"
                        name="amount"
                        as={"input"}
                        type={"number"}
                        label={"Amount"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="return">Return</label>
                      <Field
                        id="return"
                        name="return"
                        as={"input"}
                        type={"number"}
                        label={"Return"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="csd">CSD</label>
                      <div>
                        <Field
                          id="csd"
                          name="csd"
                          // isDisabled={modifyData}
                          as={"input"}
                          options={csdData}
                          value={values.csd}
                          type={"select"}
                          getOptionLabel={(option: any) => option.name}
                          getOptionValue={(option: any) => option}
                          onChange={(selected: any) => {
                            console.log(selected);
                            setFieldValue("csd", selected);
                          }}

                          label={"CSD"}
                          component={FormikInputCustom}
                        />
                      </div>
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="isin">ISIN</label>
                      <Field
                        id="isin"
                        name="isin"
                        as={"input"}
                        type={"text"}
                        label={"ISIN"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="custody">Custody</label>
                      <Field
                        id="custody"
                        name="custody"
                        options={[]}
                        // isDisabled={modifyData}

                        onChange={(selected: any) => {
                          setFieldValue("custody", selected);
                        }}
                        label={"Custody"}
                        menuPlacement={"top"}
                        component={MySelect}
                      />
                    </Styles.TwoCol>
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: "50px" }}>
                    <HeadingCustom style={{ marginBottom: "20px" }}>Lifecycle</HeadingCustom>
                    <Styles.TwoCol>
                      <label htmlFor="preOfferPeriodEnd">Pre-Offer Period Ends</label>
                      <Field
                        id="preOfferPeriodEnd"
                        name="preOfferPeriodEnd"
                        placeholder="Enter Pre-Offer Period"
                        as={"email"}
                        type={"date"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("preOfferPeriodEnd", compareDates(event.target.value));
                        }}
                        label={"Enter Pre-Offer Period"}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="offerPeriodEnd">Offer Period Ends</label>
                      <Field
                        id="offerPeriodEnd"
                        name="offerPeriodEnd"
                        placeholder="Enter Offer Period Ends"
                        as={"input"}
                        type={"date"}
                        label={"Enter email ID"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("offerPeriodEnd", compareDates(event.target.value));
                        }}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="issueDate">Issue Date</label>
                      <Field
                        id="issueDate"
                        name="issueDate"
                        placeholder="Enter Issue Date"
                        as={"input"}
                        type={"date"}
                        label={"Enter Issue Date"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("issueDate", compareDates(event.target.value));
                        }}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="redemptionDate">Redemption Date</label>
                      <Field
                        id="redemptionDate"
                        name="redemptionDate"
                        placeholder="Enter Redemption Date"
                        as={"input"}
                        type={"date"}
                        label={"Enter Redemption Date"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("redemptionDate", compareDates(event.target.value));
                        }}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>

                    <HeadingCustom style={{ marginBottom: "20px", marginTop: "50px" }}>Stages</HeadingCustom>
                    <Styles.TwoCol>
                      <label htmlFor="ideaEnd">Idea period end</label>
                      <Field
                        id="ideaEnd"
                        name="ideaEnd"
                        placeholder="Enter Idea end period"
                        as={"input"}
                        type={"date"}
                        label={"Enter Idea end period"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("ideaEnd", event.target.value);
                        }}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                    <Styles.TwoCol>
                      <label htmlFor="openEnd">Open period end</label>
                      <Field
                        id="openEnd"
                        name="openEnd"
                        placeholder="Enter Open period end"
                        as={"input"}
                        type={"date"}
                        label={"Enter Redemption Date"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("openEnd", event.target.value);
                        }}
                        component={FormikInput}
                      />
                    </Styles.TwoCol>
                  </Grid>

                </Grid>
              </Styles.Wrapper>
              <Styles.TwoCol>
                {/*TODO: FIX BUTTON*/}
                <Button type="submit">
                  Submit
                </Button>
              </Styles.TwoCol>
            </form>
          )}
        </Formik>
      </Styles.Wrapper>
    </Styles.TradeTicket>
  );
};
