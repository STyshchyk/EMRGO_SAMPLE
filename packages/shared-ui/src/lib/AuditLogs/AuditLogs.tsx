import { FC } from "react";



import { dateFormatter } from "@emrgo-frontend/utils";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HotelIcon from "@mui/icons-material/Hotel";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import RepeatIcon from "@mui/icons-material/Repeat";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Typography } from "@mui/material";



import { IAuditLogItem, IAuditLogsProps } from "./AuditLogs.types";





const AuditItem = ({ log, isFirst, isLast }: IAuditLogItem) => {
  console.log("🚀 ~ file: AuditLogs.tsx:26 ~ AuditItem ~ log:", log)
  let color = "error";
  let icon = null;
  let auditHistoryStatement = "";
  let change = `${log.prevStatus || "-"} to ${log.newStatus || "-"} `;
  const userFullName = `${log.firstName} ${log.lastName}`;

  if (log.auditType === "Action")
    switch (log.auditSubType) {
      case "Removed":
        color = "warning";
        icon = <DeleteOutlinedIcon size="small" color={color} />;
        auditHistoryStatement = `${log.auditColumnLabel} ${log.auditSubType} by ${userFullName}`;
        change = `Removed ${log.auditColumnLabel || "-"} - ${log.newStatus || "-"}`;
        break;
      case "Inserted":
        color = "success";
        icon = <NoteAddOutlinedIcon size="small" color={color} />;
        auditHistoryStatement = `Record ${log.auditSubType} by ${userFullName}`;
        change = `Inserted ${log.newStatus || "-"}`;
        break;
      case "Added":
        color = "primary";
        icon = <AddIcon size="small" color={color} />;
        auditHistoryStatement = `${log.auditColumnLabel} ${log.auditSubType} by ${userFullName}`;
        change = `Added ${log.auditColumnLabel || "-"} - ${log.newStatus || "-"}`;
        break;
      case "Amended":
        color = "primary";
        icon = <EditIcon size="small" color={color} />;
        auditHistoryStatement = `${log.auditColumnLabel} ${log.auditSubType} by ${userFullName}`;
        change = `${log.prevStatus || "-"} to ${log.newStatus || "-"} `;
        break;

      default:
        break;
    }

  return (
    <TimelineItem>
      <TimelineOppositeContent sx={{ m: "auto 0" }} variant="body2" color="text.secondary">
        {dateFormatter(log.createdAt, "DD/MM/YYYY HH:MM:ss")}
      </TimelineOppositeContent>
      <TimelineSeparator>
        {!isFirst && <TimelineConnector />}
        <TimelineDot color={color} variant="outlined">
          {icon}
        </TimelineDot>
        {!isLast && (
          <TimelineConnector />
        )}
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography variant="h6" component="span">
          {change}
        </Typography>
        <Typography color="text.secondary">{`${auditHistoryStatement}`}</Typography>
        <Typography color="text.secondary" variant="caption">{`${userFullName}`}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export const AuditLogs: FC<IAuditLogsProps> = (props) => {
  const { logs } = props;
  const orderedLogs = logs ? [...logs].reverse() : [];
  return (
    <div>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {orderedLogs?.map((log, index) => {
          return <AuditItem log={log} isFirst={index === 0} isLast={index === logs.length - 1} />;
        })}
      </Timeline>
    </div>
  );
};