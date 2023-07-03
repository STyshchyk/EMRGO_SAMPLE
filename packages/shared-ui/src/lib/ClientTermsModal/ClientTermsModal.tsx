// eslint-disable-next-line simple-import-sort/imports
import { FC, useState } from "react";

import { Button, DownloadIcon, Modal, PrinterIcon, ShareIcon } from "@emrgo-frontend/shared-ui";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import * as Styles from "./ClientTermsModal.styles";
import { IClientTermsModalProps } from "./ClientTermsModal.types";

import "@react-pdf-viewer/core/lib/styles/index.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// const pdfWorker = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// const pdfWorker = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export const ClientTermsModal: FC<IClientTermsModalProps> = ({
  isOpen,
  documentURL,
  onDownload,
  onPrint,
  onShare,
  onAccept,
  onReject,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <Modal isOpen={isOpen} width={1200} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>Client Terms</Styles.Title>
        <Styles.Subtitle>Please accept our platform terms to proceed.</Styles.Subtitle>
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
            I do not accept
          </Button>
          <Button onClick={onAccept} variant="primary">
            I accept
          </Button>
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
