import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const PREFIX = "ReportingInfo";

const classes = {
  accountInfoLabel: `${PREFIX}-accountInfoLabel`,
  accountInfoValue: `${PREFIX}-accountInfoValue`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(() => ({
  [`& .${classes.accountInfoLabel}`]: {
    fontWeight: 700,
    marginTop: "1rem",
  },

  [`& .${classes.accountInfoValue}`]: {
    marginLeft: "0.5rem",
    marginTop: "1rem",
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
          cashAccount ? cashAccount.value.label : "-"
        }`}</Typography>
      </Grid>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>
          {t("Cash Balances.Safe Account")} :{" "}
        </Typography>
        <Typography className={classes.accountInfoValue}>{`${
          securityAccount ? securityAccount.value.label : "-"
        } `}</Typography>
      </Grid>
    </Root>
  );
};

export default ReportingInfo;
