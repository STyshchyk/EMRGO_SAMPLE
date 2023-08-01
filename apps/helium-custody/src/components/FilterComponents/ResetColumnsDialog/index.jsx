import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useFilters } from "../../../context/filter-context";

const ResetColumnsDialog = ({ open, closeDialog }) => {
  const { t } = useTranslation(["miscellaneous"]);

  const filterContext = useFilters();
  const { updateConfig } = filterContext;

  const handleResetConfirmCancel = () => {
    closeDialog();
  };

  const handleResetConfirm = () => {
    closeDialog();
    updateConfig(
      {
        shownColumns: [],
        hiddenColumns: [],
      },
      "columns",
      false
    );
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleResetConfirmCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("miscellaneous:Manage Columns Dialogue.Reset Column Configuration?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t(
              "miscellaneous:Manage Columns Dialogue.This action is non-reversible~ Columns will move back to their default positions and your custom configuration will be lost"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetConfirmCancel} color="primary">
            {t("miscellaneous:Manage Columns Dialogue.Cancel")}
          </Button>
          <Button onClick={handleResetConfirm} color="primary" autoFocus variant="contained">
            {t("miscellaneous:Manage Columns Dialogue.Reset Columns")}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ResetColumnsDialog;
