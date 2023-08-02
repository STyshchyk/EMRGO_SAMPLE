import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import cx from "classnames";
import PropTypes from "prop-types";

import useFileHandler from "../../hooks/useFileHandler";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as miscellaneousActionCreators from "../../redux/actionCreators/miscellaneous";
import * as authSelectors from "../../redux/selectors/auth";
import * as miscellaneousSelectors from "../../redux/selectors/miscellaneous";
import LoadingIndicator from "../LoadingIndicator";
import style from "./style.module.scss";

const DEFAULT_ACCEPTABLE_FILE_TYPES = ".pdf, .docx";

const extractFilenames = (files) => {
  const fileNames = [];

  for (let i = 0; i < files.length; i += 1) {
    fileNames.push(files[i].file.name);
  }

  return fileNames;
};

const FileUploadField = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["components"]);
  const { issuanceID } = useParams();
  const documentLink = useSelector(miscellaneousSelectors.selectDocumentLink);
  const documentName = useSelector(miscellaneousSelectors.selectDocumentName);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityID = currentEntityGroup?.entity.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const {
    acceptableFileTypes,
    allowMultiple,
    label,
    name,
    placeholder = t("components:FileUploadField.Choose file"),
    fullWidth,
    customHandleChange,
    className,
    defaultFiles,
    downloadParameters,
    isLoading,
    readOnly,
    dense = false,
    disabledProps = false,
  } = props;

  const { fileInputRef, files, isLoaded, onChange, setDefaultFiles } = useFileHandler(name);

  useEffect(() => {
    if (!isLoaded && defaultFiles) {
      setDefaultFiles(defaultFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadHandler = () => {
    const requestParams = {
      params: {
        entityId: entityID,
        type: downloadParameters.type,
        fileName: downloadParameters.documentName,
        sukukId: downloadParameters.sukukId || issuanceID, // for engagements page which has multiple sukuk engagements on the same page
      },
    };
    dispatch(miscellaneousActionCreators.doFetchDocumentLinkRequest(requestParams));
  };

  useEffect(() => {
    if (documentLink !== "" && downloadParameters?.documentName === documentName) {
      window.open(documentLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentLink]);

  const renderAction = () => {
    let element = "";
    if (isLoaded) {
      element = (
        <Fragment>
          {isLoading ? <LoadingIndicator height={36} /> : ""}
          <Typography align="left" className={style["file-input__text"]}>
            {extractFilenames(files).toString()}
          </Typography>
          {downloadParameters ? (
            <Fragment>
              {downloadParameters.signedURL ? (
                <IconButton
                  aria-label="download"
                  component={Link}
                  target="_blank"
                  href={downloadParameters.signedURL}
                  size="large"
                >
                  <CloudDownloadIcon className={style["close-icon"]} />
                </IconButton>
              ) : (
                <IconButton aria-label="download" onClick={() => downloadHandler()} size="large">
                  <CloudDownloadIcon className={style["close-icon"]} />
                </IconButton>
              )}
            </Fragment>
          ) : (
            ""
          )}
        </Fragment>
      );
    } else {
      element = (
        <Fragment>
          <Typography align="left" className={style["file-input__text"]}>
            {placeholder || t("components:FileUploadField.Default Placeholder")}
          </Typography>

          <Box p={1.5}>
            <CloudUploadIcon className={style["cloud-upload-icon"]} />
          </Box>
        </Fragment>
      );
    }
    return element;
  };

  return (
    <div className={cx(dense ? style.container__dense : style.container, className)}>
      <div className={cx(label !== null ? style["input-group"] : style["input-group--sans-label"])}>
        {label !== null ? (
          <div
            className={cx(
              style["input-group__label"],
              fullWidth ? style["input-group__label--fullwidth"] : ""
            )}
          >
            <label htmlFor="field">{label}</label>
          </div>
        ) : (
          ""
        )}

        <div className={style["input-group__field"]}>
          <input
            accept={acceptableFileTypes}
            className={style["file-input"]}
            id={name}
            readOnly={readOnly}
            multiple={allowMultiple}
            name={name}
            onChange={(e) => {
              onChange(e, customHandleChange);
            }}
            ref={fileInputRef}
            type="file"
            disabled={disabledProps}
          />
          <label
            htmlFor={name}
            className={cx(
              style["file-input__label"],
              { [style["file-input__label--loaded"]]: isLoaded },
              fullWidth ? style["file-input__label--fullwidth"] : ""
            )}
          >
            {renderAction()}
          </label>
        </div>
      </div>
    </div>
  );
};

FileUploadField.propTypes = {
  acceptableFileTypes: PropTypes.string,
  allowMultiple: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
  customHandleChange: PropTypes.func,
  className: PropTypes.string,
  defaultFiles: PropTypes.arrayOf(PropTypes.object),
  downloadParameters: PropTypes.shape({
    type: PropTypes.string,
    documentName: PropTypes.string,
    sukukId: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  readOnly: PropTypes.bool,
};

FileUploadField.defaultProps = {
  acceptableFileTypes: DEFAULT_ACCEPTABLE_FILE_TYPES,
  allowMultiple: false,
  placeholder: null,
  label: null,
  fullWidth: false,
  customHandleChange: null,
  className: "",
  defaultFiles: null,
  downloadParameters: null,
  isLoading: false,
  readOnly: false,
};

export default FileUploadField;
