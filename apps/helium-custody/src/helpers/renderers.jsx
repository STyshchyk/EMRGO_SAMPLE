import React from "react";

import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import moment from "moment";

export const titleRenderer = (value) => {
  const titledValue = capitalCase(value);
  return titledValue;
};

export const dateRenderer = (date) => {
  const inputDate = moment(date);
  let formattedDate = "NA";
  if (inputDate.isValid()) {
    formattedDate = inputDate.format("DD/MM/YYYY");
  }
  return formattedDate;
};

export const currencyRenderer = (value) =>
  new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const floatRenderer = (value, minimumFractionDigits = 2, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("en", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

export const readyToSettleRenderer = (value) => {
  let readyToSettle = (
    <Typography variant="body1" style={{ color: "red" }}>
      No
    </Typography>
  );
  if (value) {
    readyToSettle = (
      <Typography variant="body1" style={{ color: "green" }}>
        Yes
      </Typography>
    );
  }
  return readyToSettle;
};

export const settleButtonRenderer = (instance, td, row, col, prop, value, settleTrade) => {
  // Handsontable.dom.empty(td);
  const { settlementStatus } = value.investor;
  const elementList = document.createElement("div");
  let element = "";

  switch (settlementStatus) {
    case "In Queue":
    case "Settling":
    case "Settled":
      element = document.createElement("button");
      element.setAttribute("type", "button");
      element.disabled = true;
      element.classList.add("btn", "btn--micro", "btn-text--small-text", "btn--disabled");
      element.append(document.createTextNode("Settle"));
      break;
    case "Ready to Settle":
      element = document.createElement("button");
      element.setAttribute("type", "button");
      element.disabled = false;
      element.addEventListener("click", () => {
        settleTrade(value);
      });
      element.classList.add("btn", "btn--micro", "btn-text--small-text", "btn--secondary");
      element.append(document.createTextNode("Settle"));
      break;
    default:
      element = document.createTextNode("N/A");
  }

  elementList.append(element);
  td.append(elementList);
  return td;
};

export const roundNumber = (number, decimalPlaces) => {
  // const factorOfTen = 10 ** decimalPlaces;
  // return Math.round(number * factorOfTen) / factorOfTen;
  const decimalPrecision = Number(number).toFixed(decimalPlaces);
  return decimalPrecision;
  // 5.74 0.765
};
