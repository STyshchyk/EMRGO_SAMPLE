import { createRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import MaterialTable from "@material-table/core";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MuiTextField from "@mui/material/TextField";
import { camelCase } from "change-case";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { currencyRenderer } from "../../../constants/renderers";
import MaterialTableCustomButtonRenderer from "../../MaterialTableCustomButtonRenderer";
import MaterialTableCustomDropdownRenderer from "../../MaterialTableCustomDropdownRenderer";
import ToastMessageRenderer from "../../ToastMessageRenderer";

const SafekeepingChargesSection = ({
  modalType,
  selectedRow,
  securityTypeOptions,
  countriesLookup,
  localSafekeepingCharges,
  setLocalSafekeepingCharges,
}) => {
  const { t } = useTranslation(["billing"]);

  // SAFEKEEPING
  const safekeepingTableRef = createRef();

  const safekeepingTableColumns = [
    {
      title: "Security Type",
      field: "asset_type_id",
      lookup: securityTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Security Country / ICSD",
      field: "asset_country_icsd_id",
      lookup: countriesLookup,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Txn Band Start",
      field: "band_start",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="Start ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Txn Band End",
      field: "band_end",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="End ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Charge(BPS)",
      field: "charge_in_bps",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="Charge"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
      render: (rowData) => `$${currencyRenderer(rowData.charge_in_bps)}`,
    },
    {
      title: "Calculated Val",
      field: "calculated_valuation",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          fullWidth
          label="Valuation"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Charge(USD)",
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
      render: (rowData) => `$${currencyRenderer(rowData.charge)}`,
    },
  ];

  const processedSafeKeepingData = localSafekeepingCharges.map((band) => {
    const concatedKey = `${camelCase(band.asset_country_icsd_name)}_${camelCase(
      band.asset_type_name
    )}`;
    return {
      ...band,
      band_end: band.band_end === -1 ? Infinity : band.band_end,
      type: concatedKey,
    };
  });

  const handleAddSafekeeping = (requestPayload, resolve) => {
    setLocalSafekeepingCharges([...localSafekeepingCharges, requestPayload]);
    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteSafekeeping = (requestObject, resolve) => {
    const filteredCharges = localSafekeepingCharges.filter(
      (charge) => !requestObject.includes(charge.id)
    );
    setLocalSafekeepingCharges([...filteredCharges]);
    resolve();
  };

  const handleEditSafekeeping = (requestObject, resolve) => {
    const updatedSafekeepingChargeArray = [...localSafekeepingCharges];
    const foundIndex = updatedSafekeepingChargeArray.findIndex((x) => x.id === requestObject.id);
    updatedSafekeepingChargeArray[foundIndex] = requestObject;
    setLocalSafekeepingCharges([...updatedSafekeepingChargeArray]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  return (
    <Box my={4}>
      <MaterialTable
        title="Safekeeping Charges"
        columns={safekeepingTableColumns}
        tableRef={safekeepingTableRef}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
        }}
        options={{
          // search: false,
          searchFieldVariant: "filled",
          actionsColumnIndex: -1,
        }}
        data={processedSafeKeepingData}
        editable={
          modalType === "amend"
            ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      asset_type_id: yup.string().required("Security Type is required"),
                      asset_country_icsd_id: yup.string().required("Country/ICSD is required"),
                      band_start: yup.number().integer("Band start amount must be an integer"),
                      band_end: yup.number().integer("Band end amount must be an integer"),
                      charge_in_bps: yup
                        .number()
                        .required("Charge is required")
                        .positive("Charge must be a positive number"),
                      calculated_valuation: yup
                        .number()
                        .required("Valuation is required")
                        .positive("Valuation must be a positive number"),
                      charge: yup
                        .number()
                        .required("Total amount is required")
                        .positive("Total must be a positive number"),
                    });

                    const requestObject = {
                      id: uuidv4(),
                      isNew: true,
                      client_rate_card_id: selectedRow?.id,
                      asset_type_id: newData?.asset_type_id?.value,
                      asset_country_icsd_id: newData?.asset_country_icsd_id?.value,
                      band_start: Number(newData.band_start || 0),
                      band_end: Number(newData.band_end || -1),
                      charge_in_bps: Number(newData?.charge_in_bps),
                      calculated_valuation: Number(newData?.calculated_valuation),
                      charge: Number(newData?.charge),
                      name: {
                        String: newData?.asset_type_id?.label,
                        valid: true,
                      },
                      name_2: {
                        String: newData?.asset_country_icsd_id?.label,
                        valid: true,
                      },
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleAddSafekeeping(requestObject, resolve);
                        } else {
                          toast.warning("Safekeeping data inputted is incomplete/invalid.", 2000);
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: "Safekeeping Charge Errors",
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
                      asset_type_id: yup.string().required("Security Type is required"),
                      asset_country_icsd_id: yup.string().required("Country/ICSD is required"),
                      band_start: yup.number().integer("Band start amount must be an integer"),
                      band_end: yup.number().integer("Band end amount must be an integer"),
                      // charge_in_bps: yup.number().required('Charge is required').positive('Charge must be a positive number'),
                      // calculated_valuation: yup.number().required('Valuation is required').positive('Valuation must be a positive number'),
                      charge: yup
                        .number()
                        .required("Total amount is required")
                        .positive("Total must be a positive number"),
                    });

                    const requestObject = {
                      id: oldData.id,
                      isNew: oldData?.isNew || false,
                      client_rate_card_id: selectedRow?.id,
                      asset_type_id: newData?.asset_type_id?.value
                        ? newData?.asset_type_id?.value
                        : newData?.asset_type_id,
                      asset_country_icsd_id: newData?.asset_country_icsd_id?.value
                        ? newData?.asset_country_icsd_id?.value
                        : newData?.asset_country_icsd_id,
                      band_start: Number(newData.band_start || 0),
                      band_end: Number(newData.band_end || -1),
                      charge_in_bps: Number(newData?.charge_in_bps),
                      calculated_valuation: Number(newData?.calculated_valuation),
                      charge: Number(newData?.charge),
                      name: {
                        String: newData?.asset_type_id?.label,
                        valid: true,
                      },
                      name_2: {
                        String: newData?.asset_country_icsd_id?.label,
                        valid: true,
                      },
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleEditSafekeeping(requestObject, resolve);
                        } else {
                          toast.warning("Safekeeping data inputted is incomplete/invalid.", 2000);
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: "Safekeeping Charge Errors",
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
                    handleDeleteSafekeeping(requestObject, resolve);
                  }),
              }
            : {}
        }
      />
    </Box>
  );
};

export default SafekeepingChargesSection;
