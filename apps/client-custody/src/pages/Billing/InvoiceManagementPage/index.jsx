import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CreateIcon from "@mui/icons-material/Create";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import InvoiceManagementTable from "../../../components/InvoiceManagementTable";
import InvoiceViewDialog from "../../../components/InvoiceViewDialog";
import PageTitle from "../../../components/PageTitle";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingActionCreators from "../../../redux/actionCreators/billing";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingSelectors from "../../../redux/selectors/billing";
import * as dropdownSelectors from "../../../redux/selectors/dropdown";

const InvoiceManagementPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["billing"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openViewClientRateCardDialog, setOpenViewClientRateDialog] = useState(false);
  const [modalType, setModalType] = useState("View");

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  // const currentUserId = "";
  const currentEntityGroupID = currentEntityGroup?.id;
  const invoices = useSelector(billingSelectors.selectInvoices);
  // const invoices = mockedInvoices;
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const invoiceStatuses = dropdownOptions?.invoiceStatus;

  const openInvoiceStatus = invoiceStatuses?.find((status) => status.key === "open");

  const fetchInvoiceParams = useMemo(() => {
    const params = {
      entityId: "00000000-0000-0000-0000-000000000000",
      startDate: "",
      endDate: "",
    };
    return params;
  }, []);

  useEffect(() => {
    const fetchInvoices = (payload) =>
      dispatch(billingActionCreators.doReadInvoicesRequest(payload));

    dispatch(
      dropdownActionCreators.doFetchDropdownOptions({
        options: ["reportingCycle", "currency", "invoiceStatus"],
      })
    );

    fetchInvoices({ params: fetchInvoiceParams });
  }, [dispatch, fetchInvoiceParams]);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const generatedTableData = useMemo(
    () =>
      invoices.map((invoice) => {
        const normalisedRateCard = {
          id: invoice?.id,
          reference: invoice?.reference,
          date: invoice?.date,
          amount: invoice?.amount,
          billingAccount: invoice?.billing_account,
          balance: invoice?.accountbalance?.String,
          createdAt: invoice?.created_at,
          updatedAt: invoice?.updated_at,
          createdBy: invoice?.created_by,
          approvedBy: invoice?.approved_by?.String,
          entityId: invoice?.entity_id,
          entity: invoice?.entity_name,
          entityName: invoice?.entity_name,
          clientRateCardID: invoice.client_rate_card_id,
          paymentStatusID: invoice?.payment_status_id,
          paymentStatus: invoice?.payment_status?.String,
          statusId: invoice?.status_id,
          status: invoice?.invoice_status?.String,
          minCharge: invoice?.min_charge,
        };
        return normalisedRateCard;
      }),
    [invoices]
  );



  const handleAmendClick = (row) => {
    setCurrentlySelectedRowData(row);
    setOpenViewClientRateDialog(true);
    setModalType("amend");
  };

  const handleViewClick = (row) => {
    setCurrentlySelectedRowData(row);
    setOpenViewClientRateDialog(true);
    setModalType("view");
  };

  const actions = [
    {
      callback: handleApproveClick,
      icon: <PlaylistAddCheckIcon fontSize="small" />,
      label: t("Invoice Management.Table.Actions.Review for Approval"),
      hidden: (rowData) => {
        const updatedByUser = rowData?.updatedBy;
        const updatedBySameUser = currentUserId === updatedByUser;
        const currentStatus = rowData?.statusId;
        const foundStatus = invoiceStatuses?.find((status) => status.id === currentStatus);
        return foundStatus?.key !== "amended" || updatedBySameUser;
      },
    },
    {
      callback: handleViewClick,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("Invoice Management.Table.Actions.View"),
      hidden: false,
    },
    {
      callback: handleViewClick,
      icon: <CloudDownloadIcon fontSize="small" />,
      label: t("Invoice Management.Table.Actions.Download"),
      hidden: false,
    },
    {
      callback: handleViewClick,
      icon: <ReceiptIcon fontSize="small" />,
      label: t("Invoice Management.Table.Actions.Take Payment"),
      hidden: (rowData) => {
        const currentStatus = rowData?.statusId;
        return currentStatus !== openInvoiceStatus?.id;
      },
    },
  ];

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={10}>
          <PageTitle title={t("Invoice Management.Title")} />
        </Grid>
      </Grid>

      <InvoiceManagementTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        setAnchorEl={setAnchorEl}
        handleCloseMenu={handleCloseMenu}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        currentlySelectedRowData={currentlySelectedRowData}
      />
      <InvoiceViewDialog
        open={openViewClientRateCardDialog}
        handleClose={() => {
          setOpenViewClientRateDialog(false);
          handleCloseMenu();
          setCurrentlySelectedRowData(null);
        }}
        selectedRow={currentlySelectedRowData}
        modalType={modalType}
        fetchInvoiceParams={fetchInvoiceParams}
      />
    </Fragment>
  );
};

export default InvoiceManagementPage;
