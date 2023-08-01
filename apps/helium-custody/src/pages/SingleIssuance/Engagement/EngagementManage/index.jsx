import { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import cx from "classnames";
import { Form, Formik } from "formik";
import useDeepCompareEffect from "use-deep-compare-effect";

import appConfig from "../../../../appConfig";
import AbsherAuthErrorDialog from "../../../../components/AbsherAuthErrorDialog";
import AbsherAuthPromptDialog from "../../../../components/AbsherAuthPromptDialog";
import Button from "../../../../components/Button";
import FileUploadField from "../../../../components/FileUploadField";
import LoadingPage from "../../../../components/LoadingPage";
import engagementStatus, {
  statusTextMap,
} from "../../../../constants/status/serviceProviderEnagement";
import useAbsherRedirectURLHandler from "../../../../hooks/useAbsherRedirectURLHandler";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import buildElmAuthAPIURL from "../../../../utils/buildElmAuthAPIURL";
import style from "./style.module.scss";

const EngagementManage = () => {
  const iframeRef = createRef();
  const dispatch = useDispatch();
  const { t } = useTranslation(["engagement_manage", "auth"]);
  // const [currentLoadCount, setCurrentLoadCount] = useState(0);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isUploadingSignedEngagement, setIsUploadingSignedEngagement] = useState(false);
  const { issuanceID } = useParams();
  const [openAbsherAuthenticationPromptDialog, setOpenAbsherAuthenticationPromptDialog] =
    useState(false);
  const [openAbsherAuthenticationErrorDialog, setOpenAbsherAuthenticationErrorDialog] =
    useState(false);
  const [absherURL, setAbsherURL] = useState(null);
  const windowLocation = window.location;
  const location = useLocation();

  // selectors
  const areEngagementDocumentsUploading = useSelector(
    issuanceSelectors.selectAreEngagementDocumentsUploading
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const engagementLetterUrl = useSelector(issuanceSelectors.selectEngagementLetterUrl);
  const isFetchingEngagementRequests = useSelector(
    issuanceSelectors.selectFetchingEngagementRequests
  );
  const isRequesting = useSelector(issuanceSelectors.selectIsRequesting);
  const requests = useSelector(issuanceSelectors.selectEngagementRequests);
  const isFetchingLetterUrl = useSelector(issuanceSelectors.selectIsFetchingLetterUrl);
  const hasSubmittedBypassSignedEnagagement = useSelector(
    issuanceSelectors.selectHasSubmittedBypassSignedEngagement
  );
  const isSubmittingBypassSignedEngagement = useSelector(
    issuanceSelectors.selectIsSubmittingBypassSignedEngagement
  );

  const currentDocusignURL = engagementLetterUrl?.url;

  const absherAuthenticationStateObject = useAbsherRedirectURLHandler();

  useDeepCompareEffect(() => {
    if (absherAuthenticationStateObject.status === "success") {
      const fetchEngagementRequests = (payload) =>
        dispatch(issuanceActionCreators.doFetchEngagementRequests(payload));
      const fetchEngagementLetterURL = (payload) =>
        dispatch(issuanceActionCreators.doFetchEngagementLetterUrl(payload));
      const { engagementId, transactionId } = absherAuthenticationStateObject.queryParamsObject;

      fetchEngagementLetterURL({
        requestPayload: { engagementId, transactionId, sukukId: issuanceID },
        successCallback: () => {
          fetchEngagementRequests({});
          setIsSignatureModalOpen(true);
        },
      });

      setAbsherURL(null);
    }

    if (absherAuthenticationStateObject.status === "error") {
      setOpenAbsherAuthenticationErrorDialog(true);
    }
  }, [absherAuthenticationStateObject, dispatch, issuanceID]);

  useEffect(() => {
    const fetchEngagementRequests = (payload) =>
      dispatch(issuanceActionCreators.doFetchEngagementRequests(payload));

    fetchEngagementRequests({});
  }, [currentEntityGroupID, dispatch]);

  const handleIframeLoad = () => {
    toast.dismiss();

    // if (currentLoadCount < 1) {
    //   setCurrentLoadCount(currentLoadCount + 1);
    // } else {
    //   setIsSignatureModalOpen(false);
    //   setCurrentLoadCount(0);
    // }
  };

  const handleIframeTask = (e) => {
    if (e.data === "Close Modal") {
      setIsSignatureModalOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleIframeTask);

    return () => window.removeEventListener("message", handleIframeTask);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendForSignature = (enabled, engagementId, sukukId) => {
    if (!enabled) return;
    const requestSignature = (payload) =>
      dispatch(issuanceActionCreators.doRequestSignature(payload));
    requestSignature({ engagementId, sukukId });
  };

  const handleSubmittingSignedEngagement = (engagementId, sukukId) => {
    setIsUploadingSignedEngagement(true);
    const fetchEngagementLetterURL = (payload) =>
      dispatch(issuanceActionCreators.doFetchEngagementLetterUrl(payload));
    const submitSignedEngagement = (payload) =>
      dispatch(issuanceActionCreators.doSubmitBypassSignedEngagement(payload));
    const fetchEngagementRequests = (payload) =>
      dispatch(issuanceActionCreators.doFetchEngagementRequests(payload));

    const submitSignedEngagementPayload = {
      requestPayload: { engagementId, sukukId },
      successCallback: () => {
        fetchEngagementLetterURL({ requestPayload: { engagementId, sukukId } });

        fetchEngagementRequests({});

        setIsUploadingSignedEngagement(false);
      },
    };

    submitSignedEngagement(submitSignedEngagementPayload);
  };

  const handleUploadEngagementLetter = (files, engagementId, sukukId) => {
    if (!files.length) return;

    if (!files[0]?.file?.name) {
      return;
    }

    const uploadEngagementLetter = (payload) =>
      dispatch(issuanceActionCreators.doUploadEngagementLetter(payload));

    uploadEngagementLetter({
      sukukId,
      engagementId,
      requestPayload: {
        engagementLetter: files[0].file,
        originalFileName: files[0].file.name,
        contentType: files[0].file.type,
      },
    });
  };

  const getEngagementRows = (engagementRequests) => {
    const rows = [];

    // 1. Normal flow - status changes from requested => uploaded => sent => signed => countersigned
    // 2. LC shortcircuit - first send eng request then file is uploaded, bypass api is triggered using Upload Documeent button,
    //    status changes from requested => uploaded => countersigned
    // 3. ARR shortcircuit - status directly jumps to CounterSigned, upload a file, click on bypass api btn.
    // shouldCountersign default is false for normal and lc shortcircuit, shouldCountersign set to true when arr shortcircuit uses the finalize
    // engagement api and shouldCountersign is again set to false once bypass api is used for both the shortcircuits.

    engagementRequests
      .filter(
        (e) => e.sukukId === issuanceID && (e.status !== "CounterSigned" || e.shouldCountersign)
      ) // for the 2 new short-circuits
      .forEach((engagementRequest) => {
        const { status, sukukId, id } = engagementRequest;
        const enableSendForSignature = status && engagementStatus[status] === 2;
        const enableCounterSign = status && engagementStatus[status] > 4;
        const isAbsherAuthenticationRequired =
          appConfig.appRegion === "SA" && status && engagementStatus[status] === 5;
        // to stop from uploading new file once Upload Button is clicked//sent for signature or signed.
        const isSentForSignatureOrSigned =
          status && (engagementStatus[status] === 4 || engagementStatus[status] === 5);
        const enableUploadDocument = engagementRequest.engagementFileId !== "";

        const documentsInitialValues = {};
        const documentName = `document_${engagementRequest.id}`;
        documentsInitialValues[documentName] = engagementRequest.engagementFileId || "";

        rows.push(
          <tr key={engagementRequest.id} className={style.dataRow}>
            <td>{engagementRequest?.hiredByEntityGroup?.name}</td>
            <td>{engagementRequest?.sukuk?.name}</td>
            <td>{t(`engagement_manage:Status.${statusTextMap[engagementRequest.status]}`)}</td>

            <td colSpan={3} className={style.actionItems}>
              <Formik
                initialValues={documentsInitialValues}
                enableReinitialize
                onSubmit={(values) => {
                  const { files } = values[`document_${engagementRequest.id}`];
                  handleUploadEngagementLetter(files, id, sukukId);
                  // if upload document button isn't used for triggering bypass api for arr shortcircuit
                  // if (engagementRequest.status === 'CounterSigned' && engagementRequest.engagementFileId) {
                  //   handleSubmittingSignedEngagement(id, sukukId);
                  // }
                }}
              >
                {({ handleSubmit }) => (
                  <Form
                    key={`${engagementRequest.id}_form`}
                    onSubmit={handleSubmit}
                    className={cx(style.formWrapper)}
                    noValidate
                  >
                    <FileUploadField
                      key={`${engagementRequest.id}_form_upload`}
                      acceptableFileTypes=".pdf"
                      id={engagementRequest.id}
                      className={style.uploadBox}
                      name={`document_${engagementRequest.id}`}
                      customHandleChange={handleSubmit}
                      defaultFiles={
                        engagementRequest.engagementFileId
                          ? [{ file: { name: engagementRequest.engagementFileId } }]
                          : null
                      }
                      isLoading={areEngagementDocumentsUploading[engagementRequest.id]}
                      downloadParameters={{
                        type: "engagement",
                        documentName: engagementRequest.engagementFileId,
                        sukukId,
                      }}
                      disabledProps={isUploadingSignedEngagement || isSentForSignatureOrSigned} // BE restriction disabled for ARR/OBL/ISS shortcircuit
                    />
                  </Form>
                )}
              </Formik>

              {appConfig.appRegion === "SA" && (
                <Button
                  onClick={() => handleSubmittingSignedEngagement(id, sukukId)}
                  disabled={
                    !enableUploadDocument ||
                    isRequesting ||
                    hasSubmittedBypassSignedEnagagement ||
                    isSentForSignatureOrSigned
                  }
                  data-testid="bypass-signed-btn"
                >
                  <span className="btn-text">{t("engagement_manage:Buttons.Upload Document")}</span>
                </Button>
              )}

              <Button
                onClick={() => handleSendForSignature(enableSendForSignature, id, sukukId)}
                disabled={
                  !enableSendForSignature || isRequesting || hasSubmittedBypassSignedEnagagement
                }
                data-testid="signature-btn"
              >
                <span className="btn-text">
                  {t("engagement_manage:Buttons.Send For Signature")}
                </span>
              </Button>

              <Button
                disabled={
                  isSentForSignatureOrSigned
                    ? !enableCounterSign
                    : engagementRequest.status !== "CounterSigned" ||
                      engagementRequest.shouldCountersign
                } // if lc uploads signed eng allow to view the eng letter
                onClick={() => {
                  if (!isUploadingSignedEngagement && !enableCounterSign) return;

                  // check for absher if lc hasn't uploaded a signed engagement
                  if (isAbsherAuthenticationRequired && !hasSubmittedBypassSignedEnagagement) {
                    const redirectURL = new URL(`${windowLocation.origin}${location.pathname}`);
                    redirectURL.searchParams.append("state", "success");
                    redirectURL.searchParams.append("engagementId", `${id}`);

                    const newElmAuthURL = buildElmAuthAPIURL(
                      redirectURL.href,
                      `${windowLocation.origin}${location.pathname}?state=error`,
                      currentEntityGroupID
                    );
                    setAbsherURL(newElmAuthURL);
                    setOpenAbsherAuthenticationPromptDialog(true);
                  } else {
                    const fetchEngagementLetterURL = (payload) =>
                      dispatch(issuanceActionCreators.doFetchEngagementLetterUrl(payload));
                    fetchEngagementLetterURL({
                      requestPayload: { engagementId: id, sukukId },
                      successCallback: () => {
                        setIsSignatureModalOpen(true);
                      },
                    });
                  }
                }}
              >
                <span className="btn-text">{t("engagement_manage:Buttons.Engagement Letter")}</span>
              </Button>
            </td>
          </tr>
        );
      });

    return rows;
  };

  if (isFetchingEngagementRequests || isFetchingLetterUrl || isSubmittingBypassSignedEngagement) {
    return <LoadingPage />;
  }
  return (
    <div>
      <h3>{t("engagement_manage:Engagement Requests")}</h3>
      {!!requests?.length && (
        <table className={style.dataTable}>
          <thead>
            <tr className={style.heading}>
              <th>{t("engagement_manage:Headers.Entity Group")}</th>
              <th>{t("engagement_manage:Headers.Security Title")}</th>
              <th>{t("engagement_manage:Headers.Status")}</th>
            </tr>
          </thead>
          <tbody>{getEngagementRows(requests)}</tbody>
        </table>
      )}
      <Dialog
        fullWidth
        open={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        maxWidth="lg"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className={style.docusign__modal}>
          <iframe
            ref={iframeRef}
            src={currentDocusignURL}
            onLoad={handleIframeLoad}
            title="docusignIframe"
            id="docusignIframe"
            className={style.docusign__iframe}
            display="initial"
            position="relative"
          />
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

export default EngagementManage;
