import { createRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import v from "voca";
import useDeepCompareEffect from "use-deep-compare-effect";
import { v4 as uuidv4 } from "uuid";

import appConfig from "../../../appConfig";
import AbsherAuthErrorDialog from "../../../components/AbsherAuthErrorDialog";
import AbsherAuthPromptDialog from "../../../components/AbsherAuthPromptDialog";
import FileTable from "../../../components/DocManagement/FileTable";
import RenameDialog from "../../../components/DocManagement/RenameDialog";
import SingleUpload from "../../../components/DocManagement/SingleUpload";
import UserSelection from "../../../components/DocManagement/UserSelection";
import LoadingIndicator from "../../../components/LoadingIndicator";
import LoadingPage from "../../../components/LoadingPage";
import useAbsherRedirectURLHandler from "../../../hooks/useAbsherRedirectURLHandler";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as documentActionCreators from "../../../redux/actionCreators/documents";
import * as authSelectors from "../../../redux/selectors/auth";
import * as documentSelectors from "../../../redux/selectors/documents";
import buildElmAuthAPIURL from "../../../utils/buildElmAuthAPIURL";
import style from "./style.module.scss";

// TODO - REFACTOR THIS PAGE COMPONENT

const Documents = () => {
  // Selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const uploadStatus = useSelector(documentSelectors.selectUploadStatus);
  const userFiles = useSelector(documentSelectors.selectUserFiles);
  const usersList = useSelector(documentSelectors.selectUsers);
  const isProcessing = useSelector(documentSelectors.selectIsProcessing);
  const isFetchingFiles = useSelector(documentSelectors.selectIsFetchingUserFiles);
  const isFetchingDocusignURL = useSelector(documentSelectors.selectIsFetchingDocusignURL);
  const docusignURL = useSelector(documentSelectors.selectDocusignURL);
  const hasFinalTerms = useSelector(documentSelectors.selectHasFinalTerms);
  const isFetchingPreviewFile = useSelector(documentSelectors.selectFetchingPreviewDocument);
  const currentPreviewFile = useSelector(documentSelectors.selectCurrentPreviewDocument);

  const isLoading = isProcessing || isFetchingFiles;
  // Hooks
  const { /* entityId, */ issuanceID } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(["documents"]);
  const location = useLocation();

  const currentEntityGroupID = currentEntityGroup?.id;
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  // refs
  const fileInputRef = useRef(null);
  const revisionFileInputRef = useRef(null);
  const finalTermsfileInputRef = useRef(null);
  const iframeRef = createRef();

  // state
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState(null);
  const [currentDocumentCategory, setCurrentDocumentCategory] = useState(null);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [absherURL, setAbsherURL] = useState(null);
  const [openAbsherAuthenticationErrorDialog, setOpenAbsherAuthenticationErrorDialog] =
    useState(false);
  const [openAbsherAuthenticationPromptDialog, setOpenAbsherAuthenticationPromptDialog] =
    useState(false);
  const [openSigningModal, setOpenSigningModal] = useState(false);

  const absherAuthenticationStateObject = useAbsherRedirectURLHandler();

  // Effects
  useEffect(() => {
    const fetchUsers = (payload) => dispatch(documentActionCreators.doFetchUsers(payload));
    fetchUsers({ sukukId: issuanceID });
  }, [issuanceID, dispatch, currentEntityGroupID]);

  useEffect(() => {
    const fetchUserFiles = (payload) => dispatch(documentActionCreators.doFetchUserFiles(payload));
    fetchUserFiles({ sukukId: issuanceID });
  }, [dispatch, currentEntityGroupID, issuanceID]);

  useEffect(() => {
    const handleOnMessage = (e) => {
      if (e.data === "Close Modal") {
        setIsSignatureModalOpen(false);
      }
    };

    window.addEventListener("message", handleOnMessage);

    return () => window.removeEventListener("message", handleOnMessage);
  }, []);

  useDeepCompareEffect(() => {
    if (absherAuthenticationStateObject.status === "success") {
      const fetchDocusignUrl = (payload) =>
        dispatch(documentActionCreators.doFetchDocusignURL(payload));
      const fetchUserFiles = (payload) =>
        dispatch(documentActionCreators.doFetchUserFiles(payload));

      const { documentId, transactionId } = absherAuthenticationStateObject.queryParamsObject;

      const requestPayload = {
        documentId,
        transactionId,
        sukukId: issuanceID,
      };

      fetchDocusignUrl({
        requestPayload,
        successCallback: () => {
          fetchUserFiles({ sukukId: issuanceID });
          setIsSignatureModalOpen(true);
        },
      });

      setAbsherURL(null);
    }

    if (absherAuthenticationStateObject.status === "error") {
      setOpenAbsherAuthenticationErrorDialog(true);
    }
  }, [absherAuthenticationStateObject, dispatch, issuanceID]);

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setCurrentDocumentId(null);
  };

  const handleCloseSigningModal = () => {
    setOpenSigningModal(false);
    setCurrentDocumentId(null);
  };

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleFileInputChange = (toUpload) => {
    const currentFiles = [...filesToUpload];
    for (let i = 0; i < toUpload.length; i += 1) {
      const id = uuidv4();
      currentFiles.push({
        id,
        fileListObj: toUpload[i],
        displayName: toUpload[i].name,
        originalFileName: toUpload[i].name,
        category: "other",
      });
    }
    setFilesToUpload(currentFiles);
  };

  const onFileInputChange = (event) => {
    const { files } = event.target;
    handleFileInputChange(files);
  };

  const onFinalTermsFileInputChange = (event) => {
    const { files } = event.target;
    const fileObj = files[0];
    const currentFiles = [...filesToUpload];
    const id = uuidv4();
    currentFiles.push({
      id,
      fileListObj: fileObj,
      displayName: fileObj.name,
      originalFileName: fileObj.name,
      category: "final_terms",
    });
    setFilesToUpload(currentFiles);
  };

  const onRevisionFileInputChange = (event) => {
    const { files } = event.target;
    const currentFiles = [...filesToUpload];
    const fileObj = files[0];
    const id = uuidv4();
    currentFiles.push({
      id,
      fileListObj: fileObj,
      originalFileName: fileObj.name,
      displayName: currentDocumentName, // set from clicked entry
      category: currentDocumentCategory, // set from clicked entry
      existingDocumentId: currentDocumentId, // set from clicked entry
      revision: true,
    });
    setFilesToUpload(currentFiles);
  };

  const handleRemoveFile = (index) => {
    const currentFiles = [...filesToUpload];
    currentFiles.splice(index, 1);
    setFilesToUpload(currentFiles);
  };

  const handleFileUpload = ({
    id,
    file,
    displayName,
    category,
    index,
    existingDocumentId,
    isRevision,
  }) => {
    const fileUploadLinkPayload = {
      originalFileName: file.name,
      contentType: file.type,
    };
    if (displayName) {
      fileUploadLinkPayload.displayName = displayName;
    }
    if (issuanceID) {
      fileUploadLinkPayload.sukukId = issuanceID;
    }
    if (category) {
      fileUploadLinkPayload.category = category;
    }
    if (existingDocumentId) {
      fileUploadLinkPayload.existingDocumentId = existingDocumentId;
    }
    const payload = {
      sukukId: issuanceID,
      fileUploadLinkPayload,
      file,
      id,
      isRevision,
      onSuccess: () => handleRemoveFile(index),
    };
    dispatch(documentActionCreators.doUploadFile(payload));
  };

  const CATEGORIES = [
    { value: "final_terms", label: t("documents:Categories.Final Terms") },
    { value: "other", label: t("documents:Categories.Misc") },
  ];

  const getFileUploadsInProgress = (entries = []) => {
    const rows = [];
    entries.forEach((entry, index) => {
      rows.push(
        <SingleUpload
          index={index}
          entry={entry}
          key={entry.id}
          uploadStatus={uploadStatus}
          handleRemoveFile={() => handleRemoveFile(index)}
          handleUploadFile={handleFileUpload}
          allCategories={CATEGORIES}
          availableCategories={
            entry.category === "final_terms"
              ? [{ value: "final_terms", label: t("documents:Categories.Final Terms") }]
              : [{ value: "other", label: t("documents:Categories.Misc") }]
          }
        />
      );
    });
    return rows;
  };

  const handlePreviewClick = (row) => {
    const { id, fileName, status } = row;
    setCurrentDocumentId(id);

    if (status === "signed") {
      const fetchDocusignUrl = (payload) =>
        dispatch(documentActionCreators.doFetchDocusignURL(payload));

      const requestPayload = { documentId: id, sukukId: issuanceID };

      fetchDocusignUrl({
        requestPayload,
        successCallback: () => {
          setIsSignatureModalOpen(true);
        },
      });
    } else {
      dispatch(documentActionCreators.doPreviewFile({ documentId: id, fileName }));
      setOpenPreviewModal(true);
    }
  };

  const handleDownloadClick = (row) => {
    // get public link from API call
    const { id, displayName } = row;
    setCurrentDocumentId(id);
    dispatch(documentActionCreators.doDownloadFile({ documentId: id, fileName: displayName }));
  };

  const handleRenameClick = (entry) => {
    setEntryToEdit(entry);
    setOpenRenameModal(true);
  };

  const handleRenameConfirm = (payload) => {
    setOpenRenameModal(false);
    const requestPayload = { ...payload };
    requestPayload.sukukId = issuanceID;
    dispatch(documentActionCreators.doProcessFile(requestPayload));
  };

  const handleSendForReviewClick = (documentId) => {
    setCurrentDocumentId(documentId);
    handleOpenReviewModal();
  };

  const handleSendForReview = (reviewerUserId) => {
    const payload = { documentId: currentDocumentId };
    const userDetails = usersList.filter((o) => o.id === reviewerUserId);
    payload.reviewerUserId = reviewerUserId;
    payload.reviewerEntityGroupId = userDetails[0].entityGroup.id;
    payload.sukukId = issuanceID;
    handleCloseReviewModal();
    dispatch(documentActionCreators.doProcessFile(payload));
  };

  const handleSendForSigning = (reviewUsers) => {
    const payload = { documentId: currentDocumentId, signers: reviewUsers };
    payload.sukukId = issuanceID;
    handleCloseSigningModal();
    dispatch(documentActionCreators.doProcessFile(payload));
  };

  const handleSendForSigningClick = (documentId) => {
    setCurrentDocumentId(documentId);
    setOpenSigningModal(true);
  };

  const handleSigningClick = (entry) => {
    const { id, status } = entry;
    const isAbsherAuthenticationRequired = appConfig.appRegion === "SA" && status === "signing";

    setCurrentDocumentId(id);

    if (isAbsherAuthenticationRequired) {
      const { origin } = window.location;
      const redirectURL = new URL(`${origin}${location.pathname}`);
      const errorURL = new URL(`${origin}${location.pathname}`);

      redirectURL.searchParams.append("state", "success");
      redirectURL.searchParams.append("documentId", `${id}`);
      errorURL.searchParams.append("state", "error");

      const newElmAuthURL = buildElmAuthAPIURL(
        redirectURL.href,
        errorURL.href,
        currentEntityGroupID
      );
      setAbsherURL(newElmAuthURL);
      setOpenAbsherAuthenticationPromptDialog(true);
    } else {
      // !Dev note: THIS AE PATH IS NOT TESTED IN AN AE ENVIRONMENT YET!!!!!!!!!!
      const fetchDocusignUrl = (payload) =>
        dispatch(documentActionCreators.doFetchDocusignURL(payload));
      const fetchUserFiles = (payload) =>
        dispatch(documentActionCreators.doFetchUserFiles(payload));

      const requestPayload = {
        documentId: id,
        sukukId: issuanceID,
        successCallback: () => {
          fetchUserFiles({ sukukId: issuanceID });
        },
      };

      fetchDocusignUrl({
        requestPayload,
        successCallback: () => {
          fetchUserFiles({ sukukId: issuanceID });
          setIsSignatureModalOpen(true);
        },
      });
      setIsSignatureModalOpen(true);
    }
  };

  const handleMarkAsExecutionVersionClick = (documentId) => {
    const payload = {
      documentId,
      executionVersion: true,
      sukukId: issuanceID,
    };
    dispatch(documentActionCreators.doProcessFile(payload));
  };

  const handleDeleteClick = (documentId) => {
    const payload = {
      documentId,
      shouldDelete: true,
      sukukId: issuanceID,
    };
    // Marks the document as "archived" on delete. (not hard deleted)
    dispatch(documentActionCreators.doProcessFile(payload));
  };

  const handleUploadRevisionClick = (entry) => {
    setCurrentDocumentId(entry.id);
    setCurrentDocumentName(entry.displayName);
    setCurrentDocumentCategory(entry.category);
    revisionFileInputRef.current.value = null;
    revisionFileInputRef.current.click();
  };

  const getActionsFromStatus = (entry) => {
    const status = entry.status || "";
    const isOwner = entry.uploader.id === currentUserId;
    const entityGroup = currentEntityGroup.entityType;
    const currentEntityGroupId = currentEntityGroup.id;
    const entityGroupId = entry.uploader.entityGroup.id;
    const isSameEntityGroup = currentEntityGroupId === entityGroupId;

    if (status === "awaiting" && isOwner) {
      return {
        handlePreviewClick: () => handlePreviewClick(entry),
        handleDownloadClick: () => handleDownloadClick(entry),
        handleRenameClick: () => handleRenameClick(entry),
        handleSendForReviewClick: () => handleSendForReviewClick(entry.id),
        handleMarkAsExecutionVersionClick: () => handleMarkAsExecutionVersionClick(entry.id),
        handleDeleteClick: () => handleDeleteClick(entry.id),
        // handleUploadRevisionClick: () => handleUploadRevisionClick(entry),
      };
    }

    if (status === "review") {
      if (isOwner && isSameEntityGroup) {
        return {
          handlePreviewClick: () => handlePreviewClick(entry),
          handleDownloadClick: () => handleDownloadClick(entry),
        };
      }
      if (
        entityGroup === "LEGAL_COUNSEL" ||
        entityGroup === "OBLIGOR" ||
        entityGroup === "ARRANGER" ||
        entityGroup === "FIDUCIARY" ||
        entityGroup === "ISSUER"
      ) {
        return {
          handlePreviewClick: () => handlePreviewClick(entry),
          handleDownloadClick: () => handleDownloadClick(entry),
          handleUploadRevisionClick: () => handleUploadRevisionClick(entry),
        };
      }
    }

    if (status === "reviewed") {
      if (isOwner) {
        return {
          handlePreviewClick: () => handlePreviewClick(entry),
          handleDownloadClick: () => handleDownloadClick(entry),
          handleRenameClick: () => handleRenameClick(entry),
          handleSendForReviewClick: () => handleSendForReviewClick(entry.id),
          handleMarkAsExecutionVersionClick: () => handleMarkAsExecutionVersionClick(entry.id),
          handleDeleteClick: () => handleDeleteClick(entry.id),
          handleUploadRevisionClick: () => handleUploadRevisionClick(entry),
        };
      }
      return {
        handlePreviewClick: () => handlePreviewClick(entry),
        handleDownloadClick: () => handleDownloadClick(entry),
      };
    }

    if (status === "execution") {
      if (isOwner) {
        return {
          handlePreviewClick: () => handlePreviewClick(entry),
          handleDownloadClick: () => handleDownloadClick(entry),
          // handleSendForReviewClick: () => handleSendForReviewClick(entry.id),
          handleDeleteClick: () => handleDeleteClick(entry.id),
          handleSendForSigningClick: () => handleSendForSigningClick(entry.id),
        };
      }
      return {
        handlePreviewClick: () => handlePreviewClick(entry),
        handleDownloadClick: () => handleDownloadClick(entry),
      };
    }

    if (status === "signing") {
      return {
        handlePreviewClick: () => handlePreviewClick(entry),
        // handleDownloadClick: () => handleDownloadClick(entry),
        handleSigningClick: () => handleSigningClick(entry),
      };
    }

    return {
      handlePreviewClick: () => handlePreviewClick(entry),
      handleDownloadClick: () => handleDownloadClick(entry),
      // handleSigningClick: () => handleSigningClick(entry.id),
    };
  };

  const getCategoryDisplayName = (cat) => {
    if (typeof cat === "object") return cat.label || "";
    const filtered = CATEGORIES.filter((o) => o.value === cat);
    if (filtered.length) return filtered[0].label;
    return t("documents:Not Available");
  };

  const getTableData = (entries) => {
    const tableData = [];
    entries.forEach((entry) => {
      tableData.push({
        id: entry.id,
        name: entry.displayName || t("documents:Not Available"),
        version: entry.version,
        shared: { reviews: entry.reviews || [], signers: entry.signers || [], id: entry.id },
        status: entry.status,
        category: getCategoryDisplayName(entry.category),
        issuance: entry?.sukuk?.name,
        uploadedby: `${entry.uploader.firstName || ""} ${entry.uploader.lastName || ""}`,
        dateUploaded: entry.uploadDate,
        dateModified: entry.updatedAt,
        actions: getActionsFromStatus(entry),
      });
    });
    return tableData;
  };

  const getReviewers = (users) => {
    const options = [];
    users.forEach((user) => {
      // if (user.id !== currentUserId && user.entityGroup.entityType !== 'INVESTOR') {
      //   options.push({ value: user.id, label: `${user.firstName} ${user.lastName || ''}`, type: t(`Users.${v.capitalize(user.entityGroup.entityType)}`) });
      // }
      options.push({
        value: user.id,
        label: `${user.firstName} ${user.lastName || ""}`,
        type: t(`Users.${v.capitalize(user.entityGroup.entityType)}`),
      });
    });

    return options;
  };

  const getSigners = (users) => {
    const options = [];
    users.forEach((user) => {
      // if (user.id !== currentUserId) {
      options.push({
        value: user.id,
        label: `${user.firstName} ${user.lastName || ""}`,
        type: t(`Users.${v.capitalize(user.entityGroup.entityType)}`),
      });
      // }
    });
    return options;
  };

  const filesAvailableForUpload = filesToUpload.length > 0;

  const handleOtherUploadClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleFinalTermsUploadClick = () => {
    finalTermsfileInputRef.current.value = null;
    finalTermsfileInputRef.current.click();
  };

  const isFinalTermsAvailable = () => {
    // !hasFinalTerms;
    const finalTermsUploads = filesToUpload.filter((file) => file.category === "final_terms");
    return !(hasFinalTerms || finalTermsUploads.length > 0);
  };

  const termsUploadAvailable = isFinalTermsAvailable();
  // const termsUploadAvailable = true;

  // !DEV NOTE: isFetchingDocuSignURL selector seems to be bugged

  if (isFetchingFiles) {
    return <LoadingPage />;
  }

  return (
    <div className={style.documentContainer}>
      <div className={style.actionBar}>
        <ButtonGroup variant="contained" color="primary">
          {termsUploadAvailable && (
            <Button onClick={handleFinalTermsUploadClick} startIcon={<CloudUploadIcon />}>
              {t("documents:Buttons.Upload Final Terms")}
            </Button>
          )}
          <Button onClick={handleOtherUploadClick} startIcon={<CloudUploadIcon />}>
            {t("documents:Buttons.Upload")}
          </Button>
          <Button
            onClick={() =>
              dispatch(documentActionCreators.doFetchUserFiles({ sukukId: issuanceID }))
            }
            startIcon={<SyncIcon />}
          >
            {t("documents:Buttons.Refresh")}
          </Button>
        </ButtonGroup>
        <input
          onChange={onFileInputChange}
          accept=".docx, .pdf"
          multiple
          ref={fileInputRef}
          type="file"
          className={style.hidden}
        />
        {termsUploadAvailable && (
          <input
            accept=".docx, .pdf"
            onChange={onFinalTermsFileInputChange}
            ref={finalTermsfileInputRef}
            type="file"
            className={style.hidden}
          />
        )}
      </div>
      {filesAvailableForUpload && (
        <div className={style.documentDropContainer}>{getFileUploadsInProgress(filesToUpload)}</div>
      )}
      <FileTable data={getTableData(userFiles || [])} loading={isLoading} />
      <input
        onChange={onRevisionFileInputChange}
        ref={revisionFileInputRef}
        accept=".docx, .pdf"
        type="file"
        className={style.hidden}
      />
      {openReviewModal && (
        <UserSelection
          options={getReviewers(usersList || [])}
          headerText={t("documents:Review Modal.Select Reviewer")}
          submitText={t("documents:Review Modal.Send for Review")}
          onSubmit={handleSendForReview}
          onClose={handleCloseReviewModal}
          open={openReviewModal}
          placeholder={t("documents:Review Modal.Select Users")}
        />
      )}
      {openSigningModal && (
        <UserSelection
          options={getSigners(usersList || [])}
          headerText={t("documents:Signer Modal.Select Users for Signature")}
          submitText={t("documents:Signer Modal.Send for Signature")}
          onSubmit={handleSendForSigning}
          onClose={handleCloseSigningModal}
          open={openSigningModal}
          multi
          placeholder={t("documents:Signer Modal.Select Signers")}
        />
      )}
      {openRenameModal && (
        <RenameDialog
          entry={entryToEdit}
          open={openRenameModal}
          onClose={() => setOpenRenameModal(false)}
          onSubmit={handleRenameConfirm}
        />
      )}
      <Dialog
        fullWidth
        open={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        maxWidth="lg"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className={style.docusign__modal}>
          {isFetchingDocusignURL ? (
            <LoadingIndicator />
          ) : (
            <iframe
              ref={iframeRef}
              src={docusignURL}
              title="docusignIframe"
              id="docusignIframe"
              className={style.docusign__iframe}
              display="initial"
              position="relative"
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        {/* <DialogTitle id="alert-dialog-title">{currentPreviewFile.fileName || 'Loading...'}</DialogTitle> */}
        <DialogContent className={style.docusign__modal}>
          {isFetchingPreviewFile ? (
            <LoadingIndicator />
          ) : (
            <iframe
              ref={iframeRef}
              src={currentPreviewFile.link}
              title="docusignIframe"
              id="docusignIframe"
              className={style.docusign__iframe}
              display="initial"
              position="relative"
            />
          )}
        </DialogContent>
      </Dialog>
      <AbsherAuthPromptDialog
        open={openAbsherAuthenticationPromptDialog}
        handleClose={() => setOpenAbsherAuthenticationPromptDialog(false)}
        absherURL={absherURL}
      />
      <AbsherAuthErrorDialog
        open={openAbsherAuthenticationErrorDialog}
        handleClose={() => setOpenAbsherAuthenticationErrorDialog(false)}
        absherURL={absherURL}
      />
    </div>
  );
};

Documents.propTypes = {};

Documents.defaultProps = {};

export default Documents;
