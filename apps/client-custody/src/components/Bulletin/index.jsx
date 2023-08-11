import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Iframe from "react-iframe";

import { mdiBellCheck } from "@mdi/js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

import { useTheme } from "../../context/theme-context";
import BulletinSection from "../BulletinSection";
import ErrorBanner from "../ErrorBanner";
import LoadingIndicator from "../LoadingIndicator";
import UpdateBulletinForm from "../UpdateBulletinForm";
import style from "./style.module.scss";

const Bulletin = ({
  bulletins = [],
  bulletinTypeDropdown,
  handleFileUpload,
  filesUploaded,
  filesUploadInProgress,
  deleteBulletin,
  fetchBulletinDocument,
  isLoading,
  currentBulletinDocument,
  updateBulletin,
}) => {
  const { t } = useTranslation(["bulletin"]);
  const [showUpdateBulletinModal, setShowUpdateBulletinModal] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [showDeleteBulletinConfirmationModal, setDeleteBulletinConfirmationModal] = useState(false);
  const [currentBulletin, setCurrentBulletin] = useState({});
  const { theme } = useTheme();
  const { locale } = theme;

  const deleteBulletinHandler = () => {
    deleteBulletin({ bulletinId: currentBulletin.id });
    setDeleteBulletinConfirmationModal(false);
  };

  return (
    <Box>
      {bulletins.length === 0 ? (
        <ErrorBanner
          title={t("Empty List.You're all caught up")}
          description={t("Empty List.Please check back later for new updates")}
          icon={mdiBellCheck}
        />
      ) : (
        <Fragment>
          {bulletins.map((bulletinSection) => (
            <BulletinSection
              key={bulletinSection.type}
              data={bulletinSection}
              setCurrentBulletin={setCurrentBulletin}
              setIsDocumentModalOpen={setIsDocumentModalOpen}
              setDeleteBulletinConfirmationModal={setDeleteBulletinConfirmationModal}
              fetchBulletinDocument={fetchBulletinDocument}
              setShowUpdateBulletinModal={setShowUpdateBulletinModal}
            />
          ))}
        </Fragment>
      )}

      <UpdateBulletinForm
        open={showUpdateBulletinModal}
        currentBulletin={currentBulletin}
        handleClose={setShowUpdateBulletinModal}
        formOptions={bulletinTypeDropdown}
        handleFileUpload={handleFileUpload}
        filesUploaded={filesUploaded}
        filesUploadInProgress={filesUploadInProgress}
        onSubmit={updateBulletin}
      />
      <Dialog
        open={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{currentBulletin.title}</DialogTitle>
        <DialogContent
          className={style.document_dialogue__content}
          dir={locale.rtl ? "rtl" : "ltr"}
        >
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <Iframe
              id="iframe-pdf"
              className={style.document_dialogue__iframe}
              src={currentBulletinDocument}
              position="relative"
              width="100%"
              height="100%"
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={showDeleteBulletinConfirmationModal}
        onClose={() => setDeleteBulletinConfirmationModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("Delete Bulletin Modal.Delete Bulletin?")}
        </DialogTitle>
        <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
          <DialogContentText id="alert-dialog-description">
            {t(
              "Delete Bulletin Modal.This action is non reversible! It will permanently delete the bulletin titled",
              { title: currentBulletin.title }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteBulletinConfirmationModal(false);
            }}
            color="primary"
          >
            {t("New Bulletin Modal.Cancel")}
          </Button>
          <Button
            onClick={deleteBulletinHandler}
            variant="contained"
            color="primary"
            data-testid="delete-bullein-btn"
          >
            {t("Delete Bulletin Modal.Yes, Delete it")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Bulletin.propTypes = {
  bulletins: PropTypes.arrayOf(PropTypes.object).isRequired,
  bulletinTypeDropdown: PropTypes.shape().isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  filesUploaded: PropTypes.shape().isRequired,
  filesUploadInProgress: PropTypes.bool.isRequired,
  deleteBulletin: PropTypes.func.isRequired,
  fetchBulletinDocument: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // currentBulletinDocument: PropTypes.string.isRequired,
  // updateBulletin: PropTypes.string.isRequired,
};

export default Bulletin;
