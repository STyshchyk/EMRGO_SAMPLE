import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";

import AddEquitySecurityDialog from "../../../components/AddEquitySecurityDialog";
import AddSecurityDialog from "../../../components/AddSecurityDialog";
import AmendPrimaryIssuanceSecurityDialog from "../../../components/AmendPrimaryIssuanceSecurityDialog";
import EditCouponPaymentScheduleDialog from "../../../components/EditCouponPaymentScheduleDialog";
import ExternalSecuritiesTable, {
  generateExternalSecuritiesListTableRowData,
} from "../../../components/ExternalSecuritiesTable";
import LoadingPage from "../../../components/LoadingPage";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as externalSecuritiesActionCreators from "../../../redux/actionCreators/externalSecurities";
import * as authSelectors from "../../../redux/selectors/auth";
import * as dropdownSelectors from "../../../redux/selectors/dropdown";
import * as externalSecuritiesSelectors from "../../../redux/selectors/externalSecurities";
import { dateFormatter } from "../../../utils/formatter";
import useIsProduction from "../../../utils/useIsProduction";

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";

const ExternalSecuritiesList = () => {
  const dispatch = useDispatch();

  const inProd = useIsProduction();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScheduleAdded, setIsScheduleAdded] = useState(false);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openAddSecurityDialog, setOpenAddSecurityDialog] = useState(false);
  const [openEditCouponPaymentScheduleDialog, setOpenEditCouponPaymentScheduleDialog] =
    useState(false);
  const [openAmendPrimaryIssuanceSecurityDialog, setOpenAmendPrimaryIssuanceSecurityDialog] =
    useState(false);
  const [openAddEquitySecurityDialog, setOpenAddEquitySecurityDialog] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListofAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const isRequesting = useSelector(externalSecuritiesSelectors.selectIsRequesting);
  const isFetching = useSelector(externalSecuritiesSelectors.selectIsFetching);
  const externalSecuritiesList = useSelector(
    externalSecuritiesSelectors.selectExternalSecuritiesList
  );
  const allExternalSecurities = useSelector(
    externalSecuritiesSelectors.selectAllExternalSecurities
  );

  const currentEntityGroupID = currentEntityGroup?.id;
  const generatedTableData = allExternalSecurities?.map((i) =>
    generateExternalSecuritiesListTableRowData(i)
  );

  const hasManageSecurityServicesACL = currentListofAcls.includes("Services/Security/Manage");

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchExternalSecuritiesList = () =>
    dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const buildRequestPayload = (values) => {
    const requestPayload = { ...values };

    // const dateFields = ['issueDate', 'maturityDate'];

    // dateFields.forEach((field) => {
    //   if (requestPayload[field]) {
    //     requestPayload[field] = dateFormatter(requestPayload[field], DEFAULT_DATE_FORMAT);
    //   }
    // });

    requestPayload.profitRate = parseFloat(requestPayload.profitRate, 10);

    return requestPayload;
  };

  const handleEquitySecStatusChange = (selectedRow, status) => {
    const editEquityExternalSecurity = (payload) =>
      dispatch(externalSecuritiesActionCreators.doAddEquityExternalSecurities(payload));
    const externalSecurityItem = externalSecuritiesList?.find(({ id }) => selectedRow?.id === id);
    const requestPayload = buildRequestPayload(externalSecurityItem);
    requestPayload.externalSecurityId = selectedRow?.id;
    requestPayload.status = status;

    editEquityExternalSecurity({
      requestPayload,
      successCallback: () => {
        fetchExternalSecuritiesList();
        handleCloseMenu();
      },
    });
  };

  const handleStatus = (selectedRow, status) => {
    const editExternalSecurities = (payload) =>
      dispatch(externalSecuritiesActionCreators.doEditExternalSecurities(payload));
    const externalSecuritiesInfo = externalSecuritiesList?.find(({ id }) => selectedRow?.id === id);

    const requestPayload = buildRequestPayload(externalSecuritiesInfo);
    requestPayload.externalSecuritiesId = selectedRow?.id;
    requestPayload.status = status;

    const formattedObject = {
      requestPayload,
      externalSecuritiesId: selectedRow?.id,
    };

    editExternalSecurities({
      requestPayload: formattedObject,
      successCallback: () => {
        fetchExternalSecuritiesList();
        handleCloseMenu();
      },
    });
  };

  const handleDelete = (selectedRow) => {
    const deleteExternalSecurities = (payload) =>
      dispatch(externalSecuritiesActionCreators.doDeleteExternalSecurities(payload));

    const requestPayload = {
      externalSecuritiesId: selectedRow?.id,
    };

    deleteExternalSecurities({
      requestPayload,
      successCallback: () => {
        fetchExternalSecuritiesList();
        handleCloseMenu();
      },
    });
  };

  useEffect(() => {
    fetchExternalSecuritiesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentEntityGroupID]);

  const actions = [
    {
      id: 1,
      label: "Amend",
      onClick: () => {
        if (currentlySelectedRowData.isPrimaryIssuance) {
          setOpenAmendPrimaryIssuanceSecurityDialog(true);
          handleCloseMenu();
          return;
        }

        if (currentlySelectedRowData?.assetType === "Equity") {
          setOpenAddEquitySecurityDialog(true);
          handleCloseMenu();
          return;
        }

        // !IF OTHERWISE, SELECTED SECURITY IS A FIXED INCOME SECURITY
        setOpenAddSecurityDialog(true);
        handleCloseMenu();
      },
      disabled: false,
    },
    {
      id: 2,
      label: "Set to Inactive",
      onClick: () => {
        const statusValue = "Inactive";

        if (currentlySelectedRowData?.assetType === "Equity") {
          handleEquitySecStatusChange(currentlySelectedRowData, statusValue);
          handleCloseMenu();

          return;
        }

        handleStatus(currentlySelectedRowData, statusValue);
        handleCloseMenu();
      },
      disabled: currentlySelectedRowData?.status === "Inactive",
    },
    {
      id: 3,
      label: "Set to Active",
      onClick: () => {
        const statusValue = "Active";

        if (currentlySelectedRowData?.assetType === "Equity") {
          handleEquitySecStatusChange(currentlySelectedRowData, statusValue);
          handleCloseMenu();

          return;
        }

        handleStatus(currentlySelectedRowData, statusValue);
        handleCloseMenu();
      },
      disabled: currentlySelectedRowData?.status === "Active",
    },
    {
      id: 4,
      label: "Edit Coupon Payment Schedule",
      onClick: () => {
        setOpenEditCouponPaymentScheduleDialog(true);
        handleCloseMenu();
      },
      disabled: currentlySelectedRowData?.assetType === "Equity",

      // disabled: !hasManageSecurityServicesACL,
    },
    // {
    //   id: 5,
    //   label: 'Delete',
    //   onClick: () => {
    //     handleDelete(currentlySelectedRowData);
    //   },
    //   disabled: false,
    // },
  ];

  if (isFetching)
    return (
      <Grid container justifyContent="center">
        <LoadingPage />
      </Grid>
    );

  return (
    <Fragment>
      <ExternalSecuritiesTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        // handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        setOpenAddSecurityDialog={setOpenAddSecurityDialog}
        setOpenAddEquitySecurityDialog={setOpenAddEquitySecurityDialog}
      />

      {openAddSecurityDialog && (
        <AddSecurityDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={openAddSecurityDialog}
          handleClose={() => {
            setOpenAddSecurityDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}

      {openAddEquitySecurityDialog && (
        <AddEquitySecurityDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={openAddEquitySecurityDialog}
          handleClose={() => {
            setOpenAddEquitySecurityDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}

      {openEditCouponPaymentScheduleDialog && (
        <EditCouponPaymentScheduleDialog
          currentlySelectedRowData={currentlySelectedRowData}
          data={generatedTableData}
          open={openEditCouponPaymentScheduleDialog}
          isScheduleAdded={isScheduleAdded}
          setIsScheduleAdded={setIsScheduleAdded}
          handleClose={() => {
            setOpenEditCouponPaymentScheduleDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}

      {openAmendPrimaryIssuanceSecurityDialog && (
        <AmendPrimaryIssuanceSecurityDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openAmendPrimaryIssuanceSecurityDialog}
          handleClose={() => {
            setOpenAmendPrimaryIssuanceSecurityDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default ExternalSecuritiesList;
