/* eslint-disable no-nested-ternary */
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import CloudUploadRounded from "@mui/icons-material/CloudUploadRounded";
import Delete from "@mui/icons-material/Delete";
import Description from "@mui/icons-material/Description";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";

import ClearSelect from "../ClearSelect";
import style from "./style.module.scss";

const SingleUpload = ({
  entry,
  uploadStatus,
  handleRemoveFile,
  handleUploadFile,
  index,
  allCategories,
  availableCategories,
}) => {
  const { t } = useTranslation(["components"]);
  const { displayName, category, id, revision, originalFileName, existingDocumentId } = entry;
  const file = entry.fileListObj;

  const getSelected = (cat) => {
    const filtered = allCategories.filter((o) => o.value === cat);
    if (filtered.length) return filtered[0];
    return "";
  };

  const [fileName, setFileName] = useState(displayName || "");
  const [fileCategory, setFileCategory] = useState(getSelected(category) || "");

  const handleFileNameChange = (value) => {
    setFileName(value);
  };

  const handleFileCategoryChange = (value) => {
    setFileCategory(value);
  };

  const getCategoryDisplayName = (cat) => {
    if (typeof cat === "object") return cat.label;
    const filtered = allCategories.filter((o) => o.value === cat);
    if (filtered.length) return filtered[0].label;
    return "N/A";
  };

  const getFileSize = (size) => {
    let formattedSize = "";
    if (size < 1024) {
      formattedSize = `${size.toFixed(2)} Bytes`;
    } else if (size >= 1024 && size < 1048576) {
      // return in KB
      formattedSize = `${(size / 1024).toFixed(2)} KB`;
    } else if (size >= 1048576 && size < 1073741824) {
      formattedSize = `${(size / 1048576).toFixed(2)} MB`;
    } else {
      formattedSize = `${(size / 1073741824).toFixed(2)} GB`;
    }

    return formattedSize;
  };

  const handleUpload = () => {
    // { id, file, displayName, category, index, existingDocumentId, isRevision }
    const payload = {
      id,
      file,
      index,
      isRevision: revision,
    };
    if (revision) {
      payload.originalFileName = originalFileName;
      payload.existingDocumentId = existingDocumentId;
      payload.category = category;
    } else {
      payload.displayName = fileName;
      payload.category = fileCategory.value;
    }
    handleUploadFile(payload);
  };

  const isUploading = uploadStatus[entry.id] && uploadStatus[id].isUploading;
  const uploadState = uploadStatus[entry.id] && uploadStatus[id].uploadState;
  const uploadDisabled = !fileName || fileName === "" || !fileCategory || !fileCategory.value;
  const editDisabled = isUploading || revision;

  return (
    <div className={style.singleUploadContainer} key={id}>
      <div className={style.previewIconContainer}>
        <Description size="inherit" />
      </div>
      <div className={style.fileNameProgressContainer}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              {t("components:Single Upload.File")}: {originalFileName} ({getFileSize(file.size)})
            </div>
            <div style={{ marginLeft: 30, display: "flex", alignItems: "center" }}>
              {t("components:Single Upload.Document Name")}:{" "}
              {!editDisabled ? (
                <input
                  value={fileName}
                  type="text"
                  className={style.inlineText}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                />
              ) : (
                `${fileName}`
              )}
            </div>
            <div style={{ marginLeft: 30, flex: 1, display: "flex", alignItems: "center" }}>
              {t("components:Single Upload.Category")}:{" "}
              <div style={{ width: 200 }}>
                {!editDisabled ? (
                  <ClearSelect
                    name="category"
                    isClearable={false}
                    isSearchable={false}
                    value={fileCategory}
                    onChange={handleFileCategoryChange}
                    options={availableCategories}
                  />
                ) : (
                  ` ${getCategoryDisplayName(fileCategory)}`
                )}
              </div>
            </div>
          </div>
        </div>
        {isUploading && (
          <div>
            <LinearProgress />
          </div>
        )}
      </div>
      <div className={style.actionContainer}>
        {uploadState === 1 ? (
          <Fragment>{t("components:Single Upload.File Uploaded")}</Fragment>
        ) : (
          <Fragment>
            <IconButton
              disabled={uploadDisabled}
              aria-label="Upload"
              onClick={handleUpload}
              size="large"
            >
              <CloudUploadRounded fontSize="inherit" />
            </IconButton>
            <IconButton
              disabled={isUploading}
              aria-label="Remove"
              onClick={handleRemoveFile}
              size="large"
            >
              {uploadState === 1 ? (
                <RemoveCircleOutline fontSize="inherit" />
              ) : (
                <Delete fontSize="inherit" />
              )}
            </IconButton>
          </Fragment>
        )}
      </div>
    </div>
  );
};

SingleUpload.propTypes = {
  entry: PropTypes.shape({
    displayName: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    originalFileName: PropTypes.string,
    existingDocumentId: PropTypes.string,
    fileListObj: PropTypes.object,
  }).isRequired,
  uploadStatus: PropTypes.object.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  handleUploadFile: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  allCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  availableCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

SingleUpload.defaultProps = {};

export default SingleUpload;
