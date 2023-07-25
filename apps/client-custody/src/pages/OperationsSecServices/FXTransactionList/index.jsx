import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EditIcon from "@mui/icons-material/Edit";
import orderby from "lodash.orderby";

import AddFXTransactionDialog from "../../../components/AddFXTransactionDialog";
import EditFXTransactionDialog from "../../../components/EditFXTransactionDialog";
import FXTransactionActionModal from "../../../components/FXTransactionActionModal";
import FXTransactionTable, {
  generateFXTransactionTableRowData,
} from "../../../components/FXTransactionTable";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as fxTransactionsActionCreators from "../../../redux/actionCreators/fxTransactions";
import * as authSelectors from "../../../redux/selectors/auth";
import * as fxTransactionsSelectors from "../../../redux/selectors/fxTransactions";

const FXTransactionList = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["fx_transactions"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [currentlySelectedDateRange, setCurrentlySelectedDateRange] = useState(null);
  const [openAddFXTransactionDialog, setOpenAddFXTransactionDialog] = useState(false);
  const [openEditFXTransactionDialog, setOpenEditFXTransactionDialog] = useState(false);
  const [openFXTransactionActionDialog, setOpenFXTransactionActionDialog] = useState("");

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const fxTransactionsList = useSelector(fxTransactionsSelectors.getFxTransactionsList);
  const orderedfxTransactionsList = orderby(fxTransactionsList, ["createdAt"], ["desc"]);

  // table data
  const generatedTableData = orderedfxTransactionsList?.map((i) =>
    generateFXTransactionTableRowData(i)
  );

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchFxTransactionsList = (transactionDateRange) => {
    if (currentEntityGroupID) {
      dispatch(
        fxTransactionsActionCreators.doFetchFxTransactions({
          currentGroupId: currentEntityGroupID,
          ...transactionDateRange,
        })
      );
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const actions = [
    {
      label: t("Fx Table.Overflow Menu.Amend"),
      callback: () => {
        setOpenEditFXTransactionDialog(true);
        handleCloseMenu();
      },
      disabled: false,
      icon: <EditIcon fontSize="small" />,
    },
    {
      id: 3,
      label: t("Fx Table.Overflow Menu.Approve"),
      callback: () => {
        setOpenFXTransactionActionDialog("approve");
      },
      hidden: false,
      icon: <DoneAllIcon fontSize="small" />,
    },
    {
      id: 1,
      label: t("Fx Table.Overflow Menu.Cancel"),
      callback: () => {
        setOpenFXTransactionActionDialog("cancel");
      },
      disabled: false,
      icon: <DeleteIcon fontSize="small" />,
    },
  ];

  return (
    <Fragment>
      <FXTransactionTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        setOpenAddFXTransactionDialog={setOpenAddFXTransactionDialog}
        fetchFxTransactionsList={fetchFxTransactionsList}
        setCurrentlySelectedDateRange={setCurrentlySelectedDateRange}
      />

      {openAddFXTransactionDialog && (
        <AddFXTransactionDialog
          open={setOpenAddFXTransactionDialog}
          handleClose={() => {
            setOpenAddFXTransactionDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
          currentlySelectedDateRange={currentlySelectedDateRange}
        />
      )}

      {openEditFXTransactionDialog && (
        <EditFXTransactionDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={setOpenEditFXTransactionDialog}
          handleClose={() => {
            setOpenEditFXTransactionDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
          currentlySelectedDateRange={currentlySelectedDateRange}
        />
      )}

      <FXTransactionActionModal
        open={openFXTransactionActionDialog !== ""}
        action={openFXTransactionActionDialog}
        onClose={() => setOpenFXTransactionActionDialog("")}
        selectedRow={currentlySelectedRowData}
        currentlySelectedDateRange={currentlySelectedDateRange}
      />
    </Fragment>
  );
};

export default FXTransactionList;
