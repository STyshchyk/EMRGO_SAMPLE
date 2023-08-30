import Chip from "@mui/material/Chip";
import { amber, green, grey, red } from "@mui/material/colors";
import v from "voca";

const chipStyle = {
  borderRadius: "3px",
  textTransform: "uppercase",
  height: "20px",
  fontWeight: "700",
  fontSize: "0.7rem",
};

export const typeRenderer = (value) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  switch (value) {
    case "MFA reset":
      bgColor = amber["100"];
      textColor = amber["800"];
      break;
    case "Password reset":
      bgColor = red["100"];
      textColor = red["800"];
      break;
    default:
      break;
  }
  const statusChip = (
    <Chip
      label={v.capitalize(value)}
      style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }}
    />
  );
  return statusChip;
};

export const statusRenderer = (value) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  let text = "Pending";
  if (value) {
    bgColor = green["100"];
    textColor = green["800"];
    text = "Approved";
  } else {
    bgColor = grey["300"];
    textColor = grey["800"];
    text = "Pending";
  }
  const statusChip = (
    <Chip
      label={v.capitalize(text)}
      style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }}
    />
  );
  return statusChip;
};

export const titleRenderer = (value) => v.capitalize(value);
