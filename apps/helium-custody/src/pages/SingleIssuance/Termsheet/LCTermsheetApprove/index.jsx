import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";
import { v4 as uuidv4 } from "uuid";

import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import * as documentActionCreators from "../../../../redux/actionCreators/documents";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as documentSelectors from "../../../../redux/selectors/documents";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import TermsheetEdit from "../TermsheetEdit";
import TermsheetView from "../TermsheetView";

const ViewFinalTermsDocumentSection = () => {
  const finalTermsfileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation(["termsheet", "documents"]);
  const { issuanceID } = useParams();
  const [documentId, setDocumentId] = useState(null);

  // selectors
  const finalterms = useSelector(issuanceSelectors.selectFinalterms);
  const isFetchingFinalterms = useSelector(issuanceSelectors.selectIsFetchingFinalterms);
  const { arrangerPublished } = useSelector(issuanceSelectors.selectTermsheetInfo);
  const hasFinalTerms = useSelector(documentSelectors.selectHasFinalTerms);
  const isProcessing = useSelector(documentSelectors.selectIsProcessing);
  const uploadStatus = useSelector(documentSelectors.selectUploadStatus);
  const currentPreviewFile = useSelector(documentSelectors.selectCurrentPreviewDocument);
  const docusignURL = useSelector(documentSelectors.selectDocusignURL);

  const isFinaltermsDocumentLinkAvailable = finalterms?.link ?? false;
  const isUploading = documentId && uploadStatus[documentId]?.isUploading;

  const handleFinalize = () => {
    // should be called when 1. arrangerPublished true and 2. isFinaltermsDocumentAvailable true
    const finalizeTermsheet = (payload) =>
      dispatch(issuanceActionCreators.doFinalizeTermsheet(payload));

    finalizeTermsheet({ sukukId: issuanceID });
  };

  const onFinalTermsFileInputChange = (event) => {
    const { files } = event.target;
    const file = files[0];
    const id = uuidv4();
    setDocumentId(id);

    const fileUploadLinkPayload = {
      fileListObj: file,
      displayName: file.name,
      originalFileName: file.name,
      category: "final_terms",
      contentType: file.type,
    };

    if (issuanceID) {
      fileUploadLinkPayload.sukukId = issuanceID;
    }

    const payload = {
      id,
      fileUploadLinkPayload,
      file,
      sukukId: issuanceID && issuanceID,
      isRevision: undefined,
      onSuccess: () => ({}),
    };

    dispatch(documentActionCreators.doUploadFile(payload));
  };

  const handleFinalTermsUploadClick = () => {
    finalTermsfileInputRef.current.value = null;
    finalTermsfileInputRef.current.click();
  };

  useEffect(() => {
    const fetchFinalterms = (payload) =>
      dispatch(issuanceActionCreators.doFetchFinalterms(payload));
    if (issuanceID) {
      fetchFinalterms({
        sukukId: issuanceID,
      });
    }
  }, [dispatch, issuanceID]);

  useEffect(() => {
    const fetchFinalterms = (payload) =>
      dispatch(issuanceActionCreators.doFetchFinalterms(payload));

    // to view the uploaded finalterms w/o refresh
    if (hasFinalTerms && !isProcessing) {
      fetchFinalterms({
        sukukId: issuanceID,
      });
    }
  }, [dispatch, issuanceID, hasFinalTerms, isProcessing]);

  useEffect(() => {
    const fetchDocusignUrl = (payload) =>
      dispatch(documentActionCreators.doFetchDocusignURL(payload));
    const requestPayload = { documentId: finalterms.document?.id, sukukId: issuanceID };

    if (finalterms?.document?.id) {
      if (finalterms?.document?.status === "signed") {
        fetchDocusignUrl({
          requestPayload,
        });
      } else {
        dispatch(documentActionCreators.doPreviewFile({ documentId: finalterms?.document?.id }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, finalterms.document]);

  if (isUploading) {
    return <LoadingPage />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        borderRadius: "5px",
      }}
    >
      <strong>{t("termsheet:Click here to view the Final Terms")}</strong>
      <div>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              id="finalize-button"
              disabled={!arrangerPublished || !isFinaltermsDocumentLinkAvailable}
              variant="outlined"
              color="secondary"
              onClick={handleFinalize}
            >
              {t("termsheet:Finalize")}
            </Button>
          </Grid>

          {isFetchingFinalterms && (
            <Grid item>
              <Button color="primary" variant="text">
                <strong>{t("termsheet:Fetching Final Terms Document")} </strong>
                <CircularProgress size={20} />
              </Button>
            </Grid>
          )}

          {!isFetchingFinalterms && !isFinaltermsDocumentLinkAvailable && (
            <>
              <Grid item>
                <Button
                  onClick={handleFinalTermsUploadClick}
                  startIcon={<CloudUploadIcon />}
                  variant="contained"
                  color="secondary"
                  style={{ width: "115px" }}
                >
                  {t("documents:Buttons.Upload")}
                </Button>
                <input
                  accept=".docx, .pdf"
                  onChange={onFinalTermsFileInputChange}
                  ref={finalTermsfileInputRef}
                  type="file"
                  style={{ display: "none" }}
                />
              </Grid>
            </>
          )}

          {!isFetchingFinalterms && finalterms?.document && isFinaltermsDocumentLinkAvailable && (
            <Grid item>
              <Button
                color="primary"
                variant="text"
                disabled={!isFinaltermsDocumentLinkAvailable}
                startIcon={
                  <Icon>
                    <DescriptionIcon />
                  </Icon>
                }
                component={Link}
                href={
                  finalterms?.document?.status === "signed" ? docusignURL : currentPreviewFile?.link
                }
                target="_blank"
                rel="noopener"
                data-testid="view-final-terms"
              >
                {t("termsheet:View Final Terms")}
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

const LCTermsheetApprove = () => {
  const { t } = useTranslation(["termsheet"]);
  const { arrangerPublished, arrangerReviewRequired } = useSelector(
    issuanceSelectors.selectTermsheetInfo
  );
  const providers = useSelector(issuanceSelectors.selectIssuanceOverviewProviders);
  const userId = useSelector(authSelectors.selectUserId);

  const currentHiredLegalCounsels = providers.filter(
    (provider) => provider?.name?.user?.id === userId
  );
  const hiredByEntityTypes = currentHiredLegalCounsels.map((el) => el?.hiredByEntityType);
  const isLCHiredByArranger = hiredByEntityTypes.includes("ARRANGER");

  return (
    <div
      style={{
        paddingBottom: "1rem",
        width: "100%",
      }}
    >
      {/* When legal counsel sends it for review its view only so remove final terms */}
      {!arrangerReviewRequired && isLCHiredByArranger && (
        <>
          <h3 style={{ background: "#d0d6e2", padding: "0.25em 0.5em", borderRadius: "5px" }}>
            {t("termsheet:Final Terms")}
          </h3>
          <ViewFinalTermsDocumentSection />
          <div
            style={{
              background: "#d0d6e2",
              borderRadius: "5px",
              marginBottom: "2rem",
              padding: "0.25em 0.5em",
              width: "100%",
            }}
          >
            <strong>
              {t(
                "termsheet:Please review the Issuance Terms below & confirm that each of them corresponds to those in the Final Terms"
              )}
            </strong>
          </div>
        </>
      )}

      {/* after arranger publishes it make it editable for the legal counsel */}
      {arrangerPublished && isLCHiredByArranger && <TermsheetEdit />}

      {/* if legal counsel sends it for review lock it to view only */}
      {(arrangerReviewRequired || !isLCHiredByArranger) && <TermsheetView />}
    </div>
  );
};

export default LCTermsheetApprove;
