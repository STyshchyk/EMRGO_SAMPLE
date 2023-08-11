import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iframe from "react-iframe";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import {
  statusRenderer,
  titleRenderer,
  typeRenderer,
} from "../../../../constants/renderers/support_ticket";
import { useTheme } from "../../../../context/theme-context";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as supportActionCreators from "../../../../redux/actionCreators/support";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as supportSelectors from "../../../../redux/selectors/support";
import style from "./style.module.scss";

const TFATickets = () => {
  const { t } = useTranslation(["support"]);
  const mtableLocalization = useMaterialTableLocalization();
  const dispatch = useDispatch();
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState("");
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetchingTFATickets = useSelector(supportSelectors.selectIsFetching);
  const TFATicketsList = useSelector(supportSelectors.selectTFATickets);
  const isLoading = useSelector(supportSelectors.selectIsLoading);
  const currentTFAVerificationDocument = useSelector(
    supportSelectors.selectCurrentTFAVerificationDocument
  );
  const { theme } = useTheme();
  const { locale } = theme;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchTickets = () => dispatch(supportActionCreators.doFetchTFATickets());
    fetchTickets();
  }, [dispatch]);

  const approveTicket = (ticket) => {
    const requestPayload = {
      supportTicketId: ticket.id,
    };
    const approveCurrentTicket = () =>
      dispatch(supportActionCreators.doApproveTFATicket(requestPayload));
    approveCurrentTicket();
  };

  const deleteTicket = (ticket) => {
    const requestPayload = {
      supportTicketId: ticket.id,
    };
    const deleteCurrentTicket = () =>
      dispatch(supportActionCreators.doDeleteTFATicket(requestPayload));
    deleteCurrentTicket();
  };

  const viewTFADocument = (ticket) => {
    setIsDocumentModalOpen(true);
    setCurrentTicket(ticket);
    const fetchCurrentTicketDocument = (payload) =>
      dispatch(supportActionCreators.doFetchTFAVerificationDocument(payload));
    fetchCurrentTicketDocument({ key: ticket.file });
  };

  return (
    <Fragment>
      {isFetchingTFATickets ? (
        <LoadingIndicator />
      ) : (
        <Box>
          <MaterialTable
            title="Two Factor Authentication Support Tickets"
            columns={[
              {
                title: `${t("support:Support.Headers.Name")}`,
                field: "name",
                render: (rowData) =>
                  `${rowData.user.firstName} ${rowData.user.middleName || " "} ${
                    rowData.user.lastName
                  }`,
              },
              { title: `${t("support:Support.Headers.Email")}`, field: "user.email" },
              {
                title: `${t("support:Support.Headers.Entity")}`,
                field: "user.entityGroups[0].group.entity.corporateEntityName",
              },
              {
                title: `${t("support:Support.Headers.Role")}`,
                field: "user",
                render: (rowData) =>
                  titleRenderer(rowData.user.entityGroups[0]?.group?.entityType ?? "N.A"),
              },
              {
                title: `${t("support:Support.Headers.Type")}`,
                field: "type",
                render: (rowData) => typeRenderer(rowData.type),
              },
              {
                title: `${t("support:Support.Headers.Date")}`,
                field: "createdAt",
                type: "date",
              },
              {
                title: `${t("support:Support.Headers.Status")}`,
                field: "type",
                render: (rowData) => statusRenderer(rowData.approved),
              },
            ]}
            data={JSON.parse(JSON.stringify(TFATicketsList))}
            actions={[
              (rowData) => ({
                icon: "check",
                tooltip: `${t("support:Support.Action.ApproveTicket")}`,
                disabled: rowData.approved,
                onClick: () => approveTicket(rowData),
              }),
              {
                icon: "delete",
                tooltip: `${t("support:Support.Action.DeleteTicket")}`,
                onClick: (event, rowData) => deleteTicket(rowData),
              },
            ]}
            options={{
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            onRowClick={(event, rowData) => viewTFADocument(rowData)}
            localization={mtableLocalization}
          />

          <Dialog
            open={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">{currentTicket.title}</DialogTitle>
            <DialogContent
              className={style.document_dialogue__content}
              dir={locale.rtl ? "rtl" : "ltr"}
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <Iframe
                  id="iframe-pdf"
                  className={style.document_dialogue__iframe}
                  src={currentTFAVerificationDocument}
                  position="relative"
                  width="100%"
                  height="100%"
                />
              )}
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </Fragment>
  );
};

export default TFATickets;