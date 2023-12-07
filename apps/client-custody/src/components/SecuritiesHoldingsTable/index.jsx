import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import { Box, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import moment from "moment";

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../constants/datetime";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as reportsActionCreators from "../../redux/actionCreators/reports";
import * as reportsSelectors from "../../redux/selectors/reports";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DatePicker from "../FilterComponents/DatePickerUpdated";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import FilterButton from "../FilterComponents/FilterButton";
import FilterCheckbox from "../FilterComponents/FilterCheckbox";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";

const FALLBACK_VALUE = "--";

const ALL_ENTITIES_OPTION = {
  label: "All",
  value: "all",
};

const generateSecuritiesHoldingsTableRowData = (i) => {
  const csd = i.sukuk?.csdName?.name;
  const primaryIssuanceName = i.sukuk?.name;
  const externalSecurityName = i.externalSecurity?.longName;

  return {
    id: i.id,
    corporateEntityName: i.corporateEntityName ?? FALLBACK_VALUE,
    broker: i.broker ?? FALLBACK_VALUE,
    currency: i.currency?.name,
    date: dateFormatter(i.date, DEFAULT_DATE_FORMAT) ?? FALLBACK_VALUE, // !DEV NOTE: FETCHED AT FETCH
    instDescription: i?.instDescription ?? FALLBACK_VALUE,
    isin: i.externalSecurity?.isin ?? FALLBACK_VALUE,
    lastMovement: dateFormatter(i?.lastMovement, DEFAULT_DATE_TIME_FORMAT) ?? FALLBACK_VALUE,
    portfolioId: i.portfolio.id ?? FALLBACK_VALUE,
    positionType: i?.positionType ?? FALLBACK_VALUE,
    portfolio: i.portfolio.name,
    securityAccount: i.portfolio.accountNumber,
    quantity:
      (i.quantity &&
        convertNumberToIntlFormat(i.quantity, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })) ||
      FALLBACK_VALUE,
    security: primaryIssuanceName || externalSecurityName || FALLBACK_VALUE,
    sukukId: i.sukukId,
    wsn: i.wsn ?? FALLBACK_VALUE,
    csd: csd ?? FALLBACK_VALUE,
  };
};

const SecuritiesHoldingsTable = ({
  data,
  securitiesAccounts,
  disableDateFilter = false,
  entityUserType,
  setIsTradeDateHolding,
  isTradeDateHolding,
}) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const mtableLocalization = useMaterialTableLocalization();
  const [entityAddress, setEntityAddress] = useState(null);
  const [allEntitiesOptionSelected, setAllEntitiesOptionSelected] = useState(false);
  const [selectedSecAccount, setSelectedSecAccount] = useState(null);
  const currentSafeAccounts = useSelector(reportsSelectors.selectSafeAccountsData);
  const [isFetch, setIsFetch] = useState(false);

  const { t } = useTranslation(["reports"]);

  // selectors
  const isFetchingSecuritiesHoldings = useSelector(
    reportsSelectors.selectIsFetchingSecuritiesHoldings
  );
  const isFetchingTradeDatedSecuritiesHoldings = useSelector(
    reportsSelectors.selectIsFetchingTradeDatedSecuritiesHoldings
  );

  const isLoading = isTradeDateHolding
    ? isFetchingTradeDatedSecuritiesHoldings
    : isFetchingSecuritiesHoldings;

  const entityOptionsList = [
    ...securitiesAccounts.map((i) => ({
      label: i.group?.entity?.corporateEntityName,
      value: i.group?.entity?.id,
    })),
  ];

  if (Array.isArray(securitiesAccounts) && securitiesAccounts.length > 1) {
    entityOptionsList.unshift(ALL_ENTITIES_OPTION);
  }

  const listOfUniqueSecurities = [...new Set(data?.map(({ security }) => security))];

  const securityOptionsList = listOfUniqueSecurities?.map((security) => ({
    label: security,
    value: security,
  }));

  const listOfUniqueCurrencyNames = [...new Set(data?.map(({ currency }) => currency))];

  const currencyOptionsList = listOfUniqueCurrencyNames.map((currencyName) => ({
    label: currencyName,
    value: currencyName,
  }));

  const listOfUniquePositionTypes = [...new Set(data?.map(({ positionType }) => positionType))];

  const positionTypeOptionsList = listOfUniquePositionTypes.map((positionType) => ({
    label: positionType,
    value: positionType,
  }));

  const handleFetch = (filters) => {
    const { entity, date } = filters;

    const isAllEntitiesOptionSelected = entity?.value.value === "all";
    if (isAllEntitiesOptionSelected) {
      setAllEntitiesOptionSelected(() => isAllEntitiesOptionSelected);
    } else {
      const addrs = securitiesAccounts.filter(
        (account) => account?.group?.entity?.corporateEntityName === entity?.value?.label
      )[0];

      setEntityAddress(addrs);
    }
    console.log("selectedSecAccount", selectedSecAccount);
    const settlementDatedSecuritiesHoldings = (payload) =>
      dispatch(reportsActionCreators.doFetchSecuritiesHoldings(payload));
    const tradeDatedSecuritiesHoldings = (payload) =>
      dispatch(reportsActionCreators.doFetchTradeDatedSecuritiesHoldings(payload));

    const fetchSecuritiesHoldings = isTradeDateHolding
      ? tradeDatedSecuritiesHoldings
      : settlementDatedSecuritiesHoldings;

    if (isAllEntitiesOptionSelected) {
      fetchSecuritiesHoldings({
        params: {
          date: date?.value.toISOString(),
          portfolio_id: selectedSecAccount?.securitiesAccount.portfolioId,
        },
      });
    } else {
      fetchSecuritiesHoldings({
        params: {
          entityId: entity?.value?.value,
          // accountId: selectedSecuritiesAccountOption?.value,
          date: date?.value?.toISOString() ?? moment().toISOString(),
          portfolio_id: selectedSecAccount?.securitiesAccount.portfolioId,
        },
      });
    }
  };

  const columns = [
    {
      id: "Date",
      title: t("Securities Holdings.Headers.Date"), // !DEV NOTE: THIS IS ACTUALLY REFERRED TO AS JOURNAL DATE ON THE BACKEND
      field: "date",
      exportConfig: { width: 8 },
    },
    {
      id: "wsn",
      title: "WSN",
      field: "wsn",
      exportConfig: { width: 8 },
      defaultHidden: true,
    },
    {
      id: "entity",
      title: "Entity",
      field: "corporateEntityName",
    },
    {
      id: "security",
      title: t("Securities Holdings.Headers.Security"),
      field: "security",
      defaultSort: "asc",
      exportConfig: { width: 15 },
    },
    {
      id: "currency",
      title: "CCY",
      field: "currency",
    },
    {
      id: "csd",
      title: t("Securities Holdings.Headers.Registrar"),
      field: "csd",
      defaultHidden: true,
    },
    {
      id: "portfolio",
      title: t("Securities Holdings.Headers.Portfolio"),
      field: "portfolio",
      exportConfig: { width: 15 },
      defaultHidden: true,
    },
    {
      id: "safekeepingAccount",
      title: t("Securities Holdings.Headers.Safekeeping Account"),
      field: "securityAccount",
      defaultHidden: true,
      // exportConfig: { width: 15 },
    },
    {
      id: "quantity",
      title: t("Securities Holdings.Headers.Quantity"),
      field: "quantity",
      // type: "numeric",
      exportConfig: { align: "right", width: 8 },
    },
    {
      id: "positionType",
      title: t("Securities Holdings.Headers.Position Type"),
      field: "positionType",
    },
    {
      id: "isin",
      title: "ISIN",
      field: "isin",
      exportConfig: { width: 10 },
    },
    {
      id: "broker",
      title: t("Securities Holdings.Headers.Broker"),
      field: "broker",
      hidden: ["ISSUER"].includes(entityUserType),
      defaultHidden: true,
    },
    // {
    //   id: "portfolioId",
    //   title: t("Securities Holdings.Headers.Portfolio ID"),
    //   field: "portfolioId",
    //   hidden: ["ISSUER"].includes(entityUserType),
    //   cellStyle: {
    //     minWidth: 120,
    //   },
    // },
    {
      id: "instDescription",
      title: t("Securities Holdings.Headers.Inst Description"),
      field: "instDescription",
      exportConfig: { width: 15 },
      defaultHidden: true,
    },
    {
      id: "lastMovement",
      title: t("Securities Holdings.Headers.Last Movement"),
      field: "lastMovement",
      exportConfig: { render: (rowData) => rowData.lastMovement, width: 8 },
      cellStyle: {
        maxWidth: 100,
      },
    },
  ];

  return (
    <Fragment>
      <FilterProvider tableKey="security_holdings_report">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
            columns={columns}
            open={true}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptionsList}
                  defaultValue={entityOptionsList.length == 1 && entityOptionsList[0]}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="safekeepingAccount"
                  label="Safekeeping Account"
                  options={currentSafeAccounts}
                  defaultValue={currentSafeAccounts.length == 1 && currentSafeAccounts[0]}
                  customOnChange={(newValue) => {
                    dispatch(reportsActionCreators.doResetTradeDatedSecuritiesHoldings());
                    dispatch(reportsActionCreators.doResetSecuritiesHoldings());
                    setSelectedSecAccount(newValue);
                  }}
                  getOptionLabel={(options) =>
                    `${options.securitiesAccount.accountNumber} | ${options.name} `
                  }
                  getOptionValue={(options) => options}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                {!disableDateFilter && (
                  <DatePicker
                    name="date"
                    label="Date"
                    defaultFilter={moment()}
                    maxDate={moment()}
                    disableClear
                  />
                )}
              </Grid>

              <Grid item container xs={12} md={6} lg={2} alignItems="center">
                <FilterCheckbox
                  label="Trade Date Holding"
                  name="tradeDateHolding"
                  checked={isTradeDateHolding}
                  onChange={(event) => setIsTradeDateHolding(event?.target?.checked)}
                  handleFetch={(filters) => handleFetch(filters)}
                  isFetch={isFetch}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={1}>
                <FilterButton
                  label="Apply"
                  onClick={(filters) => {
                    setIsFetch(true);
                    handleFetch(filters);
                  }}
                  disabled={(filters) => !(filters.entity && filters.safekeepingAccount)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="security" label="Security" options={securityOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="currency" label="Currency" options={currencyOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="positionType"
                  label="Position Type"
                  options={positionTypeOptionsList}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Security Holdings Report" />
              </Grid>

              <Grid item xs={12} container>
                <Typography variant="subtitle1">
                  <Box fontWeight="bold">{` Safekeeping Account`} : </Box>{" "}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginLeft: `0.5rem` }}>
                  {selectedSecAccount
                    ? ` ${selectedSecAccount.securitiesAccount.accountNumber} | ${selectedSecAccount.name} `
                    : ` N.A | N.A`}
                </Typography>
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>
        <FilterConsumer>
          {({ filters, filterColumns }) => {
            const filteredData = data
              ?.filter((row) => {
                // Security Filter
                if (filters?.security) {
                  return row.security === filters?.security?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                // Currency Filter
                if (filters?.currency) {
                  return row.currency === filters?.currency?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                // Position Type Filter
                if (filters?.positionType) {
                  return row.positionType === filters?.positionType?.value?.value;
                }
                return true;
              });

            return (
              <MaterialTable
                isLoading={isLoading}
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
                  search: false,
                  draggable: false,
                }}
                localization={mtableLocalization}
              />
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default SecuritiesHoldingsTable;

export { generateSecuritiesHoldingsTableRowData };

SecuritiesHoldingsTable.defaultProps = {
  disableDateFilter: false,
  entityUserType: "",
};
