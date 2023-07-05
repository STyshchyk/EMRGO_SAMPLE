// eslint-disable-next-line simple-import-sort/imports
import { FC, useState } from "react";

import { Button, DownloadIcon, Modal, PrinterIcon, ShareIcon } from "@emrgo-frontend/shared-ui";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import * as Styles from "./TermsModal.styles";
import { ITermsModalProps } from "./TermsModal.types";

import "@react-pdf-viewer/core/lib/styles/index.css";

export const TermsModal: FC<ITermsModalProps> = ({
  title = "Terms",
  subtitle = "Please accept our terms to proceed.",
  isOpen,
  documentURL,
  hasAccepted = false,
  onAccept,
  onReject,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const onDownload = () => {
    console.log(" On Download");
  };

  const onPrint = () => {
    console.log(" On Print");
  };

  const onShare = () => {
    console.log(" On Share");
  };

  return (
    <Modal isOpen={isOpen} width={1200} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>{title}</Styles.Title>
        <Styles.Subtitle>{subtitle}</Styles.Subtitle>
        <Styles.Content>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div style={{ width: "40vw" }}>
              <Viewer fileUrl={documentURL} defaultScale={1.25} />
            </div>
          </Worker>
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
