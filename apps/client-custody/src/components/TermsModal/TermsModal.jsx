// eslint-disable-next-line simple-import-sort/imports
import { FC, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
// import {
//   Button,
//   DownloadIcon,
//   Modal,
//   PrinterIcon,
//   ShareIcon,
//   useToast,
// } from "@emrgo-frontend/shared-ui";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";

import { useCopyToClipboard } from "react-use";

import { Button } from "@mui/material";

import Modal from "../Modal/Modal";
import * as Styles from "./TermsModal.styles";

const TermsModal = ({
  title = "Terms",
  subtitle = "Please accept our terms to proceed.",
  isOpen,
  documentURL,
  hasAccepted = false,
  onAccept,
  onReject,
  type,
}) => {
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const isClientTerms = type === "client_terms";
  const tempLink =
    documentURL ||
    "https://objectstorage.uk-london-1.oraclecloud.com/p/YNCMkcCPFeULrWynt62h2XidrgSB8andBQzolQbGp-KHBN-hHIN2dN5l0Nw9Sca2/n/lrdnudlitj58/b/exp-difc.wethaq.capital-data/o//documents/e61e1799-951f-4648-80c1-3a94366ac603/2e9ba1c0-550c-4ac2-baf5-a7bdba6d88f6.pdf";
  const onDownload = () => {
    // Triggering a download by appending a link to the DOM and clicking it.
    const link = document.createElement("a");
    link.href = tempLink;
    link.target = "_blank";
    link.download = "emrgo-terms";
    link.click();
  };

  const onPrint = () => {
    window.open(tempLink, "PRINT", "height=400,width=600");
    const newWindow = window.open(tempLink, "_blank");
    if (newWindow) {
      newWindow.onload = () => {
        newWindow?.print();
      };
    }
  };

  const onShare = () => {
    const text = `Hey, check out the ${
      isClientTerms ? "client terms and conditions" : "platform terms and conditions"
    } on the Emrgo platform. ${tempLink}`;
    copyToClipboard(text);
    if (copyState.error) {
      // showErrorToast("An error occured when copying to clipboard");
    } else {
      // showSuccessToast("Copied to clipboard");
    }
  };

  return (
    <Modal width={"50%"} variant={"darkened"} isOpen={isOpen}>
      <Styles.Wrapper>
        <Styles.Title>{title}</Styles.Title>
        <Styles.Subtitle>{subtitle}</Styles.Subtitle>
        <Styles.Content>
          {tempLink !== "" && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div style={{ width: "100%" }}>
                <Viewer fileUrl={tempLink} defaultScale={1.25} />
              </div>
            </Worker>
          )}
        </Styles.Content>

        <Styles.Footer>
          <Styles.IconButton onClick={onDownload}>{<DownloadIcon />}</Styles.IconButton>
          <Styles.IconButton onClick={onPrint}>{<PrintIcon />}</Styles.IconButton>
          <Styles.IconButton onClick={onShare}>{<ShareIcon />}</Styles.IconButton>

          <Styles.Spacer />
          <Button onClick={onReject} variant="secondary">
            {hasAccepted ? "Close" : "I do not accept"}
          </Button>
          {!hasAccepted ? (
            <Button onClick={onAccept} variant="primary">
              I accept
            </Button>
          ) : (
            ""
          )}
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
export default TermsModal;
