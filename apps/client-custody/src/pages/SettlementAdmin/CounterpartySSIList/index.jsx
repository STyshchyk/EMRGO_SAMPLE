import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import orderby from "lodash.orderby";

import AddCounterpartySSIDialog from "../../../components/AddCounterpartySSIDialog";
import CounterpartySSITable, {
  generateCounterpartySSITableRowData,
} from "../../../components/CounterpartySSITable";
import LoadingPage from "../../../components/LoadingPage";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as counterpartyActionCreators from "../../../redux/actionCreators/counterparty";
import * as authSelectors from "../../../redux/selectors/auth";
import * as counterpartySelectors from "../../../redux/selectors/counterparty";

const CounterpartySSIList = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddCounterpartySSIDialog, setOpenAddCounterpartySSIDialog] = useState(false);

  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = currentEntityGroup?.entityType;
  const currentEntityGroupID = currentEntityGroup?.id;
  const isRequesting = useSelector(counterpartySelectors.selectIsRequesting);
  const isFetching = useSelector(counterpartySelectors.selectIsFetching);
  const counterpartySSIList = useSelector(counterpartySelectors.selectCounterpartySSIList);
  const orderedCounterpartySSIList = orderby(counterpartySSIList, ["createdAt"], ["desc"]);

  const isWethaqAdmin = currentEntityType === "EMRGO_SERVICES";
  const generatedTableData = orderedCounterpartySSIList?.map((i) =>
    generateCounterpartySSITableRowData(i)
  );

  const fetchCounterpartySSIList = () =>
    dispatch(counterpartyActionCreators.doFetchCounterpartySSIList());
  const fetchCounterpartyList = () =>
    dispatch(counterpartyActionCreators.doFetchCounterpartyList());

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = (selectedRow) => {
    const deleteCounterpartySSI = (payload) =>
      dispatch(counterpartyActionCreators.doDeleteCounterpartySSI(payload));

    const requestPayload = {
      counterpartySSIId: selectedRow?.id,
    };

    deleteCounterpartySSI({
      requestPayload,
      successCallback: () => {
        fetchCounterpartySSIList();
        handleCloseMenu();
      },
    });
  };

  const handleStatus = (selectedRow, status) => {
    const counterpartySSIInfo = counterpartySSIList?.find(({ id }) => selectedRow?.id === id);

    const processedValues = {
      ...counterpartySSIInfo,
      counterpartyId: counterpartySSIInfo?.counterpartyId?.value,
      settlementLocationId: counterpartySSIInfo?.settlementLocationId?.value,
      deliveryAgentIdentifierTypeId: counterpartySSIInfo?.deliveryAgentIdentifierTypeId?.value,
      sellerIdentifierTypeId: counterpartySSIInfo?.sellerIdentifierTypeId?.value ?? null,
    };
    delete processedValues?.entityId;

    const editCounterpartySSI = (payload) =>
      dispatch(counterpartyActionCreators.doEditCounterpartySSI(payload));

    const requestPayload = {
      requestPayload: { ...processedValues, status },
      counterpartySSIId: selectedRow?.id,
    };

    editCounterpartySSI({
      requestPayload,
      successCallback: () => {
        fetchCounterpartySSIList();
        handleCloseMenu();
      },
    });
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    fetchCounterpartySSIList();
    // fetchCounterpartyList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentEntityGroupID]);

  const actions = [
    {
      id: 1,
      label: "Amend",
      callback: () => {
        setOpenAddCounterpartySSIDialog(true);
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
      <CounterpartySSITable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        setOpenDialog={setOpenAddCounterpartySSIDialog}
      />

      {openAddCounterpartySSIDialog && (
        <AddCounterpartySSIDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={openAddCounterpartySSIDialog}
          handleClose={() => {
            setOpenAddCounterpartySSIDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default CounterpartySSIList;
