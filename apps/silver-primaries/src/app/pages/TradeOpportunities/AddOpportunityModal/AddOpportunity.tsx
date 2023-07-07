import React, { FC, useEffect } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { Button, FormikInput, MySelect, useToast,FormikInputCustom} from "@emrgo-frontend/shared-ui";
import { Grid } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";

import { HeadingCustom } from "../../../components/Form";
import { compareDates, convertDate, convertDateModify } from "../../../utils";
import { useCurrencyStore, useIssuerStore, useSellSideStore, useTradeOpportunitiesStore } from "../../store";
import { getIssuers } from "../ManageIssuers/Issuer.services";
import { doGetAllSellside, doGetCurrencies } from "../ManageSellside/Sellside.service";
import { postOpportunity, updateOpportunity } from "../TradeOpportunities.service";
import * as Styles from "./AddOpportunity.styles";
import { IAddOpportunityProps, IOpportunityPayload } from "./AddOpportunity.types";
import { OpportunitySchema } from "./AppOpportunity.schema";


export const AddOpportunity: FC<IAddOpportunityProps> = () => {
  const { modifyData } = useTradeOpportunitiesStore();
  const { mutate: doPostOpportunity } = useMutation(postOpportunity);
  const { mutate: doUpdateOpportunity } = useMutation(updateOpportunity);
  const modalActions = useTradeOpportunitiesStore((state) => state.modalActions);
  const queryClient = useQueryClient();
  const { showErrorToast } = useToast();

  const { sellSideActions, sellSideData } = useSellSideStore();
  const { issuerAction, issuerData } = useIssuerStore();
  const { currencyAction, currencyData, csdData } = useCurrencyStore();
  useQuery({
    queryFn: () => doGetCurrencies("currency"),
    refetchOnMount: true,
    placeholderData: currencyData,
    refetchOnWindowFocus: true,
    queryKey: [queryKeys.primaries.tradeOpportunities.dropdown.currency],
    onSuccess: (curData) => {
      currencyAction.setCurrency(curData);
    }
  });
  useQuery({
    queryFn: () => doGetCurrencies("CSDOptions"),
    refetchOnMount: true,
    placeholderData: csdData,
    refetchOnWindowFocus: true,
    queryKey: [queryKeys.primaries.tradeOpportunities.dropdown.csd],
    onSuccess: (curData) => {
      currencyAction.setCDS(curData);
    }
  });

  useQuery({
    queryFn: doGetAllSellside,
    queryKey: [queryKeys.primaries.tradeOpportunities.sellSide.fetch],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {

      sellSideActions.setSellSite(data);
    }
  });
  useQuery({
    queryFn: getIssuers,
    placeholderData: issuerData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryKey: [queryKeys.primaries.tradeOpportunities.issuers.fetch],
    onSuccess: (data) => {
      issuerAction.setIsssuer(data);
    }
  });

  useEffect(() => {
    console.log(modifyData);
  }, []);
  return (
    <Styles.AddOpportunity>
      <Styles.Wrapper>
        <Formik
          enableReinitialize={!!modifyData}

          // In case if modify mode is selected populate values automatically
          initialValues={{
            statusId: modifyData?.statusId ?? null,
            sellSide: modifyData ? sellSideData.find(elem => elem.id === modifyData.sellSideOrganisation) : null,
            issuer: modifyData ? issuerData.find(elem => elem.id === modifyData.issuerId) : null,
            issuerJurisdiction: modifyData ? issuerData.find(elem => elem.id === modifyData.issuerId)?.jurisdiction ?? null : null,
            industry: modifyData ? issuerData.find(elem => elem.id === modifyData.issuerId)?.description ?? null : null,
            currencyDropDownData: modifyData ? currencyData.find(elem => elem.id === modifyData.currencyId) ?? null : null,
            productType: modifyData?.productType || "Sukuk",
            productDetails: modifyData?.productDetails || "Sukuk",
            name: modifyData?.name ?? "John Doe",
            isin: modifyData?.isin ?? `MX ${Math.floor(Math.random() * 90000) + 10000}`,
            csd: modifyData ? csdData.find(elem => elem.id === modifyData.csd) ?? null : null,
            tenor: modifyData?.tenor ?? 100000,
            return: modifyData?.return ?? 10,
            amount: modifyData?.amount ?? 10000,
            issueDate: convertDateModify(modifyData?.issueDate),
            preOfferPeriodEnd: convertDateModify(modifyData?.preOfferPeriodEnd),
            offerPeriodEnd: convertDateModify(modifyData?.offerPeriodEnd),
            redemptionDate: convertDateModify(modifyData?.redemptionDate),
            ideaEnd: convertDateModify(modifyData?.ideaEnd),
            openEnd: convertDateModify(modifyData?.openEnd)
          }}
          validationSchema={OpportunitySchema}
          onSubmit={(values, formikHelpers) => {
            const payload: IOpportunityPayload = {
              sellSideOrganisation: values.sellSide?.id ?? modifyData?.sellSideOrganisation ?? "",
              name: values.name,
              issuerId: values.issuer?.id ?? modifyData?.issuerId ?? "",
              productType: values.productType,
              productDetails: values.productDetails,
              tenor: values.tenor,
              currencyId: values.currencyDropDownData?.id ?? "", //To replace
              amount: values.amount,
              return: values.return,
              isin: values.isin,
              typeId: modifyData?.typeId || "a10d78fc-6ba7-487f-91cc-a12d31978ad3", //To by default it set to SUKUK
              custody: modifyData?.custody || uuidv4(), //To replace
              csd: values.csd?.id || uuidv4(), //To replace
              industryId: "73074f76-bc7f-44e2-83f2-f84ad3ae2c8e", //To replace, default IDEA
              offerPeriodEnd: convertDate(values.offerPeriodEnd),
              preOfferPeriodEnd: convertDate(values.preOfferPeriodEnd),
              redemptionDate: convertDate(values.redemptionDate),
              issueDate: convertDate(values.issueDate),
              ideaEnd: convertDate(values.ideaEnd),
              openEnd: convertDate(values.openEnd)
            };
            if (!modifyData) {
              doPostOpportunity(payload, {
                onSuccess: () => {
                  modalActions.setModalOpen(false);
                  queryClient
                    .invalidateQueries([queryKeys.primaries.tradeOpportunities.fetch])
                    .then((r) => {
                    });
                },
                onError: () => {
                  showErrorToast("Error posting new Opportunity");
                }
              });
            } else {
              doUpdateOpportunity(
                { id: modifyData?.id ?? "", ...payload },
                {
                  onSuccess: () => {
                    modalActions.setModalOpen(false);
                    queryClient
                      .invalidateQueries([queryKeys.primaries.tradeOpportunities.fetch])
                      .then((r) => {
                      });
                  },
                  onError: () => {
                    showErrorToast("Error updating new Opportunity");
                  }
                }
              );
            }
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
                          await setFieldValue("industry", selected.industry  ? selected.industry : "N/A");
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
    </Styles.AddOpportunity>
  );
};
