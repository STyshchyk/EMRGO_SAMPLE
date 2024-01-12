import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iframe from "react-iframe";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import CloseIcon from "@mui/icons-material/Close";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import { statusRenderer, typeRenderer } from "../../../../constants/renderers/support_ticket";
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
  console.log("🚀 ~ file: index.jsx:36 ~ TFATickets ~ TFATicketsList:", TFATicketsList);
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
  console.log(TFATicketsList);
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
              },
              { title: `${t("support:Support.Headers.Email")}`, field: "email" },
              {
                title: `${t("support:Support.Headers.Entity")}`,
                field: "entity",
              },
              // {
              //   title: `${t("support:Support.Headers.Role")}`,
              //   field: "role",
              // },
              {
                title: `${t("support:Support.Headers.Type")}`,
                field: "type",
                render: (rowData) => typeRenderer(rowData.type),
              },
              {
                title: `${t("support:Support.Headers.Date")}`,
                field: "date",
                type: "date",
                defaultSort: "desc",
              },
              {
                title: `Reason`,
                field: "description",
                render: (rowData) =>
                  rowData?.description || !rowData?.description === "" ? rowData.description : "--",
              },
              {
                title: `${t("support:Support.Headers.Status")}`,
                field: "type",
                render: (rowData) => statusRenderer(rowData.approved),
                customSort: (row, value) => row.approved - value.approved,
              },
            ]}
            data={TFATicketsList}
            actions={[
              (rowData) => ({
                icon: () => <FileOpenIcon />,
                tooltip: `View File`,
                disabled: !rowData.file,
                onClick: () => viewTFADocument(rowData),
              }),
              (rowData) => ({
                icon: "check",
                tooltip: `${t("support:Support.Actions.ApproveTicket")}`,
                disabled: rowData.approved,
                onClick: () => approveTicket(rowData),
              }),
              {
                icon: "delete",
                tooltip: `${t("support:Support.Actions.DeleteTicket")}`,
                onClick: (event, rowData) => deleteTicket(rowData),
              },
            ]}
            options={{
              actionsColumnIndex: -1,
              pageSize: 10,
              searchFieldVariant: "outlined",
              searchFieldStyle: {
                backgroundColor: "transparent",
                border: "1px solid gray",
              },
            }}
            // onRowClick={(event, rowData) => viewTFADocument(rowData)}
            localization={mtableLocalization}
          />

          <Dialog
            open={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {currentTicket.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="close"
                    onClick={() => {
                      setIsDocumentModalOpen(false);
                    }}
                    size="large"
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
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
