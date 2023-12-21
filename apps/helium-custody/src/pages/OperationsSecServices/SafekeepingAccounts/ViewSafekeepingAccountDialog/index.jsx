import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import MaterialTableCustomDropdownRenderer from "apps/helium-custody/src/components/MaterialTableCustomDropdownRenderer";
import PropTypes from "prop-types";

import { getDropdownValues } from "../../../../utils/form";

const InlineLabel = ({ label, value }) => {
  return (
    <Grid item container md={12}>
      <Grid item md={5} xs={12} container direction="column" justifyContent="center">
        <Typography>{label}</Typography>
      </Grid>
      <Grid item md={7} xs={12}>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </Grid>
  );
};

const ViewSafekeepingAccountDialog = ({
  open,
  handleClose,
  account,
  entities,
  currencies,
  statuses,
}) => {
  const { t } = useTranslation(["safekeeping_accounts", "miscellaneous"]);

  const entityList = entities.map((entity) => {
    return {
      id: entity?.id,
      label: entity?.corporateEntityName,
      value: entity?.id,
      original: entity,
    };
  });

  const foundEntity = entityList.find((entity) => entity.id === account.entity.id);

  const currencyList = getDropdownValues(currencies);

  const foundCurrency = currencyList.find((currency) => currency.value === account.baseCurrencyId);

  const statusList = statuses.map((status) => {
    return {
      id: status,
      label: status,
      value: status,
    };
  });

  const foundStatus = statusList.find((currency) => currency.value === account.status);

  const initialValues = {
    entity: foundEntity,
    baseCurrency: foundCurrency,
    id: account.id,
    accountNo: account.securitiesAccount.accountNumber,
    name: account.name || "",
    status: foundStatus,
    currencies: account.wethaqAccounts.map((account) => {
      return {
        account: account.accountNo,
        currency: account.currencyId,
      };
    }),
  };

  const currencyListForMaterialTable = {};
  currencies.forEach((currency) => {
    currencyListForMaterialTable[currency.id] = currency.name;
  });

  const columns = [
    {
      title: "Currency",
      field: "currency",
      lookup: currencyListForMaterialTable,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Account Identifier",
      field: "account",
      editable: "never",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // if (reason && reason === "backdropClick") return;
        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="add-payment-account-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <Typography variant="h6">{t("Modal.View Safekeeping Account")}</Typography>
          </Grid>

          <IconButton aria-label="close" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <Grid container spacing={2}>
            <Grid item container spacing={2}>
              <InlineLabel label={t("Modal.Entity")} value={initialValues?.entity?.label} />

              <InlineLabel label={t("Modal.Portfolio Identifier")} value={initialValues?.name} />

              <InlineLabel
                label={t("Modal.Safekeeping Account")}
                value={initialValues?.accountNo}
              />

              <InlineLabel
                label={t("Modal.Base Currency")}
                value={initialValues?.baseCurrency?.label}
              />

              <InlineLabel label={t("Modal.Status")} value={initialValues?.status.label} />
            </Grid>
            <Grid item xs>
              <MaterialTable
                title="Associated Currencies"
                columns={columns}
                data={initialValues?.currencies}
                components={{
                  Container: (props) => <Paper {...props} elevation={0} />,
                }}
                options={{
                  search: false,
                  actionsColumnIndex: -1,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {" "}
          {t("miscellaneous:Buttons.Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSafekeepingAccountDialog;

ViewSafekeepingAccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
