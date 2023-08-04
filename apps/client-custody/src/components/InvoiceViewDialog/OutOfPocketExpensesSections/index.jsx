import { createRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import MaterialTable from "@material-table/core";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MuiTextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { currencyRenderer, idRenderer } from "../../../constants/renderers";
import MaterialTableCustomButtonRenderer from "../../MaterialTableCustomButtonRenderer";
import ToastMessageRenderer from "../../ToastMessageRenderer";

const OutOfPocketExpensesSections = ({
  modalType,
  localOutOfPocketExpenses,
  setLocalOutOfPocketExpenses,
}) => {
  const { t } = useTranslation(["billing"]);

  // OUT OF POCKET EXPENSES
  const outOfPocketExpensesTableRef = createRef();

  const outOfPocketExpensesTableColumns = [
    {
      title: "Expense Ref",
      field: "id",
      width: 150,
      editable: "never",
      render: (rowData) => idRenderer(rowData.id),
    },
    {
      title: "Expense Narrative",
      field: "narrative.String",
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
      title: "Charge (USD)",
      field: "charge",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="Charge ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
      render: (rowData) => `${currencyRenderer(rowData.charge)}`,
    },
  ];

  const handleAddOutOfPocketExpenses = (requestPayload, resolve) => {
    setLocalOutOfPocketExpenses([...localOutOfPocketExpenses, requestPayload]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteOutOfPocketExpenses = (requestObject, resolve) => {
    const filteredTransactions = localOutOfPocketExpenses.filter(
      (charge) => !requestObject.includes(charge.id)
    );
    setLocalOutOfPocketExpenses([...filteredTransactions]);
    resolve();
  };

  const handleEditOutOfPocketExpenses = (requestObject, resolve) => {
    const updatedSafekeepingChargeArray = [...localOutOfPocketExpenses];
    const foundIndex = updatedSafekeepingChargeArray.findIndex((x) => x.id === requestObject.id);
    updatedSafekeepingChargeArray[foundIndex] = requestObject;
    setLocalOutOfPocketExpenses([...updatedSafekeepingChargeArray]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  return (
    <Box my={4}>
      <MaterialTable
        title="Out of Pocket Expenses"
        columns={outOfPocketExpensesTableColumns}
        tableRef={outOfPocketExpensesTableRef}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
        }}
        options={{
          // search: false,
          searchFieldVariant: "outlined",
          actionsColumnIndex: -1,
        }}
        data={localOutOfPocketExpenses}
        editable={
          modalType === "amend"
            ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      charge: yup.number().required("Charge is required"),
                    });

                    const requestObject = {
                      id: uuidv4(),
                      isNew: true,
                      charge: Number(newData?.charge),
                      narrative: newData?.narrative,
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleAddOutOfPocketExpenses(requestObject, resolve);
                        } else {
                          toast.warning(
                            "Out of Pocket Expense data inputted is incomplete/invalid.",
                            2000
                          );
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: "Out of Pocket Expense Errors",
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
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      charge: yup.number().required("Charge is required"),
                    });

                    const requestObject = {
                      id: oldData.id,
                      isNew: oldData?.isNew || false,
                      charge: Number(newData?.charge),
                      narrative: newData?.narrative,
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleEditOutOfPocketExpenses(requestObject, resolve);
                        } else {
                          toast.warning(
                            "Out of Pocket Expenses data inputted is incomplete/invalid.",
                            2000
                          );
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: "Out of Pocket Expenses Errors",
                            messages: errors.map((error) => {
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
                        return {};
                      });
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    const requestObject = [oldData.id];
                    handleDeleteOutOfPocketExpenses(requestObject, resolve);
                  }),
              }
            : {}
        }
      />
    </Box>
  );
};

export default OutOfPocketExpensesSections;
