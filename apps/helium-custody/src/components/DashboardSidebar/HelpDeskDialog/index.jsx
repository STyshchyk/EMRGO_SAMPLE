import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import appConfig from "../../../appConfig";

const HELP_DESK_EMAIL_ADDRESS = "helpdesk@difc.emrgo.com";
const HELP_DESK_EMAIL_ADDRESS_KSA = "helpdesk@wethaqcapital.sa"; // update this when there's a ksa version for emrgo

const HelpDeskDialog = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const helpDeskEmailAddress =
    appConfig.appRegion === "SA" ? HELP_DESK_EMAIL_ADDRESS_KSA : HELP_DESK_EMAIL_ADDRESS;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("Sidebar.Help Desk Modal.Connect with Emrgo?")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`${t("Sidebar.Help Desk Modal.Please contact")} `}
          <a target="_blank" rel="noopener noreferrer" href={`mailto:${helpDeskEmailAddress}`}>
            {helpDeskEmailAddress}
          </a>
          {` ${t("Sidebar.Help Desk Modal.for any support related queries")}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("Sidebar.Help Desk Modal.Cancel")}
        </Button>
        <Button
          target="_blank"
          rel="noopener noreferrer"
          href={`mailto:${helpDeskEmailAddress}`}
          variant="contained"
          color="primary"
          autoFocus
        >
          {t("Sidebar.Help Desk Modal.Get in Touch")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDeskDialog;
