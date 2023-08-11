import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Form, Formik } from "formik";
import useDeepCompareEffect from "use-deep-compare-effect";

import Button from "@mui/material/Button";
import Checkbox from "../../../components/Checkbox";
import FileUploadField from "../../../components/FileUploadField";
import InfoAlert from "../../../components/InfoAlert";
import LoadingPage from "../../../components/LoadingPage";
import PageTitle from "../../../components/PageTitle";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as issuanceSelectors from "../../../redux/selectors/issuance";


const SPEIncorporation = () => {
  const { issuanceID } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(["spe_incorporation"]);

  // selectors
  const capitalMarketAuthorityData = useSelector(
    issuanceSelectors.selectCapitalMarketAuthorityData
  );
  const capitalMarketAuthorityDocumentURLs = useSelector(
    issuanceSelectors.selectCapitalMarketAuthorityDocumentURLs
  );

  const isFetching = useSelector(issuanceSelectors.selectIsFetching);
  const isRequesting = useSelector(issuanceSelectors.selectIsRequesting);

  useEffect(() => {
    const fetchCMASPEIncorporationApprovalStatus = (payload) =>
      dispatch(issuanceActionCreators.doFetchCMASPEIncorporationApprovalStatus(payload));
    fetchCMASPEIncorporationApprovalStatus({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  useDeepCompareEffect(() => {
    const fetchCMADocumentURLs = (payload) =>
      dispatch(issuanceActionCreators.doFetchCMADocs(payload));

    if (!capitalMarketAuthorityDocumentURLs) {
      fetchCMADocumentURLs({
        sukukId: issuanceID,
      });
    }
  }, [capitalMarketAuthorityDocumentURLs, dispatch, issuanceID]);

  const tableData = [
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Application to Establish and License a Special Purpose Entity (AR-SA)"
      ),
      documentURL:
        capitalMarketAuthorityDocumentURLs?.applicationToEstablishAndLicenseASpecialPurposeEntityAR,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.By-laws of Special Purpose Entities (AR-SA)"
      ),
      documentURL: capitalMarketAuthorityDocumentURLs?.bylawsOfSpecialPurposeEntitiesAR,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Application to Register a Director of a Special Purpose Entity (AR-SA)"
      ),
      documentURL:
        capitalMarketAuthorityDocumentURLs?.applicationToRegisterADirectorOfASpecialPurposeEntityAR,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Appointment of Representatives for Sponsor of Special Purposes Entity (AR-SA)"
      ),
      documentURL: capitalMarketAuthorityDocumentURLs?.appointmentOfRepsForSponsorOfSPE_AR,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Appointment of Representatives for Sponsor of Special Purposes Entity (EN)"
      ),
      documentURL: capitalMarketAuthorityDocumentURLs?.appointmentOfRepsForSponsorOfSPE_EN,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Appointment of Representatives for Special Purposes Entity (AR-SA)"
      ),
      documentURL: capitalMarketAuthorityDocumentURLs?.appointmentOfRepsForSPE_AR,
    },
    {
      documentName: t(
        "SPEIncorporation.SPEDocumentsTable.rows.documents.Appointment of Representatives for Special Purposes Entity (EN)"
      ),
      documentURL: capitalMarketAuthorityDocumentURLs?.appointmentOfRepsForSPE_EN,
    },
  ];

  if (isFetching || isRequesting) {
    return <LoadingPage />;
  }

  const handleSingleFileUpload = ({ files, name }) => {
    const uploadCMARelatedDocument = (payload) =>
      dispatch(issuanceActionCreators.doUploadCMARelatedDoc(payload));

    const payload = {
      requestPayload: {
        capitalMarketAuthorityDocumentType: "special_purpose_entities_by-laws",
        originalFileName: files[0]?.name,
        name,
        fileName: files[0]?.name,
        sukukId: issuanceID,
      },
      file: files[0],
      keyName: name,
    };

    uploadCMARelatedDocument(payload);
  };

  return (
    <Fragment>
      <PageTitle title={t("SPEIncorporation.title")} />
      <p>{t("SPEIncorporation.promptMessage")}</p>

      <TableContainer
        style={{
          maxWidth: 1000,
          marginBottom: "rem",
        }}
      >
        <Table aria-label="spe-incorporation-table">
          <TableHead >
            <TableRow>
              <TableCell>
                {t("SPEIncorporation.SPEDocumentsTable.headers.Documents")}
              </TableCell>
              <TableCell>
                {t("SPEIncorporation.SPEDocumentsTable.headers.Download")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((rowData) => (
              <TableRow key={rowData.documentName}>
                <TableCell  component="th" scope="row">
                  {rowData.documentName}
                </TableCell>
                <TableCell >
                  {rowData.documentURL ? (
                    <IconButton
                      color="primary"
                      aria-label="download"
                      component="a"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={rowData.documentURL}
                      size="large"
                    >
                      <CloudDownloadOutlinedIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Formik
        initialValues={{
          capitalMarketAuthoritySPEIncorporationApprovalStatus:
            capitalMarketAuthorityData?.capitalMarketAuthoritySPEIncorporationApprovalStatus ??
            false,
          "special_purpose_entities_by-laws_doc_file": null,
        }}
        enableReinitialize
        onSubmit={(values, actions) => {
          const confirmCMASPEIncorporationApprovalStatus = (payload) =>
            dispatch(issuanceActionCreators.doConfirmCMASPEIncorporationApprovalStatus(payload));
          confirmCMASPEIncorporationApprovalStatus({
            sukukId: issuanceID,
            requestPayload: { ...values },
          });

          actions.resetForm();
        }}
      >
        {({ values }) => {
          // isValid formik prop is unreliable in Formik v2
          const isValid = values?.capitalMarketAuthoritySPEIncorporationApprovalStatus ?? false;

          return (
            <Form>
              <div
                style={{
                  margin: "1rem 0",
                }}
              >
                <FileUploadField
                  name="special_purpose_entities_by-laws_doc_file"
                  label={t(
                    "SPEIncorporation.ConfirmSPEEstablishmentAndLicensingForm.speByLawsfileUploadField.label"
                  )}
                  customHandleChange={(e) =>
                    handleSingleFileUpload({
                      files: e,
                      name: "special_purpose_entities_by-laws_doc_file",
                    })
                  }
                />
              </div>
              <Checkbox
                label={t("SPEIncorporation.ConfirmSPEEstablishmentAndLicensingForm.checkboxLabel")}
                name="capitalMarketAuthoritySPEIncorporationApprovalStatus"
                readOnly={
                  capitalMarketAuthorityData?.capitalMarketAuthoritySPEIncorporationApprovalStatus
                }
              />

              <div style={{ margin: "1rem 0" }}>
                {capitalMarketAuthorityData?.capitalMarketAuthoritySPEIncorporationApprovalStatus ? (
                  <InfoAlert
                    text={t("SPEIncorporation.ConfirmSPEEstablishmentAndLicensingForm.infoAlert")}
                  />
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    type="submit"
                    disabled={!isValid}
                  >
                    {t("SPEIncorporation.ConfirmSPEEstablishmentAndLicensingForm.submitButtonText")}
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default SPEIncorporation;
