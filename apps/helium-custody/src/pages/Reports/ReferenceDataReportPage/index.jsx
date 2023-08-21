  import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// import EditCouponPaymentScheduleDialog from "../../../components/EditCouponPaymentScheduleDialog";
import PageTitle from "../../../components/PageTitle";
// import RouteLeavingGuard from "../../../components/RouteLeavingGuard";
import ViewCouponPaymentScheduleDialog from "../../../components/ViewCouponPaymentScheduleDialog";
import { currencyRenderer, reportDateRenderer } from "../../../constants/renderers";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as externalSecuritiesActionCreators from "../../../redux/actionCreators/externalSecurities";
import * as authSelectors from "../../../redux/selectors/auth";
import * as externalSecuritiesSelectors from "../../../redux/selectors/externalSecurities";
import convertNumberToIntlFormat from "../../../utils/convertNumberToIntlFormat";
import ReportingDisclaimer from "../ReportingDisclaimer";
import style from "./style.module.scss";

const animatedComponents = makeAnimated();

const customSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 100,
  }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
};

// ! Dev notes: This page has been updated to list external securities (including primary ones that have been admitted).
// ! External securities are internally referred to as master securities.

const SecurityReportView = ({ data }) => (
  <Fragment>
    {data.map((item) => (
      <Fragment key={item.label}>
        <Grid item xs={6} className={style.filter}>
          <Typography>{item.label}</Typography>
        </Grid>
        <Grid item xs={6} className={style.filter}>
          <Typography>{item.value}</Typography>
        </Grid>
      </Fragment>
    ))}
  </Fragment>
);

const ReferenceDataReportPage = () => {
  const { t } = useTranslation(["reports", "termsheet"]);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentlySelectedSecurity, setCurrentlySelectedSecurity] = useState(null);
  const [currentlySelectedISIN, setCurrentlySelectedISIN] = useState(null);
  const [openViewCouponScheduleDialog, setOpenViewCouponScheduleDialog] = useState(false);

  // selectors
  const allExternalSecurities = useSelector(
    externalSecuritiesSelectors.selectAllExternalSecurities
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const currentEntityGroupID = currentEntityGroup?.id;
  const externalSecurityOptionsList = allExternalSecurities.map((item) => {
    const { id, isin, name } = item;
    return {
      label: name,
      value: id,
      meta: {
        id,
        name,
        isin,
      },
    };
  });
  const externalISINOptionsList = allExternalSecurities.map((item) => {
    const { id, isin, name } = item;
    return {
      label: isin,
      value: id,
      meta: {
        id,
        name,
        isin,
      },
    };
  });
  const isWethaqAdmin = currentEntityGroup?.entityType === "EMRGO_SERVICES";
  const selectedExternalSecurity = allExternalSecurities.find(
    ({ id }) => id === currentlySelectedSecurity?.value
  );

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchExternalSecurities = () =>
      dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());

    fetchExternalSecurities();
  }, [dispatch]);

  const setSecurity = (selectedValue) => {
    setCurrentlySelectedSecurity({ label: selectedValue.name, value: selectedValue.id });
    setCurrentlySelectedISIN({ label: selectedValue.isin, value: selectedValue.id });
  };

  const clearSecurity = () => {
    setCurrentlySelectedSecurity(null);
    setCurrentlySelectedISIN(null);
  };

  // TODO: TRANSLATE THE LABELS
  const filters = [
    {
      label: t("Security Type"),
      value:
        selectedExternalSecurity &&
        (selectedExternalSecurity?.isPrimaryIssuance ? "Primary Issuance" : "External Security"),
    },
    {
      label: t("Status"),
      value: selectedExternalSecurity?.status,
    },
    {
      label: t("Denomination"),
      value: selectedExternalSecurity?.denominationName?.name,
    },
    {
      label: t("Profit Rate"),
      value:
        selectedExternalSecurity &&
        convertNumberToIntlFormat(selectedExternalSecurity?.profitRate, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      label: t("Frequency"),
      value: selectedExternalSecurity?.frequencyName?.name,
    },
    {
      label: "ISIN",
      value: selectedExternalSecurity?.isin,
    },
    {
      label: t("Ticker"),
      value: selectedExternalSecurity?.ticker,
    },
    {
      label: t("Country of Risk"),
      value: selectedExternalSecurity?.countryOfRisk?.name,
    },
    {
      label: t("Issuance Name"),
      value: selectedExternalSecurity?.name,
    },
    {
      label: t("Security Long Name"),
      value: selectedExternalSecurity?.longName,
    },
    {
      label: t("Security Short Name"),
      value: selectedExternalSecurity?.securityShortName,
    },
    {
      label: t("Issuance Amount"),
      value:
        currentlySelectedSecurity && currencyRenderer(selectedExternalSecurity?.issuanceAmount),
    },
    {
      label: t("Currency"),
      value: selectedExternalSecurity?.currencyName?.name,
    },
    {
      label: t("Maturity Date"),
      value:
        currentlySelectedSecurity && reportDateRenderer(selectedExternalSecurity?.maturityDate),
    },
    {
      label: t("Issue Date"),
      value: currentlySelectedSecurity && reportDateRenderer(selectedExternalSecurity?.issueDate),
    },
  ];

  const primaryIssuancesFilter = [
    ...filters,

    {
      label: "WSN",
      value: selectedExternalSecurity?.wsn,
    },
    {
      label: t("Registrar"),
      value: selectedExternalSecurity?.csdName?.name,
    },

    {
      label: t("Exchange Code"),
      value: selectedExternalSecurity?.exchangeCode,
    },

    {
      label: t("Day Count Convention"),
      value: selectedExternalSecurity?.dayCountConventionName?.name,
    },
    {
      label: t("Distribution Method"),
      value: selectedExternalSecurity?.distributionMethodName?.name,
    },
    {
      label: t("Form of Offering"),
      value: selectedExternalSecurity?.formOfOfferingName?.name,
    },
    {
      label: t("Governing Law"),
      value: selectedExternalSecurity?.governingLawName?.name,
    },
    {
      label: t("Jurisdiction"),
      value: selectedExternalSecurity?.jurisdictionName?.name,
    },

    {
      label: t("Listing"),
      value: selectedExternalSecurity?.listingName?.name,
    },

    {
      label: t("Pricing"),
      value: selectedExternalSecurity?.pricingName?.name,
    },
    {
      label: t("Profit Rate"),
      value: currentlySelectedSecurity && currencyRenderer(selectedExternalSecurity?.profitRate),
    },
    {
      label: t("Profit Rate Terms"),
      value: selectedExternalSecurity?.profitRateTermsName?.name,
    },

    {
      label: t("Ranking"),
      value: selectedExternalSecurity?.rankingName?.name,
    },

    {
      label: t("Shariah Compliance"),
      value: selectedExternalSecurity?.shariahComplianceName?.name,
    },

    {
      label: t("Sukuk Type Name"),
      value: selectedExternalSecurity?.sukukTypeName?.name,
    },

    {
      label: t("Use of Proceeds"),
      value: selectedExternalSecurity?.useOfProceedsName?.name,
    },

    {
      label: t("Guarantor"),
      value: selectedExternalSecurity?.guarantor,
    },

    {
      label: t("Underlying Assets"),
      value: selectedExternalSecurity?.underlyingAssets,
    },
  ];

  const securityReportData = selectedExternalSecurity?.isPrimaryIssuance
    ? primaryIssuancesFilter
    : filters;

  return (
    <Fragment>
      <PageTitle title={t("Reference Data.Reference Data")} />
      {/* <RouteLeavingGuard
        when={selectedExternalSecurity?.name !== undefined}
        title={t("Leave Guard.Title")}
        message={t("Leave Guard.Message")}
        navigate={(path) => navigate(path)}
        shouldBlockNavigation={() => true}
      /> */}
      <Grid item container alignItems="center" justifyContent="space-between" md={12} spacing={2}>
        <Grid item lg={3} container>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" className="bold">
              {t("Reference Data.Filters.Security")}
            </Typography>
            <ButtonBase onClick={() => clearSecurity()}>
              <Typography variant="caption">{t("Filters.Clear")}</Typography>
            </ButtonBase>
          </Grid>
          <Box my={1} className="w-full" sx={{width: "100%"}}>
            <FormControl className={style.input__form_control}>
              <Select
                closeMenuOnSelect
                isSearchable
                placeholder={`${t("Reference Data.Filters.Security")}...`}
                components={{
                  ...animatedComponents,
                }}
                styles={customSelectStyles}
                value={currentlySelectedSecurity}
                options={externalSecurityOptionsList}
                onChange={(newValue) => {
                  setSecurity(newValue.meta);
                }}
              />
            </FormControl>
          </Box>
        </Grid>
        <Grid item lg={3} container>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" className="bold">
              {t("Reference Data.Filters.ISIN")}
            </Typography>
            <ButtonBase onClick={() => clearSecurity()}>
              <Typography variant="caption">{t("Filters.Clear")}</Typography>
            </ButtonBase>
          </Grid>
          <Box my={1} className="w-full" sx={{width: "100%"}}>
            <FormControl className={style.input__form_control}>
              <Select
                closeMenuOnSelect
                isSearchable
                placeholder={`${t("Reference Data.Filters.ISIN")}...`}
                components={{
                  ...animatedComponents,
                }}
                styles={customSelectStyles}
                value={currentlySelectedISIN}
                options={externalISINOptionsList}
                onChange={(newValue) => {
                  setSecurity(newValue.meta);
                }}
              />
            </FormControl>
          </Box>
        </Grid>

        <Grid item lg={6} container justifyContent="flex-end">
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item>
              <Typography variant="body1" className="white-text">
                .
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Box my={1} className="w-full">
              <Grid container spacing={2} alignItems="center">
                {isWethaqAdmin && (
                  <Grid item>
                    <Button
                      disabled
                      fullWidth
                      variant="contained"
                      color="secondary"
                      size="large"
                      // onClick={() => {}}
                    >
                      {t("Update Reference Data")}
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={!selectedExternalSecurity?.couponId}
                    onClick={() => {
                      setOpenViewCouponScheduleDialog(true);
                    }}
                  >
                    {t("View Coupon Schedule")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={8} lg={8} container>
          <SecurityReportView data={securityReportData} />
        </Grid>
      </Grid>

      {openViewCouponScheduleDialog && (
        <ViewCouponPaymentScheduleDialog
          couponId={selectedExternalSecurity?.couponId}
          securityData={selectedExternalSecurity}
          open={openViewCouponScheduleDialog}
          handleClose={() => {
            setOpenViewCouponScheduleDialog(false);
          }}
        />
      )}
      <ReportingDisclaimer />
    </Fragment>
  );
};

export default ReferenceDataReportPage;
