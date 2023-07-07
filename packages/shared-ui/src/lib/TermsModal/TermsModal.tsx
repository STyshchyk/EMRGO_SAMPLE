// eslint-disable-next-line simple-import-sort/imports
import { FC, useState } from "react";

import {
  Button,
  DownloadIcon,
  Modal,
  PrinterIcon,
  ShareIcon,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import * as Styles from "./TermsModal.styles";
import { ITermsModalProps } from "./TermsModal.types";

import "@react-pdf-viewer/core/lib/styles/index.css";

import { useCopyToClipboard } from "react-use";

export const TermsModal: FC<ITermsModalProps> = ({
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
  const { showSuccessToast, showErrorToast } = useToast();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const isClientTerms = type === "client_terms";

  const onDownload = () => {
    // Triggering a download by appending a link to the DOM and clicking it.
    const link = document.createElement("a");
    link.href = documentURL;
    link.target = "_blank";
    link.download = "emrgo-terms";
    link.click();
  };

  const onPrint = () => {
    window.open(documentURL, "PRINT", "height=400,width=600");
    const newWindow = window.open(documentURL, "_blank");
    if (newWindow) {
      newWindow.onload = () => {
        newWindow?.print();
      };
    }
  };

  const onShare = () => {
    const text = `Hey, check out the ${isClientTerms?"client terms and conditions":"platform terms and conditions"} on the Emrgo platform. ${documentURL}`;
    copyToClipboard(text);
    if (copyState.error) {
      showErrorToast("An error occured when copying to clipboard");
    } else {
      showSuccessToast("Copied to clipboard");
    }
  };

  return (
    <Modal isOpen={isOpen} width={"40%"} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>{title}</Styles.Title>
        <Styles.Subtitle>{subtitle}</Styles.Subtitle>
        <Styles.Content>
          {documentURL !== "" && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div style={{ width: "100%" }}>
                <Viewer fileUrl={documentURL} defaultScale={1.25} />
              </div>
            </Worker>
          )}
        </Styles.Content>

        <Styles.Footer>
          <Styles.IconButton onClick={onDownload}>
            <DownloadIcon />
          </Styles.IconButton>
          <Styles.IconButton onClick={onPrint}>
            <PrinterIcon />
          </Styles.IconButton>
          <Styles.IconButton onClick={onShare}>
            <ShareIcon />
          </Styles.IconButton>

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
