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
import TextArea from "../../../../components/TextArea";
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
          "netAssetsOfEntity",
          "annualTurnover",
          "levelOfOwnFunds",
          "sourceOfFunds",
          "sourceOfVehicleCapital",
        ],
      })
    );
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: [],
          includeSignedUrl: true,
          sectionChanges: "wealth",
        },
      })
    );
  }, [entityId, dispatch]);

  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const fetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const fetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);

  const {
    netAssetsOfEntity = [],
    annualTurnover = [],
    levelOfOwnFunds = [],
    sourceOfFunds = [],
    sourceOfVehicleCapital = [],
  } = dropdowns;

  const isComplianceOfficer = entityType === "EMRGO_SERVICES";

  const processFormData = (formData) => {
    const updatedData = { ...formData };
    updatedData.personalInvestmentVehicle = updatedData.personalInvestmentVehicle === "true";
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

  const otherBuiltUp = sourceOfFunds.find((opt) => opt.name === "Other");
  const sourceOther = sourceOfVehicleCapital.find((opt) => opt.name === "Other");

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
            title={regionSwitcher({
              ae: t("kyc:Wealth.Entitys Wealth"),
              sa: t("kyc:Wealth.Entity/Individuals Wealth"),
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {regionSwitcher({
              ae: t("kyc:Wealth.HEADING_DESCRIPTION"),
              sa: t("kyc:Wealth.HEADING_DESCRIPTION_KSA"),
            })}
          </Typography>
        </Grid>
      </Grid>
      {kycData ? (
        <Formik
          initialValues={{
            netAssetsOfEntityId: kycData.netAssetsOfEntityId,
            annualTurnoverId: kycData.annualTurnoverId,
            levelOwnFundsId: kycData.levelOwnFundsId,
            sourceOfFundsId: kycData.sourceOfFundsId,
            personalInvestmentVehicle: getYesNoValue(kycData.personalInvestmentVehicle),
            vehicleCapitalSourceId: kycData.vehicleCapitalSourceId,
            vehicleCapitalSourceOther: kycData.vehicleCapitalSourceOther,
            sourceOfFundsOther: kycData.sourceOfFundsOther,
            otherEntityFinancialSituationInfo: kycData.otherEntityFinancialSituationInfo,
            changeRequests: kycData?.sectionChanges ? kycData?.sectionChanges.changesRequested : {},
          }}
          enableReinitialize
          validationSchema={kycSchema.entityWealthSchema}
          onSubmit={(values, { setSubmitting }) => {
            const saveData = processFormData(values);

            saveData.updateSection = {
              sectionKey: "wealth",
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
                      sectionChanges: "wealth",
                    },
                  })
                );
                // navigate(reverse(routes.dashboard.administration.kyc.entities.entity.edit.banking, { entityId }));
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
                {/* <UnsavedFormDataGuard dirty={dirty && !kycData?.sectionChanges?.isLocked} /> */}
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
                        ae: t("kyc:Wealth.Estimated global net assets of the Entity"),
                        sa: t("kyc:Wealth.Estimated global net assets of the Entity/Individuals"),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="netAssetsOfEntityId"
                          radioButtonGroupName="netAssetsOfEntityId"
                        >
                          {getOptions(netAssetsOfEntity, "netAssetsOfEntityId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="netAssetsOfEntityId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={t("kyc:Wealth.Annual turnover")}
                      fields={
                        <RadioButtonGroupV2
                          name="annualTurnoverId"
                          radioButtonGroupName="annualTurnoverId"
                        >
                          {getOptions(annualTurnover, "annualTurnoverId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="annualTurnoverId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={
                        <span>
                          {t("kyc:Wealth.Level of own Funds")}
                          <br />
                          {t("kyc:Wealth.share capital, investments, cash")}
                        </span>
                      }
                      fields={
                        <RadioButtonGroupV2
                          name="levelOwnFundsId"
                          radioButtonGroupName="levelOwnFundsId"
                        >
                          {getOptions(levelOfOwnFunds, "levelOwnFundsId")}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="levelOwnFundsId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={t("kyc:Wealth.How has this been built up")}
                      fields={
                        <RadioButtonGroupV2
                          name="sourceOfFundsId"
                          radioButtonGroupName="sourceOfFundsId"
                        >
                          {getOptions(sourceOfFunds, "sourceOfFundsId")}
                        </RadioButtonGroupV2>
                      }
                    />
                    {values.sourceOfFundsId === otherBuiltUp?.id ? (
                      <FormRow
                        noMargin
                        label=""
                        fields={<InputField name="sourceOfFundsOther" />}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="sourceOfFundsId"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={t("kyc:Wealth.Is the Entity a Personal Investment Vehicle")}
                      fields={
                        <RadioButtonGroupV2
                          name="personalInvestmentVehicle"
                          radioButtonGroupName="personalInvestmentVehicle"
                        >
                          {getOptions(
                            [
                              { id: "true", name: "Yes", value: true },
                              { id: "false", name: "No", value: false },
                            ],
                            "personalInvestmentVehicle"
                          )}
                        </RadioButtonGroupV2>
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="personalInvestmentVehicle"
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 2 }}>
                    <FormRow
                      label={regionSwitcher({
                        ae: t("kyc:Wealth.What is the source of the Vehicle's capital"),
                        sa: t("kyc:Wealth.What is the source of the capital"),
                      })}
                      fields={
                        <RadioButtonGroupV2
                          name="vehicleCapitalSourceId"
                          radioButtonGroupName="vehicleCapitalSourceId"
                        >
                          {getOptions(sourceOfVehicleCapital, "vehicleCapitalSourceId")}
                        </RadioButtonGroupV2>
                      }
                    />
                    {values.vehicleCapitalSourceId === sourceOther?.id ? (
                      <FormRow
                        noMargin
                        label=""
                        fields={<InputField name="vehicleCapitalSourceOther" />}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="vehicleCapitalSourceId"
                    />
                  </div>
                </div>
                {locale.altLocale === "ar-sa" ? (
                  ""
                ) : (
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 2 }}>
                      <FormRow
                        label={t(
                          "kyc:Wealth.Any other financial information on the Entity/Individuals financial situation"
                        )}
                        fields={
                          <TextArea
                            name="otherEntityFinancialSituationInfo"
                            rows={6}
                            label={null}
                          />
                        }
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="otherEntityFinancialSituationInfo"
                      />
                    </div>
                  </div>
                )}
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
