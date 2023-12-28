import React, { FC, useRef, useState } from "react";

import { Button, Input, Select } from "@emrgo-frontend/shared-ui";
import { Grid } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import * as Styles from "./TabHeader.styles";
import { ITabHeaderProps } from "./TabHeader.types";

const queryOptions = [
  {
    label: "Subject",
    value: "querySubject",
  },
  {
    label: "Status",
    value: "queryStatus",
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
    value: "Date",
  },
];

const statuses = [
  {
    label: "resolved",
    value: "resolved",
  },
  {
    label: "open",
    value: "open",
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
  console.log(query);

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
      <Grid container xs={4} direction={"row"}>
        <Grid item xs={5}>
          <Select
            options={queryOptions}
            menuPortalTarget={document.body}
            value={selectedQueryType}
            isClearable={true}
            placeholder={"Select query"}
            onChange={(selectedValue) => {
              // if (values.queryType) {
              //   setFieldValue(`${values?.queryType?.value}`, "");
              // }
              if (ref.current) {
                ref.current.value = null;
              }
              setSelectedQueryType(selectedValue);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Input type={"text"} variant={"default"} ref={ref} />

          <div style={{ position: "absolute", display: "none", zIndex: "1000" }}>
            <DateCalendar
              onChange={(event) => {
                console.log(event);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={3} container alignItems={"center"}>
          <Button
            size={"medium"}
            type={"submit"}
            onClick={() => {
              if (ref.current && selectedQueryType) {
                const oldValue = {
                  queryType: selectedQueryType.value,
                  queryLabel: selectedQueryType.label,
                  value: ref.current.value,
                };
                addOrUpdateObject(oldValue);
              }
            }}
          >
            + Add query
          </Button>
        </Grid>
      </Grid>

      <Grid container xs={4} direction={"row"}>
        <Stack direction="row" spacing={1}>
          {query.map((elem) => {
            return (
              <Chip
                key={elem.queryType}
                variant="outlined"
                color={"primary"}
                label={`${elem.queryLabel} : ${elem.value}`}
                onDelete={() => {
                  handleDelete(elem.queryType);
                }}
              />
            );
          })}
        </Stack>
      </Grid>
    </Styles.TabHeaderWrapper>
  );
};
