import Chip from "@mui/material/Chip";
import { amber, green, grey, red } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import v from "voca";
import moment from "moment";

import tableStyles from "../../styles/cssInJs/materialTable";

const chipStyle = {
  borderRadius: "3px",
  textTransform: "uppercase",
  height: "20px",
  fontWeight: "700",
  fontSize: "0.7rem",
};

export const StatusRenderer = (value) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  switch (value) {
    case "received":
      bgColor = green["100"];
      textColor = green["800"];
      break;
    case "pending":
      bgColor = grey["100"];
      textColor = grey["800"];
      break;
    case "review":
      bgColor = amber["100"];
      textColor = amber["800"];
      break;
    default:
      break;
  }
  const statusChip = (
    <Chip label={value} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />
  );
  return statusChip;
};

export const titleRenderer = (value) => {
  const titledValue = v.capitalize(value);
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

export const reportDateRenderer = (date) => {
  const inputDate = moment(date);
  let formattedDate = "NA";
  if (inputDate.isValid()) {
    formattedDate = inputDate.format("DD/MM/YYYY HH:mm:ss");
  }
  return formattedDate;
};

export const accountTypeRenderer = (value) => {
  const accountType =  value == '-' ? '-' : v.capitalize(value) || ""
  return accountType;
};

export const currencyRenderer = (value) =>
  new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const floatRenderer = (value) =>
  new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const readyToSettleRenderer = (cell) => {
  let readyToSettle = (
    <Typography variant="body1" style={{ color: "red" }}>
      {cell.label}
    </Typography>
  );
  if (cell.value) {
    readyToSettle = (
      <Typography variant="body1" style={{ color: "green" }}>
        {cell.label}
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

export const fontColorRenderer = (data, color) => {
  let textColor = grey[800];
  switch (color) {
    case "green":
      textColor = green["500"];
      break;
    case "red":
      textColor = red["500"];
      break;
    case "grey":
      textColor = grey["800"];
      break;
    case "amber":
      textColor = amber["500"];
      break;
    default:
      break;
  }
  const coloredText = (
    <Typography variant="subtitle2" style={{ color: textColor }}>
      {data}
    </Typography>
  );
  return coloredText;
};

export const quoteDateRenderer = (date) => {
  let formattedDate = "NA";
  const inputDate = moment(date);
  if (!inputDate.isValid()) return "N/A";
  if (inputDate.isSame(moment(), "day")) {
    formattedDate = inputDate.format("H:mm");
  } else {
    formattedDate = inputDate.format("DD/MM/YYYY");
  }

  return formattedDate;
};

// export const tooltipRenderer = (component, text) => <Tooltip title={text}>{component}</Tooltip>;
export const tooltipRenderer = (component, text) => (
  <Tooltip title={text} placement="bottom-start" arrow>
    <Typography style={{ ...tableStyles.rowStyle, ...tableStyles.cellStyle, cursor: "help" }}>
      {component}
    </Typography>
  </Tooltip>
);

export const idRenderer = (id) => {
  const IDArray = id.split("-");
  const [lastItem] = IDArray.slice(-1);
  return lastItem;
};

export const roundNumber = (number, decimalPlaces) => {
  // const factorOfTen = 10 ** decimalPlaces;
  // return Math.round(number * factorOfTen) / factorOfTen;
  const decimalPrecision = Number(number).toFixed(decimalPlaces);
  return decimalPrecision;
  // 5.74 0.765
};
