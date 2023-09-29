import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";



import MaterialTable from "@material-table/core";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import ListItemIcon from '@mui/material/ListItemIcon';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import v from "voca";



import MaterialTableOverflowMenu from "../../../components/MaterialTableOverflowMenu";
import PageTitle from "../../../components/PageTitle";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../../redux/selectors/cashManagement";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import tableStyles from "../../../styles/cssInJs/materialTable";
// import EntityAccountsTable from './EntityAccountsTable';
import AddEntityAccountModal from "./AddEntityAccountModal";
import EditEntityAccountModal from "./EditEntityAccountModal";





// * TODO: CLEANUP

const EntityAccountManagement = () => {
  const { t } = useTranslation(["administration"]);
  const mtableLocalization = useMaterialTableLocalization();

  const dispatch = useDispatch();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // selectors
  const accounts = useSelector(billingAndPaymentsSelectors.selectAccounts);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const entities = useSelector(entitiesSelectors.selectEntities);

  const currentEntityGroupID = currentEntityGroup?.id;

  const securitiesAccounts = accounts.map(
    ({
      group: {
        clientSecuritiesAccount,
        entity: { corporateEntityName, wethaqEntityId },
      },
    }) => ({
      id: clientSecuritiesAccount.id,
      accountNumber: clientSecuritiesAccount.accountNumber,
      accountType: `${v.titleCase(clientSecuritiesAccount.type)} (Security)`,
      currency: "--",
      entityName: corporateEntityName,
      externalAccountNumber: "--",
      iban: "--",
      isVirtualIBAN: "--",
      ssi: "--",
      wethaqEntityId,
    })
  );

  const uniqueSecuritiesAccountNumbers = Array.from(
    new Set(securitiesAccounts.map(({ accountNumber }) => accountNumber))
  ).sort();

  const uniqueSecuritiesAccounts = uniqueSecuritiesAccountNumbers.map(
    (securitiesAccountNumber) => ({
      ...securitiesAccounts.find((item) => item.accountNumber === securitiesAccountNumber),
    })
  );

  const getFormattedAccountType = (accType) =>
    `${v.titleCase(accType.split("_").join(" "))} (Cash)`;

  const handleAddAccount = (data, resetForm) => {
    const payload = {
      requestPayload: { ...data },
      cb: resetForm,
    };
    dispatch(billingAndPaymentsActionCreators.doCreateAccount(payload));
  };

  const handleEditClick = (data) => {
    setSelectedAccount(data);
    setEditModalOpen(true);
  };

  const handleEditAccount = (data, resetForm) => {
    const payload = {
      accountId: selectedAccount.id,
      requestPayload: { ...data },
      cb: resetForm,
    };
    dispatch(billingAndPaymentsActionCreators.doEditAccount(payload));
  };

  const actions = [
    {
      callback: handleEditClick,
      icon: <EditIcon fontSize="small" />,
      label: t("EntityAccountManagement.EntityAccountsTable.Context Menu.Edit"),
    },
  ];

  const getTableData = (accs) => {
    const entries = [];
    accs.forEach((acc) => {
      entries.push({
        id: acc.id,
        accountNumber: acc.accountNo,
        accountType: getFormattedAccountType(acc.type),
        currency: acc.currency.name,
        entityName: acc.group.entity.corporateEntityName,
        externalAccountNumber: acc.externalAccountNumber,
        iban: acc.iban,
        isVirtualIban: acc.isVirtualIBAN ? "Yes" : "No",
        ssi: acc.externalAccountNumber ?? "--",
        wethaqEntityId: acc.group?.entity?.wethaqEntityId,
      });
    });
    return entries;
  };

  const cashAccounts = getTableData(accounts);
  const rows = [...cashAccounts, ...uniqueSecuritiesAccounts];
  
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload));
    fetchAccounts();

    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    fetchEntities();
  }, [dispatch]);

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchDropdownValues(payload));
    fetchFormOptions({
      options: ["bankAccountTypes", "currency"],
    });
  }, [dispatch]);

  const dropdownValues = useSelector(billingAndPaymentsSelectors.selectDropDowns);
  const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
  const currency = dropdownValues ? dropdownValues?.currency || [] : [];

  const headCells = [
    // {
    //   id: "wethaqEntityId",
    //   title: t("EntityAccountManagement.EntityAccountsTable.Headers.Entity ID"),
    //   field: "wethaqEntityId",
    //   defaultSort: "asc",
    // },
    {
      id: "entityName",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.Entity Name"),
      field: "entityName",
      defaultSort: "asc",
    },
    {
      id: "accountType",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.Account Type"),
      field: "accountType",
    },
    {
      id: "currency",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.Currency"),
      field: "currency",
    },
    {
      id: "accountNumber",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.Account Number"),
      field: "accountNumber",
    },
    {
      id: "ssi",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.SSI"),
      field: "ssi",
    },
    {
      id: "iban",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.IBAN"),
      field: "iban",
    },
    {
      id: "isVirtualIban",
      title: t("EntityAccountManagement.EntityAccountsTable.Headers.Virtual IBAN"),
      field: "isVirtualIban",
      render: (rowData) =>
        rowData.isVirtualIban === "Yes"
          ? t("EntityAccountManagement.EntityAccountsTable.Yes")
          : t("EntityAccountManagement.EntityAccountsTable.No"),
    },
  ];

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={9}>
          <PageTitle title={t("EntityAccountManagement.Entity Accounts")} />
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end" alignItems="flex-start">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setAddModalOpen(true);
            }}
          >
            {t("EntityAccountManagement.Add Account")}
          </Button>
        </Grid>
      </Grid>
      <AddEntityAccountModal
        isModalOpen={addModalOpen}
        options={{ currency, bankAccountTypes, entities }}
        setIsModalOpen={setAddModalOpen}
        onSubmit={handleAddAccount}
      />
      <EditEntityAccountModal
        isModalOpen={editModalOpen}
        setIsModalOpen={setEditModalOpen}
        onSubmit={handleEditAccount}
        accountDetails={{ ...selectedAccount }}
      />
      <MaterialTable
        size="small"
        title=""
        columns={headCells}
        data={rows}
        options={{
          ...tableStyles,
          searchFieldVariant: "outlined",
          pageSize: 10,
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
    </Fragment>
  );
};

export default EntityAccountManagement;