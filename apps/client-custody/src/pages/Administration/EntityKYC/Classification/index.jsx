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
import LoadingPage from "../../../../components/LoadingPage";
import OptionWithCallout from "../../../../components/OptionWithCallout";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import UnsavedFormDataGuard from "../../../../components/UnsavedFormDataGuard";
import { useTheme } from "../../../../context/theme-context";
import regionSwitcher from "../../../../helpers/regions";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";

const Classification = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const { theme } = useTheme();
  const { entityId } = useParams();
  const { locale } = theme;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const fetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const fetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);

  const entityType = currentEntityGroup?.entityType;
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    dispatch(kycActionCreators.doFetchDropdowns({ options: ["entityTypeClassification"] }));
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: ["entityType"],
          includeSignedUrl: true,
          sectionChanges: "classification",
        },
      })
    );
  }, [entityId, dispatch]);

  const { entityTypeClassification = [] } = dropdowns;
  const ENTITY_TYPE_OPTIONS = entityTypeClassification.map((obj) => {
    const metadata = obj?.metadata ?? "{}";
    const calloutText = JSON.parse(metadata)?.callout ?? "";

    return {
      id: obj.id,
      label: locale?.altLocale === "ar-sa" ? obj.nameAr : obj.name,
      calloutText,
    };
  });

  const isComplianceOfficer = entityType === "EMRGO_SERVICES";

  const processFormData = (formData) => formData;

  if (fetchingKYCData || fetchingDropdownOptions) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle
            title={regionSwitcher({
              sa: t("kyc:Classification.Entity/Individual Classification"),
              ae: t("kyc:Classification.Entity Classification"),
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {regionSwitcher({
              sa: t("kyc:Classification.HEADING_DESCRIPTION_KSA"),
              ae: t("kyc:Classification.HEADING_DESCRIPTION"),
            })}
          </Typography>
        </Grid>
      </Grid>
      {kycData ? (
        <Formik
          initialValues={{
            entityType: kycData.entityType || [],
            changeRequests: kycData?.sectionChanges ? kycData?.sectionChanges.changesRequested : {},
          }}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            const saveData = processFormData(values);

            saveData.updateSection = {
              sectionKey: "classification",
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
                      keys: ["entityType"],
                      includeSignedUrl: true,
                      sectionChanges: "classification",
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
                  <div style={{ flex: 1 }}>
                    {ENTITY_TYPE_OPTIONS.map((entry) => (
                      <OptionWithCallout
                        setFieldValue={setFieldValue}
                        entry={entry}
                        entityTypeValues={[...values.entityType]}
                      />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ChangeRequest
                      setFieldValue={setFieldValue}
                      changeRequests={values.changeRequests}
                      fieldKey="entityType"
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
      ) : null}
    </Fragment>
  );
};

export default Classification;
