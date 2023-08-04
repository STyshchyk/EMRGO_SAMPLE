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
import { makeStyles } from '@mui/styles';
import { Form, Formik } from "formik";

import Button from "@mui/material/Button";
import Checkbox from "../../../components/Checkbox";
import InfoAlert from "../../../components/InfoAlert";
import LoadingPage from "../../../components/LoadingPage";
import PageTitle from "../../../components/PageTitle";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    color: theme.palette.primary.main,
  },
  tableRow: {
    marginBottom: 0,
  },
  tableCell: {
    background: "white",
    borderBottom: "none",
    color: theme.palette.primary.main,
    fontSize: "1em",
    paddingTop: 0,
    paddingBottom: 0,
    height: "50px",
  },
  tableHeadCell: {
    borderBottom: "none",
    color: theme.palette.primary.main,
    fontSize: "1em",
    fontWeight: "bold",
    height: "50px",
  },
}));

const CMANotification = () => {
  const classes = useStyles();
  const { issuanceID } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(["cma_notification"]);

  const capitalMarketAuthorityData = useSelector(
    issuanceSelectors.selectCapitalMarketAuthorityData
  );
  const capitalMarketAuthorityDocumentURLs = useSelector(
    issuanceSelectors.selectCapitalMarketAuthorityDocumentURLs
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetching = useSelector(issuanceSelectors.selectIsFetching);
  const isRequesting = useSelector(issuanceSelectors.selectIsRequesting);

  const hasCMAManageAccessControl = currentEntityGroup?.accessControls?.some(
    (acl) => acl?.key === "CMA/Manage"
  );

  useEffect(() => {
    const fetchCMAIssuanceApprovalStatus = (payload) =>
      dispatch(issuanceActionCreators.doFetchCMAIssuanceApprovalStatus(payload));
    fetchCMAIssuanceApprovalStatus({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  useEffect(() => {
    const fetchCMADocumentURLs = (payload) =>
      dispatch(issuanceActionCreators.doFetchCMADocs(payload));
    fetchCMADocumentURLs({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  const tableData = [
    {
      documentName: t("CMANotification.CMADocumentsTable.rows.documents.Offering Documents"),
      party: t("CMANotification.CMADocumentsTable.Users.Arranger"),
      documentURL: null,
    },
    {
      documentName: t("CMANotification.CMADocumentsTable.rows.documents.Arranger's Notification"),
      party: t("CMANotification.CMADocumentsTable.Users.Arranger"),
      documentURL: null,
    },
    {
      documentName: t("CMANotification.CMADocumentsTable.rows.documents.Offeror's Notification"),
      party: t("CMANotification.CMADocumentsTable.Users.Arranger"),
      documentURL: capitalMarketAuthorityDocumentURLs?.offerorsNotification,
    },
    {
      documentName: t("CMANotification.CMADocumentsTable.rows.documents.Arranger's Declaration"),
      party: t("CMANotification.CMADocumentsTable.Users.Arranger"),
      documentURL: capitalMarketAuthorityDocumentURLs?.capitalMarketInstitutionsDeclaration,
    },
    {
      documentName: t("CMANotification.CMADocumentsTable.rows.documents.Sponsor's Declaration"),
      party: t("CMANotification.CMADocumentsTable.Users.Obligor (Sponsor)"),
      documentURL: capitalMarketAuthorityDocumentURLs?.sponsorsDeclaration,
    },
    {
      documentName: t(
        "CMANotification.CMADocumentsTable.rows.documents.Application for Approval of a Financing Transaction"
      ),
      party: t("CMANotification.CMADocumentsTable.Users.Obligor (Sponsor)"),
      documentURL:
        capitalMarketAuthorityDocumentURLs?.applicationForApprovalOfAFinancingTransaction,
    },
    {
      documentName: t(
        "CMANotification.CMADocumentsTable.rows.documents.Application for Approval of a Financing Transaction (AR-SA)"
      ),
      party: t("CMANotification.CMADocumentsTable.Users.Obligor (Sponsor)"),
      documentURL:
        capitalMarketAuthorityDocumentURLs?.applicationForApprovalOfAFinancingTransactionAR,
    },
  ];

  if (isFetching || isRequesting) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <PageTitle title={t("CMANotification.title")} />
      <p>{t("CMANotification.promptMessage")}</p>

      <TableContainer
        style={{
          maxWidth: 1000,
          marginBottom: "1rem",
        }}
      >
        <Table className={classes.table} aria-label="cma-notification-table">
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell className={classes.tableHeadCell}>
                {t("CMANotification.CMADocumentsTable.headers.Documents")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {t("CMANotification.CMADocumentsTable.headers.Related Parties")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {t("CMANotification.CMADocumentsTable.headers.Download")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((rowData) => (
              <TableRow key={rowData.documentName}>
                <TableCell className={classes.tableCell} component="th" scope="row">
                  {rowData.documentName}
                </TableCell>
                <TableCell className={classes.tableCell}>{rowData.party}</TableCell>
                <TableCell className={classes.tableCell}>
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
          capitalMarketAuthorityIssuanceApprovalStatus:
            capitalMarketAuthorityData?.capitalMarketAuthorityIssuanceApprovalStatus ?? false,
        }}
        enableReinitialize
        onSubmit={(values, actions) => {
          const confirmCMAIssuanceApprovalStatus = (payload) =>
            dispatch(issuanceActionCreators.doConfirmCMAIssuanceApprovalStatus(payload));
          confirmCMAIssuanceApprovalStatus({
            sukukId: issuanceID,
            requestPayload: { ...values },
          });
          actions.resetForm();
        }}
      >
        {({ values }) => {
          // isValid formik prop is unreliable in Formik v2
          const isValid = values?.capitalMarketAuthorityIssuanceApprovalStatus ?? false;

          return (
            <Fragment>
              {hasCMAManageAccessControl && (
                <Form>
                  <h3>{t("CMANotification.ConfirmSuccessfulNotificationForm.title")}</h3>
                  <Checkbox
                    label={t("CMANotification.ConfirmSuccessfulNotificationForm.checkboxLabel")}
                    name="capitalMarketAuthorityIssuanceApprovalStatus"
                    readOnly={
                      capitalMarketAuthorityData?.capitalMarketAuthorityIssuanceApprovalStatus
                    }
                  />
                  <div style={{ margin: "1rem 0" }}>
                    {capitalMarketAuthorityData?.capitalMarketAuthorityIssuanceApprovalStatus ? (
                      <InfoAlert
                        text={t("CMANotification.ConfirmSuccessfulNotificationForm.infoAlert")}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        type="submit"
                        disabled={!isValid}
                      >
                        {t("CMANotification.ConfirmSuccessfulNotificationForm.submitButtonText")}
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Fragment>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default CMANotification;
