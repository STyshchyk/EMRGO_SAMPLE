import { useState } from "react";
import { useTranslation } from "react-i18next";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ManageColumnsDialog from "../ManageColumnsDialog";

const ReportingButtons = ({ handleClear, handleFilter, disableApplyBtn, data }) => {
  const { t } = useTranslation(["reports"]);
  const [manageColumnStatus, setManageColumnStatus] = useState(false);

  const openManageColumnsDialog = (e) => {
    e.stopPropagation();
    setManageColumnStatus(true);
  };

  const closeManageColumnDialog = () => {
    setManageColumnStatus(false);
  };

  return (
    <Grid item xs={12} md={6} lg={12} container alignContent="center" justifyContent="flex-end">
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body1" className="white-text">
          .
        </Typography>
      </Grid>

      <Box my={1} className="w-full">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6} lg={6} container alignContent="center">
            <Button
              variant="outlined"
              onClick={openManageColumnsDialog}
              startIcon={<ViewColumnIcon />}
              color="secondary"
              size="large"
              fullWidth
            >
              {t("miscellaneous:Filters.Manage Columns")}
            </Button>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Button
              fullWidth
              disabled={disableApplyBtn}
              variant="contained"
              color="primary"
              onClick={() => handleFilter()}
              size="large"
            >
              {t("Cash Balances.Filters.Apply")}
            </Button>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Button
              fullWidth
              disabled={data.length === 0}
              variant="outlined"
              color="primary"
              onClick={() => handleClear()}
              size="large"
            >
              {t("Cash Balances.Filters.Clear")}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {manageColumnStatus && (
        <ManageColumnsDialog open={manageColumnStatus} closeDialog={closeManageColumnDialog} />
      )}
    </Grid>
  );
};

export default ReportingButtons;
