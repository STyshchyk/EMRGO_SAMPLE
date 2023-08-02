import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import MaterialTable from "@material-table/core";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import accessControlsList from "../../../../constants/accessControlsList";
import { dateRenderer } from "../../../../constants/paymentAndStatuses/renderers";
import regionSwitcher from "../../../../helpers/regions";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as documentActionCreators from "../../../../redux/actionCreators/documents";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import DocumentSettingsDialog from "./DocumentSettingsDialog";
import MarkFileVerifiedDialog from "./MarkFileVerifiedDialog";
import ModifyDocumentFormDialog from "./ModifyDocumentFormDialog";
import OpenPreviewDocumentDialog from "./PreviewDocumentDialog";
import RequestRevisedFileDialog from "./RequestRevisedFileDialog";
import UploadKYCDocumentFormDialog from "./UploadDocumentFormDialog";

const Documents = () => {
  const mtableLocalization = useMaterialTableLocalization();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openUploadDocumentFormDialog, setOpenUploadDocumentFormDialog] = useState(false);
  const [openPreviewDocumentDialog, setOpenPreviewDocumentDialog] = useState(false);
  const [openDocumentSettingsDialog, setOpenDocumentSettingsDialog] = useState(false);
  const [requestRevisedFileModalOpen, setRequestRevisedFileModalOpen] = useState(false);
  const [markFileVerifiedModalOpen, setMarkFileVerifiedModalOpen] = useState(false);
  const { entityId } = useParams();
  const { t } = useTranslation(["documents"]);
  // const { t } = useTranslation(['translation', 'kyc']);
  const dispatch = useDispatch();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const userId = useSelector(authSelectors.selectUserId);
  const currentEntityGroupID = currentEntityGroup?.id;
  const kycData = useSelector(kycSelectors.selectKYCData);
  const isFetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);

  const kycSupportingDocuments = kycData?.supportingDocuments ?? [];

  const isUploader = selectedRow?.uploadedById === userId;
  const isVerified = selectedRow?.status === "Verified";
  const isRelationshipManager = currentEntityGroup?.accessControls?.some(
    (acl) => acl?.key === accessControlsList.RELATIONSHIP.view.key
  );
  const isWethaqService = currentEntityGroup?.entityType === "EMRGO_SERVICES";

  const processSharedUsers = (permission) => {
    const shared = [];

    if (permission.relationshipManager) {
      shared.push(" RM ");
    }

    if (permission.compliance) {
      shared.push(" Compliance ");
    }

    if (permission.client) {
      shared.push(" Client ");
    }

    return shared.toString();
  };

  const documents = [
    regionSwitcher({
      sa: {
        label: t("documents:Documents.HNWI KYC Form"),
        link: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents%2Fhnwi_kyc_form.docx",
      },
      ae: null,
    }),
    {
      label: t("documents:Documents.FATCA Form"),
      link: regionSwitcher({
        sa: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents/fatca_form.pdf",
        ae: "https://wethaq-assets.s3.ap-south-1.amazonaws.com/documents/fatca_form.pdf",
      }),
    },
    {
      label: t("documents:Documents.Wolfsberg Form"),
      link: regionSwitcher({
        sa: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents/sa_wolfsberg.pdf",
        ae: "https://wethaq-assets.s3.ap-south-1.amazonaws.com/documents/wolfsberg.pdf",
      }),
    },
    {
      label: t("documents:Documents.CRS Self-Assessmemt"),
      link: regionSwitcher({
        sa: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents/sa_crs_self_assessment.docx",
        ae: "https://wethaq-assets.s3.ap-south-1.amazonaws.com/documents/crs_self_assessment.docx",
      }),
    },
    {
      label: t("documents:Documents.Corporate Authorisation"),
      link: regionSwitcher({
        sa: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents/corporate_authorization.pdf",
        ae: "https://wethaq-assets.s3.ap-south-1.amazonaws.com/documents/corporate_authorization.pdf",
      }),
    },
  ];

  const tableData = kycSupportingDocuments.map((i) => ({
    id: i.id,
    name: i.name,
    status: i.status,
    expiry: i.expiry,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
    permissions: i.permission,
    uploadedById: i.uploadedById,
    shared: processSharedUsers(i.permission),
    documentObject: {
      name: i.name,
      fileName: i.fileName.name,
      link: i.fileName.link,
    },
  }));

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchKYCData = (payload) => dispatch(kycActionCreators.doFetchKYCData(payload));

    fetchKYCData({
      entityId,
      requestPayload: {
        keys: ["supportingDocuments"],
        sectionChanges: "documents",
        includeSignedUrl: true,
      },
    });
  }, [dispatch, entityId, currentEntityGroupID]);

  if (isFetchingKYCData) {
    return <LoadingPage />;
  }

  const handlePreviewDocumentClick = () => {
    setMenuAnchorEl(null);
    setOpenPreviewDocumentDialog(true);
  };

  const handleDownloadDocumentClick = () => {
    setMenuAnchorEl(null);
    const link = document.createElement("a");
    link.href = selectedRow?.documentObject?.link;
    link.download = "yourFileName";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRequestRevisedDocumentClick = () => {
    setMenuAnchorEl(null);
    setRequestRevisedFileModalOpen(true);
  };

  const requestRevisedFile = (payload) => {
    const kycFetchPayload = {
      entityId,
      requestPayload: {
        keys: ["supportingDocuments"],
        sectionChanges: "documents",
        includeSignedUrl: true,
      },
    };

    const requestPayload = {
      kycFetchPayload,
      payload,
    };
    dispatch(documentActionCreators.doDocumentUploadRequest(requestPayload));
    setRequestRevisedFileModalOpen(false);
  };

  const handleDocumentInfoClick = () => {
    setMenuAnchorEl(null);
    // setOpenPreviewDocumentDialog(true);
  };

  const handleDocumentSettingsClick = () => {
    setMenuAnchorEl(null);
    setOpenDocumentSettingsDialog(true);
  };

  const handleMarkDocumentVerifiedClick = () => {
    setMenuAnchorEl(null);
    setMarkFileVerifiedModalOpen(true);
  };

  const markFileAsRevised = (payload) => {
    const kycFetchPayload = {
      entityId,
      requestPayload: {
        keys: ["supportingDocuments"],
        sectionChanges: "documents",
        includeSignedUrl: true,
      },
    };

    const requestPayload = {
      kycFetchPayload,
      payload,
    };

    dispatch(documentActionCreators.doDocumentMarkObtained(requestPayload));
    setMarkFileVerifiedModalOpen(false);
  };

  const updateDocumentPermissions = (payload) => {
    setMenuAnchorEl(null);
    setOpenDocumentSettingsDialog(false);
    const kycFetchPayload = {
      entityId,
      requestPayload: {
        keys: ["supportingDocuments"],
        sectionChanges: "documents",
        includeSignedUrl: true,
      },
    };

    const requestPayload = {
      kycFetchPayload,
      payload,
    };

    dispatch(documentActionCreators.doUpdateDocumentPermissions(requestPayload));
  };

  const actions = [
    {
      callback: handlePreviewDocumentClick,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("documents:Context Menu.Preview"),
    },
    {
      callback: handleDownloadDocumentClick,
      icon: <CloudDownloadIcon fontSize="small" />,
      label: t("documents:Context Menu.Download"),
    },
    {
      callback: handleDownloadDocumentClick,
      icon: <CloudUploadIcon fontSize="small" />,
      label: t("documents:Context Menu.Upload Revised Document"),
      hidden: !isUploader,
    },
    {
      callback: handleRequestRevisedDocumentClick,
      icon: <PlaylistAddIcon fontSize="small" />,
      label: t("documents:Context Menu.Request Revised Document"),
      hidden: isUploader,
      disabled: isVerified,
    },
    {
      callback: handleDocumentInfoClick,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("documents:Context Menu.Document Information"),
      disabled: true,
    },
    {
      callback: handleDocumentSettingsClick,
      icon: <SettingsIcon fontSize="small" />,
      label: t("documents:Context Menu.Document Settings"),
      hidden: !isUploader,
    },
    {
      callback: handleMarkDocumentVerifiedClick,
      icon: <DoneAllIcon fontSize="small" />,
      label: t("documents:Context Menu.Mark obtained/verified"),
      disabled: isVerified,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle title={t("documents:Supporting Documents")} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t("documents:Please upload certified copies of the requested documents")}.
          </Typography>
          <Typography variant="subtitle2">
            {t("documents:We accept documents in English and alternatively in Arabic")}.
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} container justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => setOpenUploadDocumentFormDialog(true)}
            startIcon={<CloudUploadIcon />}
          >
            {t("documents:Buttons.Upload")}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MaterialTable
          size="small"
          title=""
          columns={[
            {
              title: t("documents:Headers.Document Name"),
              field: "name",
              width: 150,
            },
            {
              title: "Shared",
              field: "shared",
              width: 100,
            },
            {
              title: "Expiry",
              field: "expiry",
              width: 100,
              render: (rowData) => dateRenderer(rowData.expiry),
            },
            {
              title: t("documents:Headers.Status"),
              field: "status",
              width: 50,
            },
          ]}
          data={tableData}
          options={{
            ...tableStyles,
            searchFieldVariant: "filled",
            pageSize: 10,
            tableLayout: "fixed",
            toolbar: false,
            paging: false,
            actionsColumnIndex: -1,
          }}
          actions={[
            {
              icon: "more_vert",
              onClick: (event, rowData) => {
                setMenuAnchorEl(event.currentTarget);
                setSelectedRow(rowData);
              },
            },
          ]}
          localization={mtableLocalization}
        />
        <MaterialTableOverflowMenu
          actions={actions}
          anchorEl={menuAnchorEl}
          setAnchorEl={setMenuAnchorEl}
          selectedRow={selectedRow}
        />
      </Grid>
      <Grid item xs={12}>
        <Box className="pt-24">
          <Typography variant="body1" className="font-bold">
            {t("documents:Document Templates")}
          </Typography>
          <Typography variant="subtitle2">
            {t("documents:If Applicable, to be completed and uploaded above")}.
          </Typography>
          <Box className="mt-4" />
          {documents
            .filter((doc) => doc !== null)
            .map((doc) => (
              <Typography className="font-bold">
                <Link href={doc.link} target="_blank" rel="noreferrer">
                  {doc.label}
                </Link>
              </Typography>
            ))}
        </Box>
      </Grid>
      <UploadKYCDocumentFormDialog
        open={openUploadDocumentFormDialog}
        handleClose={() => {
          setOpenUploadDocumentFormDialog(false);
        }}
      />
      {/* <ModifyDocumentFormDialog
        initialValues={{
          name: selectedRow?.name,
          supportingDocumentFileName: selectedRow?.documentObject,
          expiry: selectedRow?.expiry,
        }}
        documentId={selectedRow?.id}
        entityId={entityId}
        open={openUploadDocumentFormDialog}
        handleClose={() => {
          setOpenUploadDocumentFormDialog(false);
        }}
      /> */}
      <OpenPreviewDocumentDialog
        documentObject={selectedRow?.documentObject}
        open={openPreviewDocumentDialog}
        handleClose={() => {
          setOpenPreviewDocumentDialog(false);
        }}
      />
      <DocumentSettingsDialog
        selectedRow={selectedRow}
        open={openDocumentSettingsDialog}
        updateDocumentPermissions={updateDocumentPermissions}
        isRelationshipManager={isRelationshipManager}
        isWethaqService={isWethaqService}
        handleClose={() => {
          setOpenDocumentSettingsDialog(false);
        }}
      />
      <RequestRevisedFileDialog
        selectedRow={selectedRow}
        open={requestRevisedFileModalOpen}
        onClose={() => {
          setRequestRevisedFileModalOpen(false);
        }}
        requestRevisedFile={requestRevisedFile}
      />
      <MarkFileVerifiedDialog
        selectedRow={selectedRow}
        open={markFileVerifiedModalOpen}
        onClose={() => {
          setMarkFileVerifiedModalOpen(false);
        }}
        markFileAsRevised={markFileAsRevised}
      />
    </Grid>
  );
};

export default Documents;
