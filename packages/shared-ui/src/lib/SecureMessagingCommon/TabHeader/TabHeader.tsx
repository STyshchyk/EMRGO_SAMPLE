import React, { FC, useRef, useState } from "react";

import {
  ExpandArrow,
  Input,
  MySelect as Select,
  useFetchEntities,
} from "@emrgo-frontend/shared-ui";
import { DEFAULT_DATE_FORMAT } from "@emrgo-frontend/utils";
import { FormControl, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocalStorage } from "usehooks-ts";

import { useFilters } from "../../Context/filter-context";
import { TFilterValue } from "../../Context/filter-context.types";
import * as Styles from "./TabHeader.styles";
import { ITabHeaderProps } from "./TabHeader.types";

const statusOptions = [
  {
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "In Progress",
    value: "in_progress",
  },
  {
    label: "Closed",
    value: "closed",
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
  const ref = useRef<HTMLInputElement>(null);
  const { userType } = useFilters();
  const [selectedQueryType, setSelectedQueryType] = useState(queryOptions[0]);
  const [selectedDropDown, setDropDown] = useState(null);
  const [localFilters, setLocalFilters] = useState<TFilterValue | null>(null);
  const {
    data: entityData,
    isRefetching: isEntityFetching,
    isSuccess,
  } = useFetchEntities(userType === "internal");
  const { setFilterValue, filters, setFilters, clearFilterValue } = useFilters();
  const [isMenuHidden, setMenuHidded] = useLocalStorage<boolean>("SideBarState", false);
  function SetLocalFilters(value: any, key: string, label: string, type: string) {
    setLocalFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = { value, label, key, type };
      return updatedFilters;
    });
  }

  const handleDelete = (key: string[] | string) => {
    clearFilterValue(key);
  };

  function AddQuery() {}

  return (
    <Styles.TabHeaderWrapper id={"MinNavBar"} className={"relative"}>
      <ExpandArrow
        onClick={() => {
          setMenuHidded((prevState) => (prevState = !prevState));
        }}
      />
      <span>Search by</span>
      <Styles.SearchWrapper>
        <Select
          variant={"signup"}
          options={queryOptions}
          menuPortalTarget={document.body}
          value={selectedQueryType}
          isClearable={true}
          placeholder={"Select query"}
          onChange={(selectedValue) => {
            console.log(selectedValue);
            if (ref.current) {
              ref.current.value = null;
            }
            setLocalFilters(null);
            setSelectedQueryType(selectedValue);
            setDropDown(null);
          }}
        />
        {(() => {
          if (["queryDate"].includes(selectedQueryType?.value)) {
            return (
              <TextField
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                }}
                name="searchText"
                variant="outlined"
                size="small"
                inputProps={{
                  style: {
                    height: "24.0px",
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
                        format={DEFAULT_DATE_FORMAT}
                        value={localFilters?.startDate?.value}
                        sx={{
                          width: "100%",
                          ".MuiInputLabel-shrink": {
                            display: "none",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            border: "none !important",
                          },
                        }}
                        onChange={(selectedValue) => {
                          console.log(selectedValue);
                          SetLocalFilters(selectedValue, "startDate", "Start Date", "date");
                        }}
                      />
                      <span> - </span>
                      <DatePicker
                        label="End Date"
                        format={DEFAULT_DATE_FORMAT}
                        key={"date"}
                        value={localFilters?.endDate?.value}
                        sx={{
                          width: "100%",
                          ".MuiInputLabel-shrink": {
                            display: "none",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            border: "none !important",
                          },
                        }}
                        onChange={(selectedValue) => {
                          SetLocalFilters(selectedValue, "endDate", "End Date", "date");
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
              <Input
                variant={"signup"}
                label={"Search"}
                onChange={(e) => {
                  SetLocalFilters(
                    e.target.value,
                    selectedQueryType.value,
                    selectedQueryType.label,
                    "text"
                  );
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
                  // setLocalFilters({
                  //   value: selectedValue.value,
                  //   key: selectedQueryType.value,
                  //   label: selectedQueryType.label,
                  //   type: "dropdown",
                  // });
                  SetLocalFilters(
                    selectedValue.value,
                    selectedQueryType.value,
                    selectedQueryType.label,
                    "dropdown"
                  );
                }}
              />
            );
          }
        })()}

        <Button
          size={"medium"}
          type={"submit"}
          onClick={() => {
            console.log(filters);
            if (!localFilters) return;
            for (let loopFilter in localFilters) {
              const obj = localFilters[loopFilter];
              setFilterValue(obj.value, loopFilter, obj.label, obj.type);
            }
            // localFilters.forEach(elem =>{
            //   setFilters(elem.value, elem.key, elem.label, elem.type)
            // })
            setLocalFilters(null);
            // if ((ref.current || selectedDropDown) && selectedQueryType) {
            //   const oldValue = {
            //     queryType: selectedQueryType?.value,
            //     queryLabel: selectedQueryType?.label,
            //     value: ref?.current?.value ?? selectedDropDown.value,
            //   };
            //   addOrUpdateObject(oldValue);
            // }
          }}
        >
          + Add query
        </Button>
      </Styles.SearchWrapper>

      <Styles.FilterWrapper>
        <Stack direction="row" spacing={1} flexWrap={"wrap"} gap={"0.5rem"}>
          {filters &&
            Object.values(filters).map((elem, index) => {
              const dateType = elem.type === "date";
              console.log(elem);
              console.log(dateType);
              return (
                <Chip
                  key={elem.key}
                  variant="outlined"
                  color={"primary"}
                  sx={{ marginLeft: "0px !important" }}
                  label={`${elem?.label} : ${
                    dateType ? elem?.value.format("DD/MM/YYYY") : elem?.value
                  }`}
                  onDelete={() => {
                    handleDelete(elem.key);
                  }}
                />
              );
            })}
        </Stack>
      </Styles.FilterWrapper>
    </Styles.TabHeaderWrapper>
  );
};
