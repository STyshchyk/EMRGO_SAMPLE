import { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import {
  Select,
  useFetchAutditHistoryCombined,
  useFetchLastGroupStatus,
  useFilters,
} from "@emrgo-frontend/shared-ui";
import { GroupOptions2 } from "@emrgo-frontend/types";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuditHistoryLogs } from "./AuditLogs";
import { IAuditHistoryLogsProps } from "./AuditLogs.types";

const StatusMatrix = {
  New: "InProgress",
  InProgress: "Closed",
  Closed: null,
  Reopened: "InProgress",
};

export const GroupMessagingAuditHistory: FC<IAuditHistoryLogsProps> = ({ open, handleClose }) => {
  const { auditUrl, userType } = useFilters();
  const client = useQueryClient();
  const { data } = useFetchAutditHistoryCombined(userType, auditUrl);
  const { data: currentGroupStatus } = useFetchLastGroupStatus(userType, auditUrl);
  const { mutate } = useMutation({
    mutationFn: SecureMessagesApi.updateGroupStatus,
    onSuccess: () => {
      client.invalidateQueries([queryKeys.secureMessaging.auditHistory, auditUrl]).then(() => {});
    },
  });
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // if (reason && reason === "backdropClick") return;
        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="add-payment-account-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <Typography variant="h6">Audit history {auditUrl}</Typography>
          </Grid>

          <IconButton aria-label="close" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <AuditHistoryLogs logs={data} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Select
          className={"mr-auto w-3/12"}
          menuPortalTarget={document.body}
          options={GroupOptions2}
          placeholder={"Select status"}
          filterOption={(option) => {
            const { value, label, data } = option;
            const allowedFurtherStatus = StatusMatrix[`${currentGroupStatus}`];
            if (allowedFurtherStatus === value) return option;
            return null;
          }}
          onChange={(selectedValue) => {
            console.log(selectedValue);
            mutate({ wrapper: userType, id: auditUrl, status: selectedValue.value });
          }}
        />
        <Button variant="outlined" onClick={handleClose}>
          {" "}
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
