import React from 'react';
import { titleCase } from 'change-case';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import formatAddress from '../../../utils/reports';

const useStyles = makeStyles(() => ({
  accountInfoLabel: {
    fontWeight: 700,
    marginLeft: '1rem',
  },
  accountInfoValue: {
    marginLeft: '0.5rem',
  },
}));

const ReportingInfo = ({ cashAccount, securityAccount }) => {
  const { t } = useTranslation(['reports']);
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>{t('reports:Cash Balances.Account')} : </Typography>
        <Typography className={classes.accountInfoValue}>{`${cashAccount ? cashAccount.data.original.accountNo : t('reports:Cash Balances.NA')} | ${
          cashAccount ? titleCase(cashAccount.data.original.type) : t('reports:Cash Balances.NA')
        }`}</Typography>
      </Grid>
      <Grid item xs={12} container>
        <Typography className={classes.accountInfoLabel}>{t('reports:Cash Balances.Address')} : </Typography>
        <Typography className={classes.accountInfoValue}>{`${
          securityAccount?.data?.original?.group?.addresses ? formatAddress(securityAccount?.data?.original?.group?.addresses) : t('reports:Cash Balances.NA')
        }`}</Typography>
      </Grid>
    </>
  );
};

export default ReportingInfo;
