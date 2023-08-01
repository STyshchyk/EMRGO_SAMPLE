import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";

import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import TermsheetData from "../../../../components/TermsheetData";
import { useTheme } from "../../../../context/theme-context";
import * as documentActionCreators from "../../../../redux/actionCreators/documents";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as documentSelectors from "../../../../redux/selectors/documents";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import style from "./style.module.scss";

const ViewFinalTermsDocumentSection = ({ finalterms, isFetchingFinalterms }) => {
  const { t } = useTranslation(["termsheet", "documents"]);
  const currentPreviewFile = useSelector(documentSelectors.selectCurrentPreviewDocument);
  const docusignURL = useSelector(documentSelectors.selectDocusignURL);

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
            <Button id="finalize-button" disabled={true} variant="outlined" color="secondary">
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

          {finalterms?.document && !isFetchingFinalterms && (
            <Grid item>
              <Button
                color="primary"
                variant="text"
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

          {!finalterms?.document && !isFetchingFinalterms && (
            <Grid item>
              <Button
                startIcon={<CloudUploadIcon />}
                variant="contained"
                color="secondary"
                disabled={true}
              >
                {t("documents:Buttons.Upload")}
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

// * FIXME: Replace ReadOnlyInput component instances with the MUI version of read-only text input field

const TermsheetView = () => {
  const dispatch = useDispatch();
  const { issuanceID } = useParams();

  const { t } = useTranslation(["translation", "termsheet"]);
  const { theme } = useTheme();
  const { locale } = theme;

  // selectors
  const isFetchingTermsheetData = useSelector(issuanceSelectors.selectFetchingTermsheet);
  const termsheetInfoEn = useSelector(issuanceSelectors.selectTermsheetInfo);
  const termsheetInfoAr = useSelector(issuanceSelectors.selectTermsheetInfoAr);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetchingFinalterms = useSelector(issuanceSelectors.selectIsFetchingFinalterms);

  const termsheetInfo = locale.altLocale === "ar-sa" ? termsheetInfoAr : termsheetInfoEn;
  const entityType = currentEntityGroup?.entityType;
  const finalterms = useSelector(issuanceSelectors.selectFinalterms);

  useEffect(() => {
    const fetchFinalterms = (payload) =>
      dispatch(issuanceActionCreators.doFetchFinalterms(payload));
    if (issuanceID && entityType === "LEGAL_COUNSEL") {
      fetchFinalterms({
        sukukId: issuanceID,
      });
    }
  }, [dispatch, issuanceID, entityType]);

  useEffect(() => {
    const fetchDocusignUrl = (payload) =>
      dispatch(documentActionCreators.doFetchDocusignURL(payload));
    const requestPayload = { documentId: finalterms.document?.id, sukukId: issuanceID };

    if (entityType === "LEGAL_COUNSEL" && finalterms?.document?.id) {
      if (finalterms?.document?.status === "signed") {
        fetchDocusignUrl({
          requestPayload,
        });
      } else {
        dispatch(documentActionCreators.doPreviewFile({ documentId: finalterms?.document?.id }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, finalterms.document, entityType]);

  if (isFetchingTermsheetData) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      {entityType === "LEGAL_COUNSEL" && (
        <>
          <h3 style={{ background: "#d0d6e2", padding: "0.25em 0.5em", borderRadius: "5px" }}>
            {t("termsheet:Final Terms")}
          </h3>
          <ViewFinalTermsDocumentSection
            finalterms={finalterms}
            isFetchingFinalterms={isFetchingFinalterms}
          />
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
      <Grid container md={12} spacing={2} justifyContent="flex-end">
        {entityType === "ARRANGER" && (
          <Grid item>
            <Button
              id="save-button"
              disabled={true}
              variant="outlined"
              color="secondary"
              type="submit"
              className={style.button}
            >
              {t("termsheet:Save")}
            </Button>
          </Grid>
        )}

        {entityType === "LEGAL_COUNSEL" && (
          <Grid item>
            <Button id="review-button" disabled={true} variant="outlined" color="secondary">
              {t("termsheet:Send for Review")}
            </Button>
          </Grid>
        )}

        {(entityType === "ARRANGER" || entityType === "LEGAL_COUNSEL") && (
          <Grid item>
            <Button
              id="publish-button"
              variant="outlined"
              color="secondary"
              disabled={true}
              type="submit"
              className={style.button}
            >
              {t("termsheet:Publish")}
            </Button>
          </Grid>
        )}
      </Grid>
      <Box className={style.scroll}> {termsheetInfo && <TermsheetData data={termsheetInfo} />}</Box>{" "}
    </Fragment>
  );
};

export default TermsheetView;
