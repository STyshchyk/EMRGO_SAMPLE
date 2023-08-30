import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import v from "voca";

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
          cashAccount ? cashAccount.data.original.accountNo : '-'
        } | ${
          cashAccount ? v.capitalize(cashAccount.data.original.type) : '-'
        }`}</Typography>
      </Grid>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>
          {t("Cash Balances.Address")} :{" "}
        </Typography>
        <Typography className={classes.accountInfoValue}>{`${
          securityAccount?.data?.original?.group?.addresses
            ? formatAddress(securityAccount?.data?.original?.group?.addresses)
            : '-'
        }`}</Typography>
      </Grid>
    </Root>
  );
};

export default ReportingInfo;
