import { Fragment } from "react";
import Iframe from "react-iframe";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const PreviewDocumentDialog = ({ open, handleClose, documentObject }) => (
  <Fragment>
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle id="alert-dialog-title">{documentObject?.name ?? "NADA"}</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "80vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Iframe
          className={style.iframePdf}
          src={documentObject?.link}
          position="relative"
          width="100%"
          height="100%"
        />
      </DialogContent>
    </Dialog>
  </Fragment>
);

PreviewDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  documentObject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }),
};

export default PreviewDocumentDialog;
