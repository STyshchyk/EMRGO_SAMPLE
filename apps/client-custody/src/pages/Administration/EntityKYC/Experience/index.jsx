import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import moment from "moment";

import ChangeRequest from "../../../../components/ChangeRequest";
import InputField from "../../../../components/InputField";
import LoadingPage from "../../../../components/LoadingPage";
import RadioButtonGroupV2 from "../../../../components/RadioButtonGroupV2";
import RadioButtonV2 from "../../../../components/RadioButtonV2";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import UnsavedFormDataGuard from "../../../../components/UnsavedFormDataGuard";
import { useTheme } from "../../../../context/theme-context";
import regionSwitcher from "../../../../helpers/regions";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import { kycSchema } from "../../../../validationSchemas";
import style from "./style.module.scss";

const FormRow = ({ label, fields, noMargin }) => (
  <div className={style.formRow} style={{ padding: noMargin ? 0 : "20px 0" }}>
    <div className={style.labelContainer}>
      <p className={style.formLabel}>{label}</p>
    </div>
    <div className={style.fieldContainer}>{fields}</div>
  </div>
);

const EntityWealth = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const { theme } = useTheme();
  const { entityId } = useParams();
  const { locale } = theme;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const entityType = currentEntityGroup?.entityType;
  const currentEntityGroupID = currentEntityGroup?.id;
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    dispatch(
      kycActionCreators.doFetchDropdowns({
        options: [
          "investedProducts",
          "debtInstrumentsLevel",
          "howLongActive",
          "howOftenInPrivateSecurities",
          "cashOutPeriod",
        ],
      })
    );
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: [],
          includeSignedUrl: true,
          sectionChanges: "experience",
        },
      })
    );
  }, [entityId, dispatch]);

  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const fetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const fetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);

  const {
    investedProducts = [],
    debtInstrumentsLevel = [],
    howLongActive = [],
    howOftenInPrivateSecurities = [],
    cashOutPeriod = [],
  } = dropdowns;

  const isComplianceOfficer = entityType === "EMRGO_SERVICES";

  const processFormData = (formData) => {
    const updatedData = { ...formData };
    updatedData.everBoughtPrivatelyPlacedSecurities =
      updatedData.everBoughtPrivatelyPlacedSecurities === "true";
    updatedData.consultFinancialAdvisor = updatedData.consultFinancialAdvisor === "true";
    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v != null)
    );
    return filteredData;
  };

  const getOptions = (rawOptions, name) => {
    const options = [];
    rawOptions.forEach((opt) => {
      const label = locale.altLocale === "ar-sa" ? opt.nameAr : opt.name;
      options.push(
        <RadioButtonV2
          disabled={false}
          key={opt.id}
          radioButtonGroupName={name}
          id={opt.id}
          label={label}
        />
      );
    });
    return options;
  };

  const investedProductOther = investedProducts.find((opt) => opt.name === "Other");

  if (fetchingKYCData || fetchingDropdownOptions) {
    return <LoadingPage />;
  }

  const getYesNoValue = (val) => {
    if (val === true) {
      return "true";
    }
    if (val === false) {
      return "false";
    }
    return null;
  };

  return (
    <Fragment>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle
            title={t(
              "kyc:Experience.Experience and Understanding of Financial Markets and Products"
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {regionSwitcher({
              ae: t("kyc:Experience.HEADING_DESCRIPTION"),
              sa: t("kyc:Experience.HEADING_DESCRIPTION_KSA"),
            })}
          </Typography>
        </Grid>
      </Grid>
      {kycData ? (
        <Formik
          initialValues={{
            investedProductsId: kycData.investedProductsId,
            investedProductsOther: kycData.investedProductsOther,
            everBoughtPrivatelyPlacedSecurities: getYesNoValue(
              kycData.everBoughtPrivatelyPlacedSecurities
            ),
            debtInstrumentsLevelId: kycData.debtInstrumentsLevelId,
            howLongActiveId: kycData.howLongActiveId,
            consultFinancialAdvisor: getYesNoValue(kycData.consultFinancialAdvisor),
            howOftenInPrivateSecuritiesId: kycData.howOftenInPrivateSecuritiesId,
            cashOutPeriodId: kycData.cashOutPeriodId,
            changeRequests: kycData?.sectionChanges ? kycData?.sectionChanges.changesRequested : {},
          }}
          enableReinitialize
          validationSchema={kycSchema.experienceSchema}
          onSubmit={(values, { setSubmitting }) => {
            const saveData = processFormData(values);

            saveData.updateSection = {
              sectionKey: "experience",
              changesRequested: saveData.changeRequests,
              isLocked: !isComplianceOfficer,
            };
            const payload = {
              entityId,
              requestPayload: saveData,
              successCallback: () => {
                setSubmitting(false);
                dispatch(
                  kycActionCreators.doFetchKYCData({
                    entityId,
                    requestPayload: {
                      keys: [],
                      includeSignedUrl: true,
                      sectionChanges: "experience",
                    },
                  })
                );
                // history.push(reverse(routes.dashboard.administration.kyc.entities.entity.edit.banking, { entityId }));
              },
            };
            dispatch(kycActionCreators.doPostKYCData(payload));
          }}
        >
          {({ handleSubmit, values, setFieldValue, dirty }) => {
            const saveForm = () => {
              const saveData = processFormData(values);
              const payload = {
                entityId,
                requestPayload: saveData,
                successCallback: () => {},
              };
              dispatch(kycActionCreators.doPostKYCData(payload));
            };

            return (
              <form onSubmit={handleSubmit} noValidate className="pb-16 py-8">
                <UnsavedFormDataGuard dirty={dirty && !kycData?.sectionChanges?.isLocked} />
                <Grid container className="pb-8">
                  <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12} md={6} lg={2}>
                        <Grid container direction="column">
                          {isComplianceOfficer ? (
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              onClick={() => {
                                saveForm();
                              }}
                              disabled={!dirty}
                            >
                              {t("Miscellaneous.Save Form")}
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              disabled={kycData?.sectionChanges?.isLocked || !dirty}
                              onClick={() => {
                                saveForm();
                              }}
                            >
                              {t("Miscellaneous.Save Form")}
                            </Button>
                          )}

                          <Typography variant="caption" align="center" className="text-gray-500">
                            {t("Miscellaneous.Last Saved", {
                              date: moment(kycData?.sectionChanges?.updatedAt).format(
                                "DD/MM/YYYY HH:MM"
                              ),
                            })}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.In which products has the Entity previously invested"
                        ),
                        sa: t(
                          "kyc:Experience.In which products has the Entity/Individuals previously invested"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="investedProductsId"
                          radioButtonGroupName="investedProductsId"
                        >
                          {getOptions(investedProducts, "investedProductsId")}
                        </RadioButtonGroupV2>
                      }
                    />
                    {values.investedProductsId === investedProductOther?.id ? (
                      <FormRow
                        noMargin
                        label=""
                        fields={<InputField name="investedProductsOther" />}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="investedProductsId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.Has the Entity ever bought, owned or sold privately placed securities"
                        ),
                        sa: t(
                          "kyc:Experience.Has the Entity/Individual ever bought, owned or sold privately placed securities"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="everBoughtPrivatelyPlacedSecurities"
                          radioButtonGroupName="everBoughtPrivatelyPlacedSecurities"
                        >
                          {getOptions(
                            [
                              { id: "true", name: "Yes", value: true },
                              { id: "false", name: "No", value: false },
                            ],
                            "everBoughtPrivatelyPlacedSecurities"
                          )}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="everBoughtPrivatelyPlacedSecurities"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.How well does the Entity understand Debt Instruments (Sukuk, Bonds)"
                        ),
                        sa: t(
                          "kyc:Experience.How well does the Entity/Individuals understand Debt Instruments (Sukuk, Bonds)"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="debtInstrumentsLevelId"
                          radioButtonGroupName="debtInstrumentsLevelId"
                        >
                          {getOptions(debtInstrumentsLevel, "debtInstrumentsLevelId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="debtInstrumentsLevelId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.For how long has the Entity been active on the financial markets/investing in financial products"
                        ),
                        sa: t(
                          "kyc:Experience.For how long has the Entity/Individuals been active on the financial markets/investing in financial products"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="howLongActiveId"
                          radioButtonGroupName="howLongActiveId"
                        >
                          {getOptions(howLongActive, "howLongActiveId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="howLongActiveId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.Does the Entity consult a financial Advisor or use and Investment Manager when making investments decisions"
                        ),
                        sa: t(
                          "kyc:Experience.Does the Entity/Individuals consult a financial Advisor or use and Investment Manager when making investments decisions"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="consultFinancialAdvisor"
                          radioButtonGroupName="consultFinancialAdvisor"
                        >
                          {getOptions(
                            [
                              { id: "true", name: "Yes", value: true },
                              { id: "false", name: "No", value: false },
                            ],
                            "consultFinancialAdvisor"
                          )}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="consultFinancialAdvisor"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.How often does the Entity invest in privately placed securities in a year"
                        ),
                        sa: t(
                          "kyc:Experience.How often does the Entity/Individuals invest in privately placed securities in a year"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="howOftenInPrivateSecuritiesId"
                          radioButtonGroupName="howOftenInPrivateSecuritiesId"
                        >
                          {getOptions(howOftenInPrivateSecurities, "howOftenInPrivateSecuritiesId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="howOftenInPrivateSecuritiesId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t(
                          "kyc:Experience.The period during which the Entity expects to cash out their invested money"
                        ),
                        sa: t(
                          "kyc:Experience.The period during which the Entity/Individuals expects to cash out their invested money"
                        ),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="cashOutPeriodId"
                          radioButtonGroupName="cashOutPeriodId"
                        >
                          {getOptions(cashOutPeriod, "cashOutPeriodId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="other"
                    />
                  </div>
                </div>
                <Grid item xs={12} lg={12} container justifyContent="flex-end" className="mt-8">
                  <Grid item xs={12} md={6} lg={2}>
                    <Grid container direction="column">
                      {isComplianceOfficer ? (
                        <Button variant="contained" type="submit" size="small" color="primary">
                          {t("Miscellaneous.Submit")}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          disabled={kycData?.sectionChanges?.isLocked}
                          type="submit"
                          size="small"
                          color="primary"
                        >
                          {t("Miscellaneous.Submit")}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Formik>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default EntityWealth;
