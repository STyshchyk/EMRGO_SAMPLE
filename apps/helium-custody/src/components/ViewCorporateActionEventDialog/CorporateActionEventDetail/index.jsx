import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DEFAULT_DATE_FORMAT } from "../../../constants/datetime";
import { dateFormatter } from "../../../utils/formatter";

const Data = ({ label, value }) => (
  <Box mb={2}>
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography style={{ color: "gray" }} variant="subtitle1">
          {value}
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

const CorporateActionEventDetail = ({ currentlySelectedRow }) => (
  <Box display="flex">
    <Grid item xs={12} container>
      <Grid item xs={12} md={6}>
        <Data label="Event Type" value={currentlySelectedRow?.eventType} />
        <Data label="Event ID" value={currentlySelectedRow?.eventId} />
        <Data label="Linked Event ID" value={currentlySelectedRow?.linkedEventId} />
        <Data label="Event Status" value={currentlySelectedRow?.eventStatus} />
        <Data label="Security ISIN" value={currentlySelectedRow?.securityId} />
        <Data label="Security Name" value={currentlySelectedRow?.securityName} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Data
          label="Ex Date"
          value={dateFormatter(currentlySelectedRow?.exDate, DEFAULT_DATE_FORMAT)}
        />
        <Data
          label="Record Date"
          value={dateFormatter(currentlySelectedRow?.recordDate, DEFAULT_DATE_FORMAT)}
        />
        <Data
          label="Payment Date"
          value={dateFormatter(currentlySelectedRow?.paymentDate, DEFAULT_DATE_FORMAT)}
        />
      </Grid>
    </Grid>
  </Box>
);

export default CorporateActionEventDetail;
