import { HTMLAttributes } from "react";

export interface IAuditLogsProps extends HTMLAttributes<HTMLSpanElement> {
  logs: IAudit[];
}

export interface IAudit {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  userType: string;
  entityGroupId: string;
  prevStatus: string;
  newStatus: string;
  auditTimestamp: Date;
  auditType: string;
  auditSubType: string;
  auditSubTypeId: string;
  createdAt: Date;
  updatedAt: Date;
  auditColumnLabel: string;
  auditTrxId: string;
}

export interface IAuditLogItem {
  log: IAudit;
  isFirst: boolean;
  isLast: boolean;
}
