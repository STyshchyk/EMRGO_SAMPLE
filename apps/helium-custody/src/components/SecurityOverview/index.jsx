import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { currencyRenderer } from "../../constants/renderers";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";

const Row = ({ label, value }) => (
  <Fragment>
    <Grid item md={6}>
      <Typography variant="subtitle1">{label}</Typography>
    </Grid>
    <Grid item md={6}>
      <Typography variant="subtitle1">{value}</Typography>
    </Grid>
  </Fragment>
);

const transformSecurityInfo = (securityInfoData) => {
  if (!securityInfoData) return {};

  const {
    currencyName,
    frequencyName,
    isin,
    frequency,
    currency,
    profitRate,
    wsn,
    issuanceAmount,
    issuanceName,
    maturityDate,
    shortName,
  } = securityInfoData;

  const fallbackStringValue = "--";

  return {
    issuanceName: {
      label: "Name",
      value: issuanceName ?? fallbackStringValue,
    },
    securityShortName: {
      label: "Security Short Name",
      value: shortName ?? fallbackStringValue,
    },
    totalIssuanceAmount: {
      label: "Total Issuance Amount",
      value: currencyRenderer(issuanceAmount, 6) ?? fallbackStringValue,
    },
    profitRate: {
      label: "Profit Rate",
      value: `${currencyRenderer(profitRate, 6)}%` ?? fallbackStringValue,
    },
    frequencyName: {
      label: "Frequency",
      value: (frequencyName?.name || frequency?.name) ?? fallbackStringValue,
    },
    currencyName: {
      label: "Currency",
      value: (currencyName?.name || currency?.name) ?? fallbackStringValue,
    },
    wsn: {
      label: "WSN",
      value: wsn ?? fallbackStringValue,
    },
    isin: {
      label: "ISIN",
      value: isin ?? fallbackStringValue,
    },
    maturityDate: {
      label: "Maturity Date",
      value: dateFormatter(maturityDate, DEFAULT_DATE_FORMAT),
    },
  };
};

const SecurityOverview = ({ data }) => {
  const transformedSecurityInfo = transformSecurityInfo(data);
  const { t } = useTranslation(["reports", ""]);

  return (
    <Fragment>
      <Grid container>
        {Object.entries(transformedSecurityInfo).map(([key, { label, value }]) => (
          <Row key={key} label={t(`Coupon Payment Schedule.${label}`)} value={value} />
        ))}
      </Grid>
    </Fragment>
  );
};

export default SecurityOverview;
