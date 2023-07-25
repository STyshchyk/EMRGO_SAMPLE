/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo } from "react";
import DocViewer, { MSDocRenderer, PDFRenderer } from "react-doc-viewer";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import style from "./style.module.scss";

const SUPPORTED_DOCUMENT_FILE_TYPES = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"];
/*
 *
 * Dev note: react-doc-viewer library has an unresolved/reproducible issue where DocViewer page view would collapse
 * whenever DocumentViewer component is re-rendered. It throws an error that states a React state update cannot
 * be performed on an unmounted component. This error seems to be originated from PDFRenderer plugin component
 * The workaround to this issue is to ensure DocumentViewer is fully unmounted while a React state update is happening.
 *
 */

const DocumentViewer = ({ documentURL }) => {
  const { t } = useTranslation(["components"]);
  const memoizedDocumentObject = useMemo(
    () => ({
      uri: documentURL,
      fileType: documentURL?.split("?", 1)[0].split(".").pop() ?? undefined,
    }),
    [documentURL]
  );

  if (!SUPPORTED_DOCUMENT_FILE_TYPES.includes(memoizedDocumentObject.fileType))
    return (
      <strong style={{ color: "red" }}>
        {t("components:Document Viewer.Error: Document File Type Not Supported")}
      </strong>
    );

  return (
    <div
      style={{
        border: "2px solid #173870",
      }}
    >
      <DocViewer
        className={style["document-viewer"]}
        documents={[memoizedDocumentObject]}
        pluginRenderers={[PDFRenderer, MSDocRenderer]}
        config={{
          header: {
            disableHeader: true,
          },
        }}
        theme={{
          disableThemeScrollbar: true,
        }}
      />
    </div>
  );
};

DocumentViewer.propTypes = {
  documentURL: PropTypes.string,
};

DocumentViewer.defaultProps = {
  documentURL: undefined,
};

export default DocumentViewer;
