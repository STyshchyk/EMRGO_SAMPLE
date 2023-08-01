import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CreateIcon from "@mui/icons-material/Create";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import ClientRateCardAddDialog from "../../../components/ClientRateCardAddDialog";
import ClientRateCardTable from "../../../components/ClientRateCardTable";
import ClientRateCardViewDialog from "../../../components/ClientRateCardViewDialog";
import PageTitle from "../../../components/PageTitle";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingActionCreators from "../../../redux/actionCreators/billing";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingSelectors from "../../../redux/selectors/billing";
import * as dropdownSelectors from "../../../redux/selectors/dropdown";

const ClientRateCardPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["billing"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openViewClientRateCardDialog, setOpenViewClientRateDialog] = useState(false);
  const [openAddClientRateCardDialog, setOpenAddClientRateDialog] = useState(false);
  const [modalType, setModalType] = useState("View");

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  // const currentUserId = "";
  const currentEntityGroupID = currentEntityGroup?.id;
  const rateCards = useSelector(billingSelectors.selectRateCards);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);

  const clientRateCardStatus = dropdownOptions?.clientRateCardStatus;

  useEffect(() => {
    const fetchRateCards = (payload) =>
      dispatch(billingActionCreators.doReadRatecardsRequest(payload));

    dispatch(
      dropdownActionCreators.doFetchDropdownOptions({
        options: ["reportingCycle", "currency", "clientRateCardStatus"],
      })
    );

    fetchRateCards();
  }, [dispatch]);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const generatedTableData = useMemo(
    () =>
      rateCards.map((rateCard) => {
        const foundChildCard = rateCards.find((card) => card.original_id === rateCard?.id);

        const normalisedRateCard = {
          id: rateCard?.id,
          entityName: rateCard?.entity_name,
          entity: { id: rateCard?.entity_id, name: rateCard?.entity_name },
          billingAccount: rateCard.billing_account,
          billingPeriod: rateCard?.billing_period?.String,
          statusLabel: rateCard?.status?.String,
          status: rateCard?.status_id,
          version: rateCard?.version,
          lastUpdated: rateCard?.updated_at,
          updatedBy: rateCard?.updated_by?.String,
          minCharge: rateCard?.min_charge,
          billingPeriodId: rateCard?.billing_period_id,
          statusId: rateCard?.status_id,
          childCard: foundChildCard,
        };
        return normalisedRateCard;
      }),
    [rateCards]
  );

  const handleApproveClick = (row) => {
    setCurrentlySelectedRowData(row);
    setOpenViewClientRateDialog(true);
    setModalType("approve");
  };

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
      callback: handleAmendClick,
      icon: <CreateIcon fontSize="small" />,
      label: t("Client Rate Card.Table.Actions.Amend"),
      hidden: (rowData) => {
        const hasChildCard = rowData?.childCard || false;
        const currentStatus = rowData?.status;
        const foundStatus = clientRateCardStatus?.find((status) => status.id === currentStatus);
        return (foundStatus?.key !== "amended" && foundStatus?.key !== "active") || hasChildCard;
      },
    },
    {
      callback: handleApproveClick,
      icon: <PlaylistAddCheckIcon fontSize="small" />,
      label: t("Client Rate Card.Table.Actions.Review for Approval"),
      hidden: (rowData) => {
        const updatedByUser = rowData?.updatedBy;
        const updatedBySameUser = currentUserId === updatedByUser;
        const currentStatus = rowData?.status;
        const foundStatus = clientRateCardStatus?.find((status) => status.id === currentStatus);
        return foundStatus?.key !== "amended" || updatedBySameUser;
      },
    },
    {
      callback: handleViewClick,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("Client Rate Card.Table.Actions.View"),
      hidden: false,
    },
  ];

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const addClientRateCardDialog = () => {
    setOpenAddClientRateDialog(true);
  };

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={10}>
          <PageTitle title={t("Client Rate Card.Title")} />
        </Grid>
        <Grid item xs={2} container justifyContent="flex-end">
          <Grid item container direction="column" justifyContent="center">
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                addClientRateCardDialog(true);
              }}
            >
              {t("Client Rate Card.Add")}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <ClientRateCardTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        setAnchorEl={setAnchorEl}
        handleCloseMenu={handleCloseMenu}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        currentlySelectedRowData={currentlySelectedRowData}
      />
      <ClientRateCardViewDialog
        open={openViewClientRateCardDialog}
        handleClose={() => {
          setOpenViewClientRateDialog(false);
          handleCloseMenu();
          setCurrentlySelectedRowData(null);
        }}
        selectedRow={currentlySelectedRowData}
        modalType={modalType}
      />
      <ClientRateCardAddDialog
        open={openAddClientRateCardDialog}
        handleClose={() => {
          setOpenAddClientRateDialog(false);
        }}
        isEd
      />
    </Fragment>
  );
};

export default ClientRateCardPage;
