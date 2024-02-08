import { HTMLAttributes } from "react";

import { IAudit, ISecureAudit } from "@emrgo-frontend/types";

export interface IAuditLogsProps extends HTMLAttributes<HTMLSpanElement> {
  logs: ISecureAudit;
}

export interface IAuditLogItem {
  log: IAudit;
  isFirst: boolean;
  isLast: boolean;
}

export interface IAuditHistoryLogsProps {
  open: boolean;
  handleClose: () => void;
}
