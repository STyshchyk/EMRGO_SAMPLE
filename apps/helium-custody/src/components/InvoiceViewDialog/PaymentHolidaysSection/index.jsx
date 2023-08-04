import { createRef, Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import MaterialTable from "@material-table/core";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import MuiTextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { dateRenderer, idRenderer } from "../../../constants/renderers";
import { findOverlaps } from "../../../helpers/dates";
import MaterialTableCustomButtonRenderer from "../../MaterialTableCustomButtonRenderer";
import MaterialTableCustomDatepickerRenderer from "../../MaterialTableCustomDatepickerRenderer";
import ToastMessageRenderer from "../../ToastMessageRenderer";

const PaymentHolidaysSection = ({
  modalType,
  selectedRow,
  localPaymentHolidays,
  setLocalPaymentHolidays,
}) => {
  const [paymentHolidayOverlaps, setPaymentHolidayOverlaps] = useState([]);
  const [showPaymentHolidayOverlapsError, setShowPaymentHolidayOverlapsError] = useState(true);

  const { t } = useTranslation(["billing"]);

  // HOLIDAY
  const holidayTableRef = createRef();

  const handleToggleApplyHoliday = (requestObject) => {
    const holidayId = requestObject.id;
    const tempLocalPaymentHolidays = [...localPaymentHolidays];
    const foundIndex = tempLocalPaymentHolidays.findIndex((holiday) => holiday.id === holidayId);
    const foundPaymentHolidays = tempLocalPaymentHolidays[foundIndex];
    tempLocalPaymentHolidays[foundIndex] = {
      ...foundPaymentHolidays,
      isApplied: !foundPaymentHolidays.isApplied,
    };
    setLocalPaymentHolidays([...tempLocalPaymentHolidays]);
  };

  const holidayTableColumns = [
    {
      title: "Holiday Ref",
      field: "id",
      editable: "never",
      render: (rowData) => idRenderer(rowData.id),
    },
    {
      title: "Start Date",
      field: "start_date",
      render: (rowData) => dateRenderer(rowData.start_date),
      initialEditValue: moment(),
      editComponent: (props) => <MaterialTableCustomDatepickerRenderer openTo="year" {...props} />,
    },
    {
      title: "End Date",
      field: "end_date",
      render: (rowData) => dateRenderer(rowData.end_date),
      initialEditValue: moment(),
      editComponent: (props) => <MaterialTableCustomDatepickerRenderer openTo="year" {...props} />,
    },
    {
      title: "Invoice Narrative",
      field: "invoice_narrative.String",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="Narrative"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Apply",
      field: "isApplied",
      // width: 100,
      editable: "never",
      // align: 'right',
      render: (rowData) => (
        <Checkbox
          color="primary"
          checked={rowData.isApplied}
          onChange={() => handleToggleApplyHoliday(rowData)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      ),
    },
  ];

  useEffect(() => {
    const { overlaps } = findOverlaps(
      localPaymentHolidays.filter((paymentHoliday) => paymentHoliday.isApplied),
      true
    );

    setPaymentHolidayOverlaps(overlaps);
  }, [localPaymentHolidays]);

  const handleAddHoliday = (requestPayload, resolve) => {
    setLocalPaymentHolidays([...localPaymentHolidays, requestPayload]);
    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeletePaymentHoliday = (requestObject, resolve) => {
    const filteredCharges = localPaymentHolidays.filter(
      (holiday) => !requestObject.includes(holiday.id)
    );
    setLocalPaymentHolidays([...filteredCharges]);
    resolve();
  };

  return (
    <Box my={4}>
      <MaterialTable
        title={
          <Typography
            variant="h6"
            className={paymentHolidayOverlaps.length > 0 ? "text-yellow-500" : ""}
          >
            Payment Holidays
            {paymentHolidayOverlaps.length > 0 ? (
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={() => {
                  setShowPaymentHolidayOverlapsError(true);
                }}
                size="large"
              >
                <ErrorOutlineIcon fontSize="inherit" />
              </IconButton>
            ) : (
              ""
            )}
          </Typography>
        }
        columns={holidayTableColumns}
        tableRef={holidayTableRef}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
        }}
        options={{
          // search: false,
          searchFieldVariant: "outlined",
          actionsColumnIndex: -1,
        }}
        data={localPaymentHolidays}
        editable={
          modalType === "amend"
            ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      start_date: yup.date().required("Start Date is required"),
                      end_date: yup.date().required("End Date is required"),
                      // end_date: yup.date().min(yup.ref('startDate'), "End date can't be before start date").required('End Date is required'),
                      // narrative: yup.string().required('Invoice Narrative is required'),
                    });

                    const requestObject = {
                      id: uuidv4(),
                      isNew: true,
                      client_rate_card_id: selectedRow?.id,
                      start_date: newData?.start_date?.format(),
                      end_date: newData?.end_date?.format(),
                      narrative: newData?.narrative,
                      isApplied: true,
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleAddHoliday(requestObject, resolve);
                        } else {
                          toast.warning("Safekeeping data inputted is incomplete/invalid.", 2000);
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: "Payment Holidays Errors",
                            messages: errors?.map((error) => {
                              const errorIcon = <ErrorOutlineIcon />;
                              return {
                                text: error,
                                icon: errorIcon,
                              };
                            }),
                          },
                        ];
                        toast(<ToastMessageRenderer groupedMessages={groupedMessages} />, {
                          position: "bottom-left",
                          closeOnClick: true,
                          autoClose: 10000,
                          limit: 1,
                        });
                        reject();
                      });
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    const requestObject = [oldData.id];
                    handleDeletePaymentHoliday(requestObject, resolve);
                  }),
              }
            : {}
        }
      />
      {paymentHolidayOverlaps.length > 0 && showPaymentHolidayOverlapsError ? (
        <Fragment>
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShowPaymentHolidayOverlapsError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>
              {t("Invoice Management.View Dialog.OverlappingPeriodMessageKey", {
                count: paymentHolidayOverlaps.length,
              })}
            </AlertTitle>
            <ul>
              {paymentHolidayOverlaps.map((overlap) => {
                const firstPeriod = overlap[0];
                const secondPeriod = overlap[1];
                return (
                  <li className="list-disc" key={`${firstPeriod.id}-${secondPeriod.id}`}>
                    <Typography>
                      Holiday Ref #{idRenderer(firstPeriod.id)} and #{idRenderer(secondPeriod.id)}
                    </Typography>
                  </li>
                );
              })}
            </ul>
          </Alert>
        </Fragment>
      ) : (
        ""
      )}
    </Box>
  );
};

export default PaymentHolidaysSection;
