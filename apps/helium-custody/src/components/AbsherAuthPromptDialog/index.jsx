import { useTranslation } from "react-i18next";

import { mdiLockOpenOutline } from "@mdi/js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import ErrorBanner from "../ErrorBanner";

const AbsherAuthPromptDialog = ({ open, handleClose, absherURL }) => {
  const { t } = useTranslation(["auth"]);

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <ErrorBanner
            title={t("auth:User Authentication")}
            description={t(
              "auth:You will be transferred immediately to the National Single Sign-On page for authentication using your 'Absher' user name and password"
            )}
            icon={mdiLockOpenOutline}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button href={absherURL} variant="contained" color="primary">
          {t("auth:Buttons.Proceed to Absher")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbsherAuthPromptDialog;
