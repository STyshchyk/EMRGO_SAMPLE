import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import MaterialTable, { MTableAction } from "@material-table/core";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CsvBuilder } from "filefy";
import moment from "moment";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { currencyRenderer } from "../../constants/renderers";
import { couponAllocationStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import { dateFormatter } from "../../utils/formatter";
import ImportCouponPaymentScheduleDataDialog from "./ImportCouponPaymentScheduleDataDialog";

const generateCouponPaymentScheduleTableRowData = (i) => {
  const { index, id, calenderDate, notional, couponAllocationStatus } = i;

  return {
    id,
    index,
    calenderDate,
    notional,
    couponAllocationStatus,
  };
};

const normalizeDateObject = (date) => {
  if (date && date instanceof Date) {
    // Make a deep copy of the date object
    const normalizedDate = new Date(date.getTime());

    // Reset the date-time component
    normalizedDate.setHours(0, 0, 0, 0);

    return normalizedDate;
  }

  return null;
};

const CouponPaymentScheduleTable = ({
  hardcodedCouponRate,
  tableData,
  setTableData,
  isLoading,
  editable,
}) => {
  const [isImportFileDialogOpen, setIsImportFileDialogOpen] = useState(false);
  const isTableDataEmpty = Array.isArray(tableData) && !tableData.length > 0;
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports", ""]);

  const handleOnRowAdd = async (newData) => {
    setTableData([
      ...tableData,
      {
        ...newData,
        calenderDate: normalizeDateObject(newData.calenderDate),
      },
    ]);
  };

  const handleOnRowUpdate = async (newData, oldData) => {
    const updatedData = tableData.map((item) => {
      if (item.id === oldData.id) {
        return { ...item, ...newData };
      }
      return item;
    });

    setTableData(updatedData);
  };

  const handleOnRowDelete = async (oldData) => {
    const dataDelete = [...tableData];
    const updatedData = dataDelete.filter((item) => item.id !== oldData?.id);
    setTableData([...updatedData]);
  };

  const validateDateField = (rowData) => {
    const { calenderDate } = rowData;
    let isValid = false;
    // TODO: TRANSLATE THIS
    const calendarDateHelperText = "Please select a valid date";

    // !!! DATE VALUE SHOULD NOT BE EDITABLE ON UPDATE OR DELETE
    const skipValidation = ["update", "delete"].includes(rowData.tableData?.editing);

    if (skipValidation) {
      return { isValid: true }; // to delete an existing row
    }

    if (calenderDate instanceof Date && !skipValidation) isValid = true;

    /*
    EXPECTED RETURN TYPE
    validate?: (
      rowData: RowData
    ) => { isValid: boolean; helperText?: string } | string | boolean;
    */
    return {
      isValid,
      helperText: !isValid ? calendarDateHelperText : "",
    };
  };

  const validateNotionalAmountField = (rowData) => {
    const { notional } = rowData;
    const isValid = notional > 0;
    // TODO: TRANSLATE THIS
    const helperText = "Please enter a valid value";

    /*
    EXPECTED RETURN TYPE
    validate?: (
      rowData: RowData
    ) => { isValid: boolean; helperText?: string } | string | boolean;
    */
    return {
      isValid,
      helperText: !isValid ? helperText : "",
    };
  };

  const handleCSVExportClick = (data) => {
    const generatedAtTimestamp = new Date().toISOString();
    const csvFileName = `coupon_payment_schedule_${generatedAtTimestamp}.csv`;
    console.log(data);
    const transformed = data.map(({ calenderDate, notional, couponAllocationStatus }) => ({
      date: new Date(calenderDate).toLocaleDateString(),
      notionalAmount: currencyRenderer(notional, 6),
      couponRate: currencyRenderer(hardcodedCouponRate, 6),
      couponAllocationStatus,
    }));

    const listOfColumnNames = ["date", "notional_amount", "coupon_rate", "status"];
    console.log(listOfColumnNames);
    const listOfRows = transformed.map(
      ({ date, notionalAmount, couponRate, couponAllocationStatus }) => [
        [date],
        [notionalAmount],
        [couponRate],
        [couponAllocationStatus],
      ]
    );

    const csvBuilder = new CsvBuilder(csvFileName)
      .setColumns(listOfColumnNames)
      .addRows(listOfRows);

    csvBuilder.exportFile();
  };

  const disableDay = (date) => {
    const listOfNormalizedDateISOStrings = tableData.map((item) =>
      normalizeDateObject(new Date(item.calenderDate)).toISOString()
    );
    const givenDateObject = normalizeDateObject(date.toDate());
    const todaysDateObject = normalizeDateObject(new Date());

    // Disable days that meet either of the following conditions: if it is today's date or if it's already been taken
    return (
      givenDateObject.toISOString() === todaysDateObject.toISOString() ||
      listOfNormalizedDateISOStrings.includes(givenDateObject.toISOString())
    );
  };

  return (
    <Fragment>
      <MaterialTable
        isLoading={isLoading}
        size="small"
        style={{
          boxShadow: "none",
        }}
        title=""
        editable={
          editable
            ? {
                onRowAdd: handleOnRowAdd,
                onRowUpdate: handleOnRowUpdate,
                onRowDelete: handleOnRowDelete,
              }
            : undefined
        }
        columns={[
          {
            id: "date",
            title: t("Coupon Payment Schedule.Headers.Date"),
            field: "calenderDate",
            defaultSort: "asc",
            type: "date",
            editable: "onAdd",
            validate: validateDateField,
            render: (rowData) => dateFormatter(rowData?.calenderDate, DEFAULT_DATE_FORMAT),
            editComponent: (props) => (
              <Fragment>
                <DatePicker
                  format={DEFAULT_DATE_FORMAT}
                  value={props.value ? moment(props.value) : null}
                  onChange={(e) => {
                    props.onChange(e.toDate());
                  }}
                  disablePast
                  shouldDisableDate={disableDay}
                  className={
                    "MuiInputBase-root MuiInput-root MuiInput-underline Mui-error MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl"
                  }
                />
                {props.error && (
                  <div className="MuiFormHelperText-root Mui-error">{props.helperText}</div>
                )}
              </Fragment>
            ),
          },
          {
            id: "notionalAmount",
            title: t("Coupon Payment Schedule.Headers.Notional"),
            field: "notional",
            type: "numeric",
            render: (rowData) => currencyRenderer(rowData.notional, 6),
            validate: validateNotionalAmountField,
          },
          {
            id: "coupon",
            title: t("Coupon Payment Schedule.Headers.Coupon"),
            field: "coupon",
            type: "numeric",
            editable: "never",
            initialEditValue: hardcodedCouponRate,
            readonly: true,
            render: () => (
              <span
                style={{
                  color: "gray",
                }}
              >
                {`${currencyRenderer(hardcodedCouponRate, 6)}%`}
              </span>
            ),
          },
          {
            id: "couponAllocationStatus",
            title: "Status",
            field: "couponAllocationStatus",
            editable: "never",
          },
        ]}
        data={tableData}
        components={{
          Action: (props) => {
            const { data } = props;
            const { calenderDate, couponAllocationStatus } = data;
            const todayDateObject = normalizeDateObject(new Date());
            const calenderDateObject = normalizeDateObject(new Date(calenderDate));
            const isAfterToday = calenderDateObject.valueOf() > todayDateObject.valueOf();

            if (["Save", "Cancel"].includes(props.action?.tooltip))
              return <MTableAction {...props} />;

            const disabled =
              !isAfterToday ||
              [
                couponAllocationStatusEnum.PENDING_APPROVAL,
                couponAllocationStatusEnum.ALLOCATED,
              ].includes(couponAllocationStatus);
            // Disable an ability to edit past coupon row objects
            return <MTableAction {...props} disabled={disabled} />;
          },

          Toolbar: (props) => {
            const { actions, originalData: data } = props;
            const addActionItem = actions.find((i) => i.tooltip === "Add");

            const handleAddClick = () => {
              addActionItem.onClick();
            };

            const disableImportCSVDataButton = data?.some(({ couponAllocationStatus }) =>
              [
                couponAllocationStatusEnum.PENDING_APPROVAL,
                couponAllocationStatusEnum.ALLOCATED,
              ].includes(couponAllocationStatus)
            );

            return (
              <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                {editable && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setIsImportFileDialogOpen(true);
                      }}
                      disabled={disableImportCSVDataButton}
                    >
                      <strong>IMPORT CSV DATA</strong>
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={isTableDataEmpty}
                    onClick={() => {
                      handleCSVExportClick(data);
                    }}
                  >
                    <strong>EXPORT AS CSV</strong>
                  </Button>
                </Grid>

                {editable && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={handleAddClick}
                    >
                      <strong>ADD +</strong>
                    </Button>
                  </Grid>
                )}
              </Grid>
            );
          },
        }}
        options={{
          ...tableStyles,
          showTitle: false,
          draggable: false,
          search: false,
          headerStyle: {
            fontWeight: "bold",
            color: "#23389c",
            fontSize: "1rem",
          },
        }}
        localization={mtableLocalization}
      />
      {isImportFileDialogOpen && (
        <ImportCouponPaymentScheduleDataDialog
          setTableData={setTableData}
          open={isImportFileDialogOpen}
          handleClose={() => {
            setIsImportFileDialogOpen(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default CouponPaymentScheduleTable;

export { generateCouponPaymentScheduleTableRowData };
