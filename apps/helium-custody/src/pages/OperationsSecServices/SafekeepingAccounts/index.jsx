import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";



import MaterialTable from "@material-table/core";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import moment from "moment";
import v from "voca";



import DropdownFilter from "../../../components/FilterComponents/DropdownFilter";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../../../components/MaterialTableOverflowMenu";
import PageTitle from "../../../components/PageTitle";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as miscellaneousActionCreators from "../../../redux/actionCreators/miscellaneous";
import * as safekeepingActionCreators from "../../../redux/actionCreators/safekeeping";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import * as miscellaneousSelectors from "../../../redux/selectors/miscellaneous";
import * as safekeepingSelectors from "../../../redux/selectors/safekeeping";
import tableStyles from "../../../styles/cssInJs/materialTable";
import AddSafekeepingAccountDialog from "./AddSafekeepingAccountDialog";
import EditSafekeepingAccountDialog from "./EditSafekeepingAccountDialog";
import ViewSafekeepingAccountDialog from "./ViewSafekeepingAccountDialog";





const SafekeepingAccounts = () => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["safekeeping_accounts", "cash_management", "reports"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const dropdowns = useSelector(miscellaneousSelectors.selectDropdowns);
  const currencies = dropdowns.currency;
  const accounts = useSelector(safekeepingSelectors.readAccounts);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const statuses = ["Active", "Inactive"];

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const [transactionTypeValue, setTransactionTypeValue] = useState("all");
  const [currentlySelectedEntity, setCurrentlySelectedEntity] = useState(null);
  const [currentlySelectedAccount, setCurrentlySelectedAccount] = useState(null);
  const [selectedRow, setSelectedRow] = useState("");
  const [openAddSafekeepingAccountDialog, setOpenAddSafekeepingAccountDialog] = useState(false);
  const [openAmendSafekeepingAccountDialog, setOpenAmendSafekeepingAccountDialog] = useState(false);
  const [openViewSafekeepingAccountDialog, setOpenViewSafekeepingAccountDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentlySelectedSecurityAccount, setCurrentlySelectedSecurityAccount] = useState(null);

  // const entities = useSelector(authSelectors.selectOwnEntityNames);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(miscellaneousActionCreators.doFetchDropdownValues(payload));

    fetchFormOptions({
      options: ["currency"],
    });

    const fetchAccounts = (payload) => dispatch(safekeepingActionCreators.doReadAccounts(payload));
    fetchAccounts();

    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    fetchEntities();
  }, [dispatch]);

  const handleAmendAccountClick = () => {
    handleOpenAmendSafekeepingAccountDialog();
  };
  const handleViewAccountClick = () => {
    handleOpenViewSafekeepingAccountDialog();
  };
  const handleViewAuditHistoryClick = () => {};

  const actions = [
    {
      callback: handleAmendAccountClick,
      icon: <EditIcon fontSize="small" />,
      label: t("Actions.Amend"),
    },
    {
      callback: handleViewAccountClick,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("Actions.View"),
    },
    {
      callback: handleViewAuditHistoryClick,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("Actions.Audit History"),
    },
  ];

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const accountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedAccount = [];

    accs.forEach((acc) => {
      if (pushedEntity.indexOf(acc?.entity?.id) === -1) {
        entityOpts.push({
          id: acc?.entity?.id,
          label: acc?.entity?.name,
          value: acc?.entity?.id,
        });

        if (acc.securitiesAccount) {
          securityAccountOpts.push({
            id: acc?.securitiesAccount?.id,
            label: acc?.securitiesAccount?.accountNumber,
            value: acc?.securitiesAccount?.id,
            original: acc,
          });
        }
        pushedEntity.push(acc?.entity?.id);
      }
    });

    return { entityOpts, accountOpts, securityAccountOpts };
  };

  const { entityOpts, accountOpts, securityAccountOpts } = getEntityAndAccounts(accounts);

  const filteredEntity = entityOpts.map((entity) => ({
    data: entity,
    value: entity.id,
    label: entity.label,
  }));

  const filteredSecurityAccounts = securityAccountOpts.map((account) => ({
    data: account,
    value: account.id,
    label: account.label,
    original: account.original,
  }));

  const columns = [
    {
      id: "entity",
      title: t("Headers.Entity"),
      field: "entity.name",
    },
    {
      id: "portfolio",
      title: t("Headers.Portfolio"),
      field: "name",
    },
    {
      id: "safekeeping_account",
      title: t("Headers.Safekeeping Account"),
      field: "securitiesAccount.accountNumber",
    },
    {
      id: "base_currency",
      title: t("Headers.Base Currency"),
      field: "currency.name",
    },
  ];

  const handleCloseAddSafekeepingAccountDialog = () => {
    setOpenAddSafekeepingAccountDialog(false);
  };

  const handleOpenAddSafekeepingAccountDialog = () => {
    setOpenAddSafekeepingAccountDialog(true);
  };

  const handleAddSafekeepingAccount = (values, actions) => {
    const requestPayload = {
      entityId: values.entity.id,
      baseCurrencyId: values.baseCurrency.value,
      name: values.name,
      status: values.status.value,
      currencies: values.currencies.map((currency) => currency.currency.value),
    };
    dispatch(safekeepingActionCreators.doCreateAccount(requestPayload));

    handleCloseAddSafekeepingAccountDialog();
  };

  const handleCloseAmendSafekeepingAccountDialog = () => {
    setOpenAmendSafekeepingAccountDialog(false);
  };

  const handleOpenAmendSafekeepingAccountDialog = () => {
    setOpenAmendSafekeepingAccountDialog(true);
  };

  const handleAmendSafekeepingAccount = (values, actions) => {
    const requestPayload = {
      entityId: values.entity.id,
      baseCurrencyId: values.baseCurrency.value,
      name: values.name,
      status: values.status.value,
      currencies: values.currencies.map((account) => account.currency),
    };
    dispatch(safekeepingActionCreators.doUpdateAccount({ requestPayload, id: values.id }));

    handleCloseAmendSafekeepingAccountDialog();
  };

  const handleCloseViewSafekeepingAccountDialog = () => {
    setOpenViewSafekeepingAccountDialog(false);
  };

  const handleOpenViewSafekeepingAccountDialog = () => {
    setOpenViewSafekeepingAccountDialog(true);
  };

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
  return (
    <Fragment>
      <Grid container alignItems="center">
        <Grid container lg={3}>
          <PageTitle title={t("Safekeeping Accounts")} />
        </Grid>

        <Grid container alignItems="flex-start" justifyContent="flex-end" spacing={2} lg={9}>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleOpenAddSafekeepingAccountDialog();
              }}
            >
              {t("Add Safekeeping Accounts")}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <FilterProvider tableKey="safekeeping_accounts_mngmt">
        <TableFiltersWrapper
          tableRef={tableRef}
          data={accounts}
          columns={columns}
          open={true}
          hideExportButtons
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="entity"
                label="Entity"
                options={filteredEntity}
                currentlySelectedOption={currentlySelectedEntity}
                setCurrentlySelectedOption={setCurrentlySelectedEntity}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="safekeepingAccount"
                label="Safekeeping Account"
                options={filteredSecurityAccounts}
                currentlySelectedOption={currentlySelectedSecurityAccount}
                setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}></Grid>
          </Grid>
        </TableFiltersWrapper>

        <FilterConsumer>
          {({ filterColumns, filters, setFilterValue }) => {
            const filteredData = accounts
              .filter((row) => {
                if (filters?.entity) {
                  return row.entity_id === filters?.entity?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                if (filters?.safekeepingAccount) {
                  return row.securitiesAccount.id === filters?.safekeepingAccount?.value?.value;
                }
                return true;
              });

            return (
              <div>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={filterColumns.shownColumns}
                  data={filteredData}
                  options={{
                    ...tableStyles,
                    toolbar: false,
                    pageSize: 10,
                    searchFieldVariant: "outlined",
                    actionsColumnIndex: -1,
                  }}
                  localization={mtableLocalization}
                  actions={[
                    {
                      icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
                      onClick: (event, rowData) => {
                        setMenuAnchorEl(event.currentTarget);
                        setSelectedRow(rowData);
                      },
                    },
                  ]}
                />
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={menuAnchorEl}
                  setAnchorEl={setMenuAnchorEl}
                  selectedRow={selectedRow}
                />
              </div>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
      {openAddSafekeepingAccountDialog ? (
        <AddSafekeepingAccountDialog
          open={openAddSafekeepingAccountDialog}
          handleClose={handleCloseAddSafekeepingAccountDialog}
          entities={currentEntityGroupEntityType === "EMRGO_SERVICES" ? entities : null}
          currencies={currencies || []}
          statuses={statuses}
          handleAddSafekeepingAccount={handleAddSafekeepingAccount}
        />
      ) : null}

      {openAmendSafekeepingAccountDialog ? (
        <EditSafekeepingAccountDialog
          open={openAmendSafekeepingAccountDialog}
          handleClose={handleCloseAmendSafekeepingAccountDialog}
          account={selectedRow}
          entities={currentEntityGroupEntityType === "EMRGO_SERVICES" ? entities : null}
          currencies={currencies || []}
          statuses={statuses}
          handleAddSafekeepingAccount={handleAmendSafekeepingAccount}
        />
      ) : null}

      {openViewSafekeepingAccountDialog ? (
        <ViewSafekeepingAccountDialog
          open={openViewSafekeepingAccountDialog}
          handleClose={handleCloseViewSafekeepingAccountDialog}
          account={selectedRow}
          entities={currentEntityGroupEntityType === "EMRGO_SERVICES" ? entities : null}
          currencies={currencies || []}
          statuses={statuses}
        />
      ) : null}
    </Fragment>
  );
};

export default SafekeepingAccounts;