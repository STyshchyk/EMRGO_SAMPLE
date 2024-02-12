import { FC } from "react";

import { DEFAULT_DATE_TIME_FORMAT_SM } from "@emrgo-frontend/utils";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

import { IAuditLogItem, IAuditLogsProps } from "./AuditLogs.types";

const AuditItem = ({ log, isFirst, isLast }: IAuditLogItem) => {
  console.log("🚀 ~ file: AuditLogs.tsx:26 ~ AuditItem ~ log:", log);
  let color = "primary";
  let icon = null;
  let auditHistoryStatement = "";
  let change = "";
  const userFullName = `${log.changedByUser.firstName} ${log.changedByUser.lastName}`;
  const userType = `${log?.entityType.charAt(0).toUpperCase() + log?.entityType.slice(1)}`;

  switch (log.oldStatus) {
    case "New":
      color = "primary";
      icon = <AddIcon size="small" color={color} />;
      auditHistoryStatement = `Updated by ${log.changedByUser.firstName} ${log.changedByUser.lastName}`;
      change = `Status changed from ${log.oldStatus} to ${log.newStatus}`;
      break;
    case "InProgress":
      color = "error";
      icon = <CloseIcon size="small" color={color} />;
      auditHistoryStatement = `Updated by ${log.changedByUser.firstName} ${log.changedByUser.lastName}`;
      change = `Status changed from ${log.oldStatus} to ${log.newStatus}`;
      break;
    case "Closed":
      color = "primary";
      icon = <ReplayIcon size="small" color={color} />;
      auditHistoryStatement = `Updated by ${log.changedByUser.firstName} ${log.changedByUser.lastName}`;
      change = `Status changed from ${log.oldStatus} to ${log.newStatus}`;
      break;

    default:
      break;
  }
  return (
    <TimelineItem>
      <TimelineOppositeContent sx={{ m: "auto 0" }} variant="body2" color="text.secondary">
        {dayjs(log.createdAt).format(DEFAULT_DATE_TIME_FORMAT_SM)}
      </TimelineOppositeContent>
      <TimelineSeparator className={"justify-center"}>
        {!isFirst && <TimelineConnector />}
        <TimelineDot color={color} variant="outlined">
          {icon}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography variant="h6" component="span">
          {change}
        </Typography>
        <Typography color="text.secondary">{`${auditHistoryStatement}`}</Typography>
        <Typography color="text.secondary" variant="caption">{`${userType}`}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export const AuditHistoryLogs: FC<IAuditLogsProps> = (props) => {
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
          return (
            <AuditItem
              log={log}
              isFirst={index === 0}
              isLast={index === logs.length - 1}
              key={`${log.createdAt}`}
            />
          );
        })}
      </Timeline>
    </div>
  );
};
