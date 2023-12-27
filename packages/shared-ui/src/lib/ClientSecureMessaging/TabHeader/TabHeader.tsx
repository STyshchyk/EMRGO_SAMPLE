import React, { FC, useState } from "react";

import { Input, Select } from "@emrgo-frontend/shared-ui";
import { Grid } from "@mui/material";

import * as Styles from "./TabHeader.styles";
import { ITabHeaderProps } from "./TabHeader.types";

const queryOptions = [
  {
    label: "Subject",
    value: "subject",
  },
  {
    label: "Status",
    value: "status",
  },
  {
    label: "Entity",
    value: "entity",
  },
  {
    label: "Label",
    value: "label",
  },
  {
    label: "Date",
    value: "Date",
  },
];
export const TabHeader: FC<ITabHeaderProps> = ({}) => {
  const [query, setQuery] = useState();
  const [size, setSize] = useState(6);
  return (
    <Styles.TabHeaderWrapper>
      <Grid container>
        <Grid container xs={4} direction={"row"}>
          <Grid item xs={3}>
            <Select
              options={queryOptions}
              menuPortalTarget={document.body}
              onChange={(selectedValue) => {
                console.log(selectedValue);
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Input label={"hello"} type={"text"} variant={"signup"} />
          </Grid>
        </Grid>
      </Grid>
    </Styles.TabHeaderWrapper>
  );
};
