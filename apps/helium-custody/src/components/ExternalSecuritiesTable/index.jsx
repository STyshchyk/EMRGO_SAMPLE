import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { currencyRenderer } from "../../constants/renderers";
import { externalSecurityStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { getAttribute } from "../../helpers/custodyAndSettlement";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import { dateFormatter } from "../../utils/formatter";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";

const FALLBACK_VALUE = "--";

// TODO: REFACTOR THIS COMPONENT: ENCAPSULATE TABLE FILTERING LOGIC - SEE GLENN'S FX CODES FOR INSPIRATION

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
    ?.filter((item) => !["Short Name", "Long Name"].includes(item?.match?.name))
    .map((item) => ({
      ...item,
      identifierId: item.identifierId,
      value: item.value,
      securityIdTypeName: item.match?.name,
    })),
  coupons: i?.coupons, // for id 634
});

const ExternalSecuritiesTable = ({
  anchorEl,
  handleCloseMenu,
  data,
  actions,
  setCurrentlySelectedRowData,
  currentlySelectedRowData,
  setAnchorEl,
  setOpenAddSecurityDialog,
  setOpenAddEquitySecurityDialog,
}) => {
  const tableRef = useRef();
  const { t } = useTranslation(["external_securities"]);
  const mtableLocalization = useMaterialTableLocalization();
  const [isinFilterValue, setISINFilterValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");
  // helium issues airtable ID 259
  const sortedISIN = Array.from(
    new Set(
      data
        .filter((item) => item?.status === "Active")
        .map((item) => getAttribute(item?.attributes, "isin"))
    )
  ).sort();
  // filter out null isins
  const isinOptionsList = sortedISIN
    .filter((v) => !!v)
    .map((isin) => ({
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

  const columns = [
    {
      id: "name",
      title: t("External Securities.Headers.Security"),
      field: "name",
    },
    {
      id: "assetType",
      title: t("External Securities.Headers.Security Type"),
      render: (rowData) => rowData?.assetType,
      customSort: (a, b) => {
        return a.assetType.length - b.assetType.length;
      },
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term.toLowerCase() === rowData?.assetType?.toLowerCase();
      },
      field: "assetType",
    },
    {
      id: "isin",
      title: t("External Securities.Headers.ISIN"),
      field: "isin",
      render: (rowData) => rowData?.isin ?? getAttribute(rowData?.attributes, "isin"),
      sorting: false,
      defaultFilter: isinFilterValue,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term.toLowerCase() === rowData?.isin?.toLowerCase();
      },
    },
    {
      id: "wsn",
      title: "WSN",
      field: "wsn",
      customFilterAndSearch: (term, rowData) => term === rowData?.wsn,
      render: (rowData) => rowData?.wsn ?? FALLBACK_VALUE,
      sorting: false,
    },
    {
      id: "ticker",
      title: t("External Securities.Headers.Ticker"),
      field: "ticker",
      render: (rowData) => rowData?.ticker ?? getAttribute(rowData?.attributes, "ticker"),
      sorting: false,
    },
    {
      id: "issuanceName",
      title: t("External Securities.Headers.Issuance Name"),
      field: "issuanceName",
      render: (rowData) => rowData?.issuanceName ?? FALLBACK_VALUE,
    },
    {
      id: "profitRate",
      title: t("External Securities.Headers.Rate"),
      field: "profitRate",
      customSort: (a, b) => parseFloat(a.profitRate) - parseFloat(b.profitRate),
      render: (rowData) => {
        const localizedProfitRateStringValue = currencyRenderer(rowData?.profitRate, 6);

        return rowData?.profitRate ? `${localizedProfitRateStringValue}%` : FALLBACK_VALUE;
      },
      searchable: false,
    },
    {
      id: "frequency",
      title: t("External Securities.Headers.Frequency"),
      field: "frequency",
      customFilterAndSearch: (term, rowData) => term === rowData?.frequency?.name,
      render: (rowData) => rowData?.frequency?.name ?? FALLBACK_VALUE,
      sorting: false,
    },
    {
      id: "country",
      title: t("External Securities.Headers.Country"),
      field: "country",
      customFilterAndSearch: (term, rowData) => term === rowData?.country?.name,
      render: (rowData) => rowData?.country?.name ?? FALLBACK_VALUE, // !DEV NOTE: PRIMARY ISSUANCE ROW DATA IS NOT EXPECTED TO CONTAIN COUNTRY FIELD,
      sorting: false,
    },
    {
      id: "maturityDate",
      title: t("External Securities.Headers.Maturity Date"),
      field: "maturityDate",
      render: (rowData) => {
        return dateFormatter(rowData?.maturityDate, DEFAULT_DATE_FORMAT)
          ? dateFormatter(rowData?.maturityDate, DEFAULT_DATE_FORMAT)
          : "--";
      },
    },
    {
      id: "currency",
      title: t("External Securities.Headers.CCY"),
      field: "currency",
      render: (rowData) => rowData?.currency?.name,
      sorting: false,
    },
    {
      id: "issuanceAmount",
      title: t("External Securities.Headers.Issuance Amount"),
      field: "issuanceAmount",
      customSort: (a, b) => parseFloat(a.issuanceAmount) - parseFloat(b.issuanceAmount),
      render: (rowData) => {
        if (rowData?.issuanceAmount) {
          return currencyRenderer(rowData?.issuanceAmount, 6);
        }

        return FALLBACK_VALUE;
      },
      type: "numeric",
    },
    {
      id: "denomination",
      title: t("External Securities.Headers.Denomination"),
      field: "denomination",
      render: (rowData) => rowData?.denomination?.name ?? FALLBACK_VALUE,
      sorting: false,
    },
    {
      id: "status",
      title: t("External Securities.Headers.Status"),
      field: "status",
      render: (rowData) => rowData?.status,
      sorting: false,
      defaultFilter: statusFilterValue,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term === rowData?.status;
      },
    },
  ];

  return (
    <Fragment>
      <FilterProvider tableKey="external_security_list_key">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <Box pb={3}>
            <Grid alignItems="flex-end" item container md={12} direction="column" spacing={2}>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setOpenAddSecurityDialog(true);
                  }}
                >
                  {t("External Securities.Buttons.New Security")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setOpenAddEquitySecurityDialog(true);
                  }}
                >
                  {t("External Securities.Buttons.New Equity Security")}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
            columns={columns}
            open={true}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="status" label="Status" options={statusOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="isin" label="ISIN" options={isinOptionsList} />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>

        <FilterConsumer>
          {({ filters, filterColumns }) => {
            const filteredData = data
              .filter((row) => {
                if (filters?.status) {
                  return row.status === filters?.status?.value?.label;
                }
                return true;
              })
              .filter((row) => {
                if (filters?.isin) {
                  return row.isin === filters?.isin?.value?.value;
                }
                return true;
              });

            return (
              <Fragment>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={filterColumns.shownColumns}
                  data={filteredData}
                  actions={[
                    {
                      icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
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
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  selectedRow={currentlySelectedRowData}
                />
              </Fragment>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default ExternalSecuritiesTable;

export { generateExternalSecuritiesListTableRowData };

ExternalSecuritiesTable.propTypes = {
  handleCloseMenu: PropTypes.func,
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
  currentlySelectedRowData: PropTypes.object.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
  setOpenAddSecurityDialog: PropTypes.func.isRequired,
};
