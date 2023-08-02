import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { externalSecurityStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import useIsProduction from "../../utils/useIsProduction";
import TableFiltersWrapper from "../TableFiltersWrapper";

const FALLBACK_VALUE = "--";

// TODO: REFACTOR THIS COMPONENT: ENCAPSULATE TABLE FILTERING LOGIC - SEE GLENN'S FX CODES FOR INSPIRATION

const customSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 100,
  }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
};

const TableActionMenu = ({ handleCloseMenu, actions, anchorEl }) => {
  const { t } = useTranslation(["external_securities"]);

  return (
    <Fragment>
      {Boolean(anchorEl) && (
        <Menu
          id="ss-table-action-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          disableScrollLock
        >
          {actions.map((action) => (
            <MenuItem key={action.id} disabled={action.disabled} onClick={action.onClick}>
              <Typography variant="inherit">
                {t(`External Securities.Context Menu.${action.label}`)}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Fragment>
  );
};

TableActionMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

const TableToolbar = ({ searchText, setSearchText }) => {
  const onChange = useCallback((event) => setSearchText(event?.target.value), []);

  return (
    <Grid container spacing={4}>
      <Grid alignItems="center" justifyContent="flex-end" item container spacing={2} lg={9}>
        {/* {manageColumns && (
          <Grid item>
            <Button color="secondary" variant="outlined">
              MANAGE COLUMNS
            </Button>
          </Grid>
        )} */}
      </Grid>

      <Grid item container lg={3}>
        <TextField placeholder="Search" variant="filled" value={searchText} onChange={onChange} />
      </Grid>
    </Grid>
  );
};

const TableFiltering = ({ options, setStatusFilterValue, setISINFilterValue }) => {
  const { statusOptionsList, isinOptionsList } = options;
  const [currentlySelectedStatusOption, setCurrentlySelectedStatusOption] = useState(null);
  const [currentlySelectedISINOption, setCurrentlySelectedISINOption] = useState(null);

  return (
    <Grid container spacing={2}>
      <Grid item lg={3}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Typography variant="body1" className="bold">
            Status
          </Typography>
          <ButtonBase
            onClick={() => {
              setStatusFilterValue("");
              setCurrentlySelectedStatusOption(null);
            }}
          >
            <Typography variant="caption">Clear</Typography>
          </ButtonBase>
        </Grid>

        <Box my={1} className="full-width">
          <Select
            fullWidth
            closeMenuOnSelect
            isSearchable
            placeholder="Status"
            styles={customSelectStyles}
            options={statusOptionsList}
            value={currentlySelectedStatusOption}
            onChange={(newValue) => {
              setStatusFilterValue(newValue.value);
              setCurrentlySelectedStatusOption(newValue);
            }}
          />
        </Box>
      </Grid>

      <Grid item lg={3}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Typography variant="body1" className="bold">
            ISIN
          </Typography>
          <ButtonBase
            onClick={() => {
              setISINFilterValue("");
              setCurrentlySelectedISINOption(null);
            }}
          >
            <Typography variant="caption">Clear</Typography>
          </ButtonBase>
        </Grid>

        <Box my={1} className="full-width">
          <Select
            fullWidth
            closeMenuOnSelect
            isSearchable
            placeholder="Status"
            styles={customSelectStyles}
            options={isinOptionsList}
            value={currentlySelectedISINOption}
            onChange={(newValue) => {
              setISINFilterValue(newValue.value);
              setCurrentlySelectedISINOption(newValue);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

const generateExternalSecuritiesListTableRowData = (i) => ({
  id: i.id,
  country: i.country,
  couponId: i.couponId,
  createdAt: i.createdAt,
  currency: i.currencyName,
  currencyId: i.currency,
  dayCountConvention: i.dayCountConventionName,
  denomination: i.denominationName,
  exchangeCode: i.exchangeCode,
  formOfOffering: i.formOfOfferingName,
  frequency: i.frequencyName,
  governingLaw: i.governingLawName,
  guarantor: i.guarantor,
  isin: i.isin,
  isPrimaryIssuance: i.isPrimaryIssuance,
  issuanceAmount: i?.issuanceAmount,
  issuanceName: i.issuanceName,
  issueDate: i.issueDate,
  jurisdiction: i.jurisdictionName,
  listing: i.listingName,
  longName: i.longName,
  maturityAmount: i.maturityAmount,
  maturityDate: i.maturityDate,
  name: i.name, // security name
  pricingMethod: i.pricingName,
  profitRate: i.profitRate,
  profitRateTerms: i.profitRateTermsName,
  ranking: i.rankingName,
  sellingRestrictions: i.sellingRestrictionsName,
  shariahCompliance: i.shariahComplianceName,
  shortName: i.shortName,
  status: i.status,
  ticker: i.ticker,
  wsn: i.wsn,
  assetType: i.assetTypeName?.label ?? FALLBACK_VALUE,
  attributes: i.attributes
    ?.filter((item) => !["Short Name", "Long Name"].includes(item?.match?.value))
    .map((item) => ({
      identifierId: item.identifierId,
      value: item.value,
      securityIdTypeName: item.match?.value,
    })),
});

const ExternalSecuritiesTable = ({
  anchorEl,
  handleCloseMenu,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  setOpenAddSecurityDialog,
  setOpenAddEquitySecurityDialog,
}) => {
  const inProd = useIsProduction();

  const [searchText, setSearchText] = useState("");
  const tableRef = useRef();
  const { t } = useTranslation(["external_securities"]);
  const mtableLocalization = useMaterialTableLocalization();
  const [isinFilterValue, setISINFilterValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");

  const [dateFilterValue, setDateFilterValue] = useState("");

  const sortedISIN = Array.from(new Set(data.map((item) => item.isin))).sort();
  const isinOptionsList = sortedISIN.map((isin) => ({
    label: isin,
    value: isin,
  }));

  const statusOptionsList = [
    {
      label: "Active",
      value: externalSecurityStatusEnum.ACTIVE,
    },
    {
      label: "Inactive",
      value: externalSecurityStatusEnum.INACTIVE,
    },
  ];

  const extSecuritiesColumns = [
    {
      id: "name",
      title: t("External Securities.Headers.Security"),
      field: "name",
    },
    {
      id: "assetType",
      title: t("External Securities.Headers.Security Type"),
      render: (rowData) => rowData?.assetType,
    },
    {
      id: "isin",
      title: t("External Securities.Headers.ISIN"),
      render: (rowData) => rowData?.isin ?? FALLBACK_VALUE,
      sorting: false,
      defaultFilter: isinFilterValue,
      customFilterAndSearch: (term, rowData) => term === rowData?.isin,
    },
    {
      id: "wsn",
      title: "WSN",
      customFilterAndSearch: (term, rowData) => term === rowData?.wsn,
      render: (rowData) => rowData?.wsn ?? FALLBACK_VALUE,
      sorting: false,
    },
    {
      id: "ticker",
      title: t("External Securities.Headers.Ticker"),
      render: (rowData) => rowData?.ticker ?? FALLBACK_VALUE,
      sorting: false,
    },
    {
      id: "issuanceName",
      title: t("External Securities.Headers.Issuance Name"),
      field: "issuanceName",
      render: (rowData) => rowData?.issuanceName,
    },
    {
      id: "profitRate",
      title: t("External Securities.Headers.Rate"),
      customSort: (a, b) => parseFloat(a.profitRate) - parseFloat(b.profitRate),
      render: (rowData) => {
        const localizedProfitRateStringValue = convertNumberToIntlFormat(rowData?.profitRate, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return `${localizedProfitRateStringValue}%`;
      },
      searchable: false,
    },
    {
      id: "frequency",
      title: t("External Securities.Headers.Frequency"),
      customFilterAndSearch: (term, rowData) => term === rowData?.frequency?.name,
      render: (rowData) => rowData?.frequency?.name,
      sorting: false,
    },
    {
      id: "country",
      title: t("External Securities.Headers.Country"),
      customFilterAndSearch: (term, rowData) => term === rowData?.country?.name,
      render: (rowData) => rowData?.country?.name ?? FALLBACK_VALUE, // !DEV NOTE: PRIMARY ISSUANCE ROW DATA IS NOT EXPECTED TO CONTAIN COUNTRY FIELD,
      sorting: false,
    },
    {
      id: "maturityDate",
      title: t("External Securities.Headers.Maturity Date"),
      field: "maturityDate",
      defaultFilter: dateFilterValue,
      customFilterAndSearch: (term, rowData) =>
        term === dateFormatter(rowData?.maturityDate, DEFAULT_DATE_FORMAT),
      render: (rowData) => dateFormatter(rowData?.maturityDate, DEFAULT_DATE_FORMAT),
    },
    {
      id: "currency",
      title: t("External Securities.Headers.CCY"),
      render: (rowData) => rowData?.currency?.name,
      sorting: false,
    },
    {
      id: "issuanceAmount",
      title: t("External Securities.Headers.Issuance Amount"),
      customSort: (a, b) => parseFloat(a.issuanceAmount) - parseFloat(b.issuanceAmount),
      render: (rowData) => {
        if (rowData?.issuanceAmount) {
          return convertNumberToIntlFormat(rowData?.issuanceAmount);
        }

        return FALLBACK_VALUE;
      },
      type: "numeric",
    },
    {
      id: "denomination",
      title: t("External Securities.Headers.Denomination"),
      render: (rowData) => rowData?.denomination?.name,
      sorting: false,
    },
    {
      id: "status",
      title: t("External Securities.Headers.Status"),
      render: (rowData) => rowData?.status,
      sorting: false,
      defaultFilter: statusFilterValue,
      customFilterAndSearch: (term, rowData) => term === rowData?.status,
    },
  ];

  const now = new Date();

  const dateOptionsList = [
    {
      label: "All",
      value: "",
    },
    {
      label: "Today",
      value: dateFormatter(now.toISOString(), DEFAULT_DATE_FORMAT),
    },
    {
      label: "Specific Day",
      value: null,
    },
  ];

  useEffect(() => {
    if (!tableRef.current?.dataManager) return;

    tableRef.current.dataManager.changeSearchText(searchText);
    tableRef.current.setState({ searchText });
    tableRef.current.setState(tableRef.current.dataManager.getRenderState());
  }, [searchText, tableRef]);

  return (
    <Fragment>
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <Box pb={3}>
          <Grid alignItems="flex-end" item container md={12} direction="column" spacing={2}>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setOpenAddSecurityDialog(true);
                }}
              >
                {t("External Securities.Buttons.New Security")}
              </Button>
            </Grid>
            {!inProd && (
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setOpenAddEquitySecurityDialog(true);
                  }}
                >
                  {t("External Securities.Buttons.New Equity Security")}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
        <TableFiltersWrapper>
          <TableToolbar searchText={searchText} setSearchText={setSearchText} />
          <TableFiltering
            options={{
              statusOptionsList,
              isinOptionsList,
            }}
            tableRef={tableRef}
            setStatusFilterValue={setStatusFilterValue}
            setISINFilterValue={setISINFilterValue}
          />
        </TableFiltersWrapper>
      </div>

      <MaterialTable
        tableRef={tableRef}
        size="small"
        title=""
        style={{
          boxShadow: "none",
        }}
        columns={extSecuritiesColumns}
        data={data}
        actions={[
          {
            icon: "more_vert",
            onClick: (event, rowData) => {
              setAnchorEl(event.currentTarget);
              setCurrentlySelectedRowData(rowData);
            },
          },
        ]}
        options={{
          ...tableStyles,
          toolbar: false,
          pageSize: 5,
          search: false,
          fixedColumns: {
            left: 0,
          },
          actionsColumnIndex: -1,
          draggable: false,
        }}
        localization={mtableLocalization}
      />
      <TableActionMenu actions={actions} anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} />
    </Fragment>
  );
};

export default ExternalSecuritiesTable;

export { generateExternalSecuritiesListTableRowData };

ExternalSecuritiesTable.propTypes = {
  handleCloseMenu: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      security: PropTypes.string,
      currency: PropTypes.object,
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  setCurrentlySelectedRowData: PropTypes.func.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
  setOpenAddSecurityDialog: PropTypes.func.isRequired,
};
