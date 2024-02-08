import React, { FC, useEffect, useState } from "react";

import {
  ExpandArrow,
  Input,
  MySelect as Select,
  useFetchEntities,
} from "@emrgo-frontend/shared-ui";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

import "react-datepicker/dist/react-datepicker.css";

import { useFetchDropdowns } from "@emrgo-frontend/services";
import { GroupOptions } from "@emrgo-frontend/types";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useLocalStorage } from "usehooks-ts";

import { useFilters } from "../../Context/filter-context";
import { TFilterValue } from "../../Context/filter-context.types";
import * as Styles from "./TabHeader.styles";
import { DatePickerStyled } from "./TabHeader.styles";
import { ITabHeaderProps } from "./TabHeader.types";

const queryOptions = [
  {
    label: "Subject",
    value: "querySubject",
  },
  {
    label: "Status",
    value: "queryStatus",
    option: GroupOptions,
  },
  {
    label: "Entity",
    value: "queryEntity",
  },
  {
    label: "Label",
    value: "queryLabel",
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
  const [selectedQueryType, setSelectedQueryType] = useState(queryOptions[1]);
  const [selectDropDown, setSelectDropDown] = useState(queryOptions);
  const { setFilterValue, filters, setFilters, userType, clearFilterValue } = useFilters();
  const [isMenuHidden, setMenuHidded] = useLocalStorage<boolean>("SideBarState", false);
  const { data: labelData } = useFetchDropdowns("message_label");
  const [selectedDropDown, setDropDown] = useState(null);
  const [localFilters, setLocalFilters] = useState<TFilterValue | null>(null);

  const { data: entityData, isRefetching: isEntityFetching } = useFetchEntities(
    userType === "internal"
  );

  useEffect(() => {
    if (!entityData && userType === "client") {
      setSelectDropDown((prevState) => {
        const prevOptions = [...prevState].filter((elem) => elem.value !== "queryEntity");
        return prevOptions;
      });
    }
    if (entityData) {
      setSelectDropDown((prevState) => {
        const prevOptions = [...prevState];
        const findOption = prevOptions.find((elem) => elem.value === "queryEntity");
        findOption.option = entityData;
        return prevOptions;
      });
    }
    if (labelData) {
      setSelectDropDown((prevState) => {
        const prevOptions = [...prevState];
        const findOption = prevOptions.find((elem) => elem.value === "queryLabel");
        findOption.option = labelData.message_label;
        return prevOptions;
      });
    }
  }, [entityData, labelData]);

  function SetLocalFilters(
    value: any,
    key: string,
    label: string,
    type: string,
    filterValue: string
  ) {
    setLocalFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = { value, label, key, type, filterValue };
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
      <span className={"whitespace-nowrap"}>Search by</span>
      <Styles.SearchWrapper>
        <Select
          variant={"signup"}
          border={true}
          options={selectDropDown}
          menuPortalTarget={document.body}
          value={selectedQueryType}
          isClearable={true}
          placeholder={"Select query"}
          onChange={(selectedValue) => {
            setLocalFilters(null);
            setSelectedQueryType(selectedValue);
            setDropDown(null);
          }}
        />
        {(() => {
          if (["queryDate"].includes(selectedQueryType?.value)) {
            return (
              <Styles.DatePickerWrapper>
                <DatePickerStyled
                  selectsRange={true}
                  placeholderText={"Start Date - End Date"}
                  startDate={localFilters?.date?.filterValue.date1}
                  endDate={localFilters?.date?.filterValue.date2}
                  enableTabLoop={false}
                  shouldCloseOnSelect={
                    localFilters?.filterValue?.date1 && !localFilters?.filterValue?.date2
                  }
                  onBlur={() => {
                    console.log("blur");
                  }}
                  onChange={(update) => {
                    // SetLocalFilters(update[0], "startDate", "Start Date", "date");
                    SetLocalFilters(
                      `${moment(update[0]).format("DD/MM/YYYY")} -`,
                      "date",
                      "Date",
                      "date",
                      { date1: update[0], date2: update[1] }
                    );
                    if (update[1])
                      SetLocalFilters(
                        `${moment(update[0]).format("DD/MM/YYYY")} - ${moment(update[1]).format(
                          "DD/MM/YYYY"
                        )}`,
                        "date",
                        "Date",
                        "date",
                        { date1: update[0], date2: update[1] }
                      );
                  }}
                />
                <Styles.ClearButton
                  onClick={(event) => {
                    event.stopPropagation();
                    setLocalFilters(null);
                    console.log("click");
                  }}
                >
                  <ClearIcon fontSize={"small"} />
                </Styles.ClearButton>
              </Styles.DatePickerWrapper>
            );
          } else if (["querySubject"].includes(selectedQueryType?.value)) {
            return (
              <Input
                variant={"signup"}
                label={"Search"}
                border={true}
                onChange={(e) => {
                  SetLocalFilters(
                    e.target.value,
                    selectedQueryType.value,
                    selectedQueryType.label,
                    "text",
                    e.target.value
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
                border={true}
                value={selectedDropDown}
                placeholder={`Select ${selectedQueryType?.label ?? ""}`}
                getOptionValue={(option) => {
                  return option;
                }}
                getOptionLabel={(option) => {
                  return selectedQueryType?.value === "queryEntity"
                    ? `${option?.entityName}`
                    : option?.label;
                }}
                onChange={(selectedValue, actionMeta) => {
                  setDropDown(selectedValue);
                  const isEntityQuery = selectedQueryType.value === "queryEntity";
                  SetLocalFilters(
                    isEntityQuery ? selectedValue.entityName : selectedValue.value,
                    selectedQueryType.value,
                    selectedQueryType.label,
                    "dropdown",
                    isEntityQuery ? selectedValue.entityId : selectedValue.value
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
            if (!localFilters) return;
            for (let loopFilter in localFilters) {
              const obj = localFilters[loopFilter];
              console.log(obj);
              setFilterValue(obj.value, loopFilter, obj.label, obj.type, obj.filterValue);
            }
            setLocalFilters(null);
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
              return (
                <Chip
                  key={elem.key}
                  variant="outlined"
                  color={"primary"}
                  sx={{
                    marginLeft: "0px !important",
                    "& .MuiChip-label": {
                      maxWidth: "250px",
                    },
                  }}
                  label={`${elem?.label}:  ${elem?.value}`}
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
