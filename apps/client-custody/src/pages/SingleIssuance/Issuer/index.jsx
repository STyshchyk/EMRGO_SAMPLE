import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Select } from "@emrgo-frontend/shared-ui";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import cx from "classnames";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";

import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import { doFetchIssuers } from "../../../redux/actionCreators/issuance";
import { doSendEOIKit } from "../../../redux/actionCreators/kyc";
import { selectCurrentEntityGroup } from "../../../redux/selectors/auth";
import {
  selectIssuanceOverview,
  selectIssuers,
  selectProjectTeam,
} from "../../../redux/selectors/issuance";
import { inviteExistingIssuerSchema, inviteUserSchema } from "../../../validationSchemas";
import style from "./style.module.scss";

const Issuer = () => {
  const { t } = useTranslation(["issuer"]);
  const [isNewIssuer, setIsNewIssuer] = useState(true);
  const dispatch = useDispatch();
  const { issuanceID } = useParams();
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);
  const issuers = useSelector(selectIssuers);
  const issuerMember = useSelector(selectProjectTeam)("ISSUER");
  const issuanceOverview = useSelector(selectIssuanceOverview);
  const { hasIssuer } = issuanceOverview;

  const isserArray = issuers.map((value) => ({
    label: value.entity.corporateEntityName,
    value: value.id,
  }));

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    dispatch(doFetchIssuers());
  }, [dispatch]);

  const toggleExistingIssuerFlag = () => {
    setIsNewIssuer(!isNewIssuer);
  };

  const sendEOIKit = (values, resetForm) => {
    const payload = {
      body: { params: { currentGroupId: currentEntityGroup.id }, data: values },
      cb: resetForm,
    };
    dispatch(doSendEOIKit(payload));
  };

  return (
    <Box mx={2}>
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          {isNewIssuer ? (
            <Formik
              initialValues={{
                authorisedPersonFirstName: issuerMember ? issuerMember.firstName : "",
                authorisedPersonMiddleName: issuerMember ? issuerMember.middleName : "",
                authorisedPersonLastName: issuerMember ? issuerMember.lastName : "",
                entityType: { label: "Issuer", value: "ISSUER" },
                authorisedPersonEmail: "",
                authorisedPersonDisplayRole: "",
                entityName: issuerMember ? issuerMember.corporateEntityName : "",
              }}
              validateOnMount={false}
              validationSchema={inviteUserSchema}
              onSubmit={(values, { resetForm }) => {
                sendEOIKit(
                  { ...values, entityType: values.entityType.value, sukukId: issuanceID },
                  () => {
                    resetForm();
                  }
                );
              }}
            >
              {({ handleSubmit, values, setFieldValue }) => (
                <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
                  <Box my={3}>
                    <Typography>{t("issuer:Entity Details")}</Typography>
                    <Box my={1} className="full-width">
                      <FormControl className={style.input__form_control}>
                        <Select
                          closeMenuOnSelect
                          placeholder={t("issuer:Form.Entity Type")}
                          isDisabled={hasIssuer}
                          isSearchable
                          styles={{
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 10,
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (styles) => ({
                              ...styles,
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0, 0, 0, 0.09)",
                              height: "3rem",
                            }),
                          }}
                          menuPortalTarget={document.body}
                          value={values.entityType}
                          options={[{ label: "Issuer", value: "ISSUER" }]}
                          onChange={(entityType) => {
                            setFieldValue("entityType", entityType, false);
                          }}
                        />
                      </FormControl>
                    </Box>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        disabled={hasIssuer}
                        label={t("issuer:Form.Display Role")}
                        name="authorisedPersonDisplayRole"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        disabled={hasIssuer}
                        label={t("issuer:Form.Entity Name")}
                        name="entityName"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <Box my={3}>
                    <Typography>{t("issuer:Entity Representative")}</Typography>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        label={t("issuer:Form.First Name")}
                        disabled={hasIssuer}
                        name="authorisedPersonFirstName"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        label={t("issuer:Form.Middle Name")}
                        disabled={hasIssuer}
                        name="authorisedPersonMiddleName"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        label={t("issuer:Form.Last Name")}
                        disabled={hasIssuer}
                        name="authorisedPersonLastName"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                    <Box my={1} className="full-width">
                      <Field
                        component={TextField}
                        label={t("issuer:Form.Email ID")}
                        disabled={hasIssuer}
                        name="authorisedPersonEmail"
                        variant="filled"
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="primary"
                      disabled={hasIssuer}
                    >
                      {t("issuer:Form.Buttons.Invite Issuer")}
                    </Button>

                    <Button onClick={toggleExistingIssuerFlag} color="primary" disabled={hasIssuer}>
                      {t("issuer:Form.Buttons.Existing Issuer")}
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                issuerGroup: null,
                entityType: { label: "Issuer", value: "ISSUER" },
              }}
              validateOnMount={false}
              validationSchema={inviteExistingIssuerSchema}
              onSubmit={(values, { resetForm }) => {
                sendEOIKit(
                  {
                    entityType: values.entityType.value,
                    issuerGroupId: values.issuerGroup.value,
                    sukukId: issuanceID,
                  },
                  () => {
                    resetForm();
                  }
                );
              }}
            >
              {({ handleSubmit, values, setFieldValue }) => (
                <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
                  <Box my={3}>
                    <Typography>{t("issuer:Existing Issuer")}</Typography>
                    <Box my={1} className="full-width">
                      <FormControl className={style.input__form_control}>
                        <Select
                          closeMenuOnSelect
                          placeholder={t("issuer:Form.Issuer")}
                          isDisabled={hasIssuer}
                          isSearchable
                          styles={{
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 10,
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (styles) => ({
                              ...styles,
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0, 0, 0, 0.09)",
                              height: "3rem",
                            }),
                          }}
                          menuPortalTarget={document.body}
                          value={values.issuerGroup}
                          options={isserArray}
                          onChange={(issuerGroup) => {
                            setFieldValue("issuerGroup", issuerGroup, false);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="primary"
                      disabled={hasIssuer}
                    >
                      {t("issuer:Form.Buttons.Invite Issuer")}
                    </Button>

                    <Button onClick={toggleExistingIssuerFlag} color="primary" disabled={hasIssuer}>
                      {t("issuer:Form.Buttons.New Issuer")}
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Issuer;
