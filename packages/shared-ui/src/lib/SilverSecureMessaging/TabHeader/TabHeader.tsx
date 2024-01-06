import React, { FC, useRef, useState } from "react";

import { Button, Select } from "@emrgo-frontend/shared-ui";
import CloseIcon from "@mui/icons-material/Close";
import { FormControl, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useFilters } from "../../Context/filter-context";
import * as Styles from "./TabHeader.styles";
import { ITabHeaderProps } from "./TabHeader.types";

const statusOptions = [
  {
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "Open",
    value: "open",
  },
];
const labelOption = [
  {
    label: "KYC Query",
    value: "KYC Query",
  },
  {
    label: "Compliance Query",
    value: "Compliance Query",
  },
  {
    label: "Operational Query",
    value: "Operational Query",
  },
  {
    label: "Accounting Query",
    value: "Accounting Query",
  },
  {
    label: "Technical Query",
    value: "Technical Query",
  },
  {
    label: "Support Query",
    value: "Support Query",
  },
  {
    label: "Funds Order Submission",
    value: "Funds Order Submission",
  },
];

const queryOptions = [
  {
    label: "Subject",
    value: "querySubject",
  },
  {
    label: "Status",
    value: "queryStatus",
    option: statusOptions,
  },
  {
    label: "Entity",
    value: "queryEntity",
  },
  {
    label: "Label",
    value: "queryLabel",
    option: labelOption,
  },
  {
    label: "Date",
    value: "queryDate",
  },
];
const initialValues = {
  queryType: null,
  queryLabel: "",
  queryEntity: null,
  queryDateStart: null,
  queryDateEnd: null,
  queryStatus: null,
  querySubject: null,
};
export const TabHeader: FC<ITabHeaderProps> = ({}) => {
  const [query, setQuery] = useState([]);
  const ref = useRef<HTMLInputElement>(null);
  const [selectedQueryType, setSelectedQueryType] = useState(null);
  const [selectedDropDown, setDropDown] = useState(null);
  const { setFilterValue, filters } = useFilters();
  console.log(filters);
  const handleDelete = (id) => {
    setQuery((prevArray) => {
      // Filter out the item with the specified id
      const newArray = prevArray.filter((item) => item.queryType !== id);
      return newArray;
    });
  };
  const addOrUpdateObject = (newObject) => {
    // Check if the object already exists in the array
    const index = query.findIndex((obj) => obj.queryType === newObject.queryType);

    if (index !== -1) {
      // If it exists, update the existing object
      setQuery((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = newObject;
        return newArray;
      });
    } else {
      // If it doesn't exist, add the new object to the array
      setQuery((prevArray) => [...prevArray, newObject]);
    }
  };

  function AddQuery() {}

  return (
    <Styles.TabHeaderWrapper>
      <Grid container>
        <Grid container xs={8} direction={"row"}>
          <Grid item xs={2}>
            <Select
              options={queryOptions}
              menuPortalTarget={document.body}
              value={selectedQueryType}
              isClearable={true}
              placeholder={"Select query"}
              onChange={(selectedValue) => {
                if (ref.current) {
                  ref.current.value = null;
                }
                setSelectedQueryType(selectedValue);
                setDropDown(null);
              }}
            />
          </Grid>
          <Grid item xs={5} flexDirection={"column"}>
            {(() => {
              if (["queryDate"].includes(selectedQueryType?.value)) {
                return (
                  <TextField
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {}}
                    name="searchText"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: {
                        height: "23.47px",
                      },
                    }}
                    InputProps={{
                      inputComponent: ({ inputRef, ...rest }) => (
                        <FormControl
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <DatePicker
                            label="Start Date"
                            sx={{
                              width: "100%",
                              ".MuiInputBase-input": { padding: "8.75px 14px" },
                              ".MuiInputLabel-shrink": {
                                display: "none",
                              },
                              ".MuiOutlinedInput-notchedOutline": {
                                border: "none !important",
                              },
                            }}
                          />
                          <span> - </span>
                          <DatePicker
                            label="End Date"
                            sx={{
                              width: "100%",
                              ".MuiInputBase-input": { padding: "8.75px 14px" },
                              ".MuiInputLabel-shrink": {
                                display: "none",
                              },
                              ".MuiOutlinedInput-notchedOutline": {
                                border: "none !important",
                              },
                            }}
                          />
                          <input ref={inputRef} {...rest} type="text" style={{ display: "none" }} />
                        </FormControl>
                      ),
                    }}
                  />
                );
              } else if (["querySubject", "queryEntity"].includes(selectedQueryType?.value)) {
                return (
                  <TextField
                    fullWidth
                    inputRef={ref}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {}}
                    label={"Search"}
                    name="searchText"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: {
                        height: "23.47px",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear search"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (ref.current) {
                                ref.current.value = null;
                              }
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              } else {
                return (
                  <Select
                    options={selectedQueryType?.option}
                    menuPortalTarget={document.body}
                    isClearable={true}
                    value={selectedDropDown}
                    placeholder={`Select ${selectedQueryType?.label ?? ""}`}
                    onChange={(selectedValue, actionMeta) => {
                      setDropDown(selectedValue);
                      // setFilterValue(selectedValue, selectedQueryType?.label, selectedQueryType?.label, "dropdown");
                    }}
                  />
                );
              }
            })()}
          </Grid>
          <Grid item xs={2} container alignItems={"center"}>
            <Button
              size={"medium"}
              type={"submit"}
              onClick={() => {
                if ((ref.current || selectedDropDown) && selectedQueryType) {
                  const oldValue = {
                    queryType: selectedQueryType?.value,
                    queryLabel: selectedQueryType?.label,
                    value: ref?.current?.value ?? selectedDropDown.value,
                  };
                  addOrUpdateObject(oldValue);
                }
              }}
            >
              + Add query
            </Button>
          </Grid>
        </Grid>

        <Grid xs={4}>
          <Stack direction="row" spacing={1} flexWrap={"wrap"} gap={"0.5rem"}>
            {query.map((elem) => {
              return (
                <Chip
                  key={elem.queryType}
                  variant="outlined"
                  color={"primary"}
                  sx={{ marginLeft: "0px !important" }}
                  label={`${elem.queryLabel} : ${elem.value}`}
                  onDelete={() => {
                    handleDelete(elem.queryType);
                  }}
                />
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Styles.TabHeaderWrapper>
  );
};
