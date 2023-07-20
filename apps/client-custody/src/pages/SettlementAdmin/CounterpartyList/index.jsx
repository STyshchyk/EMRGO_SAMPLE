import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import orderby from "lodash.orderby";

import AddCounterpartyDialog from "../../../components/AddCounterpartyDialog";
import CounterpartyTable, {
  generateCounterpartyTableRowData,
} from "../../../components/CounterpartyTable";
import LoadingPage from "../../../components/LoadingPage";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as counterpartyActionCreators from "../../../redux/actionCreators/counterparty";
import * as authSelectors from "../../../redux/selectors/auth";
import * as counterpartySelectors from "../../../redux/selectors/counterparty";

const CounterpartyList = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddCounterpartyDialog, setOpenAddCounterpartyDialog] = useState(false);

  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = currentEntityGroup?.entityType;
  const currentEntityGroupID = currentEntityGroup?.id;
  const isRequesting = useSelector(counterpartySelectors.selectIsRequesting);
  const isFetching = useSelector(counterpartySelectors.selectIsFetching);
  const counterpartyList = useSelector(counterpartySelectors.selectCounterpartyList);
  const orderedCounterpartyList = orderby(counterpartyList, ["createdAt"], ["desc"]);

  const isWethaqAdmin = currentEntityType === "EMRGO_SERVICES";
  const generatedTableData = orderedCounterpartyList?.map((i) =>
    generateCounterpartyTableRowData(i)
  );

  // fetch counterparty list
  const fetchCounterpartyList = () =>
    dispatch(counterpartyActionCreators.doFetchCounterpartyList());

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (selectedRow) => {
    const deleteCounterparty = (payload) =>
      dispatch(counterpartyActionCreators.doDeleteCounterparty(payload));

    const requestPayload = {
      counterpartyId: selectedRow?.id,
    };

    deleteCounterparty({
      requestPayload,
      successCallback: () => {
        fetchCounterpartyList();
        handleCloseMenu();
      },
    });
  };

  const handleStatus = (selectedRow, status) => {
    const counterpartyInfo = counterpartyList?.find(({ id }) => selectedRow?.id === id);

    const processedValues = {
      ...counterpartyInfo,
      entityId: counterpartyInfo.entityId.value,
    };
    delete processedValues?.entity;

    const editCounterparty = (payload) =>
      dispatch(counterpartyActionCreators.doEditCounterparty(payload));

    const requestPayload = {
      requestPayload: { ...processedValues, status },
      counterpartyId: selectedRow?.id,
    };

    editCounterparty({
      requestPayload,
      successCallback: () => {
        fetchCounterpartyList();
        handleCloseMenu();
      },
    });
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    fetchCounterpartyList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentEntityGroupID]);

  const actions = [
    {
      id: 1,
      label: "Amend",
      callback: () => {
        setOpenAddCounterpartyDialog(true);
        handleCloseMenu();
      },
      disabled: false,
    },
    // {
    //   id: 2,
    //   label: 'Delete',
    //   onClick: () => {
    //     handleDelete(currentlySelectedRowData);
    //     handleCloseMenu();
    //   },
    //   disabled: false,
    // },
    {
      id: 2,
      label: "Active",
      callback: () => {
        handleStatus(currentlySelectedRowData, "Active");
        handleCloseMenu();
      },
      disabled: currentlySelectedRowData?.status === "Active" || !isWethaqAdmin,
    },
    {
      id: 3,
      label: "Inactive",
      callback: () => {
        handleStatus(currentlySelectedRowData, "Inactive");
        handleCloseMenu();
      },
      disabled: currentlySelectedRowData?.status === "Inactive" || !isWethaqAdmin,
    },
  ];

  if (isRequesting || isFetching) return <LoadingPage />;

  return (
    <Fragment>
      <CounterpartyTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        setOpenDialog={setOpenAddCounterpartyDialog}
      />

      {openAddCounterpartyDialog && (
        <AddCounterpartyDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={openAddCounterpartyDialog}
          handleClose={() => {
            setOpenAddCounterpartyDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default CounterpartyList;
