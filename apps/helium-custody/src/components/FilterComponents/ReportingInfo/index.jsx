import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";

import formatAddress from "../../../utils/reports";

const PREFIX = "ReportingInfo";

const classes = {
  accountInfoLabel: `${PREFIX}-accountInfoLabel`,
  accountInfoValue: `${PREFIX}-accountInfoValue`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(() => ({
  [`& .${classes.accountInfoLabel}`]: {
    fontWeight: 700,
    marginLeft: "1rem",
  },

  [`& .${classes.accountInfoValue}`]: {
    marginLeft: "0.5rem",
  },
}));

const ReportingInfo = ({ cashAccount, securityAccount }) => {
  const { t } = useTranslation(["reports"]);

  return (
    <Root>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>
          {t("Cash Balances.Account")} :{" "}
        </Typography>
        <Typography className={classes.accountInfoValue}>{`${
          cashAccount ? cashAccount.data.original.accountNo : t("Cash Balances.NA")
        } | ${
          cashAccount ? capitalCase(cashAccount.data.original.type) : t("Cash Balances.NA")
        }`}</Typography>
      </Grid>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>
          {t("Cash Balances.Address")} :{" "}
        </Typography>
        {/* TODO: Need to uncomment when address data is available */}
        {/* <Typography className={classes.accountInfoValue}>{`${
          securityAccount?.data?.original?.group?.addresses
            ? null
            : t("Cash Balances.NA")
        }`}</Typography> */}
      </Grid>
    </Root>
  );
};

export default ReportingInfo;
