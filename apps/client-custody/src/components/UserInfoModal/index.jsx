import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";

import regionSwitcher from "../../helpers/regions";
import { dateFormatter } from "../../utils/formatter";

const dateFormat = "DD/MM/YYYY HH:MM";

const UserInfoModal = ({ open, onClose, selectedUserInfo }) => {
  const { t } = useTranslation(["onboarding"]);
  const { user, userStatus, userTimeline } = selectedUserInfo;

  function createData(label, data) {
    return { label, data };
  }

  let userInfoRows = [
    createData(t("onboarding:Info.First Name"), user?.firstName),
    createData(t("onboarding:Info.Middle Name"), user?.middleName),
    createData(t("onboarding:Info.Last Name"), user?.lastName),
    createData(t("onboarding:Info.Entity Name"), user?.entityName),
    createData(t("onboarding:Info.Corporate Email"), user?.email),
    createData(t("onboarding:Info.Jurisdiction"), user?.jurisdiction),
    createData(t("onboarding:Info.Entity Type"), capitalCase(user?.entityUserType)),
    createData(t("onboarding:Info.Assigned Role"), capitalCase(user?.role)),
    createData(t("onboarding:Info.Classification"), capitalCase(user?.selfAssessment)),
    createData(t("onboarding:Info.Capacity"), user?.individualKyc?.capacity?.name),
    createData(t("onboarding:Info.Designation"), user?.individualKyc?.designation),
    createData(
      t("onboarding:Info.Relationship Manager"),
      user?.relationshipManagers
        ? user?.relationshipManagers.map(
            (manager, index) =>
              `${index !== 0 ? "," : ""}${manager.firstName || ""} ${manager.middleName || ""} ${
                manager.lastName || ""
              }`
          )
        : ""
    ),
  ];

  userInfoRows = [
    ...userInfoRows,
    ...regionSwitcher({
      sa: [
        createData(t("onboarding:Info.Gender"), user?.individualKyc?.gender),
        createData(t("onboarding:Info.Birth Date"), user?.individualKyc?.dob),
        createData(t("onboarding:Info.ID Number"), user?.individualKyc?.idNumber),
        createData(t("onboarding:Info.Mobile Number"), user?.individualKyc?.mobileNumber),
        createData(t("onboarding:Info.Nationality"), user?.individualKyc?.nationality),
        createData(t("onboarding:Info.Passport Number"), user?.individualKyc?.passportNumber),
        createData(
          t("onboarding:Info.Passport Expiry Date"),
          dateFormatter(user?.individualKyc?.passportExpiry, dateFormat)
        ),
      ],
      ae: [createData(t("onboarding:Info.Mobile Number"), user?.individualKyc?.mobileNumber)],
    }),
  ];

  const userStatusRows = [
    createData(t("onboarding:Info.Account Status"), userStatus?.accountStatus),
    createData(t("onboarding:Info.Onboarding Status"), userStatus?.onboardingStatus),
    createData(t("onboarding:Info.Entity KYC Status"), userStatus?.entityKycStatus),
    createData(t("onboarding:Info.User KYC Status"), userStatus?.individualKycStatus),
    createData(t("onboarding:Info.2FA Status"), userStatus?.mfaStatus),
    // createData(t('onboarding:Info.Client Terms Status'), userStatus?.clientTermsStatus),
  ];

  const userTimelineRows = [
    createData(t("onboarding:Info.Last Login"), dateFormatter(userTimeline?.lastLogin, dateFormat)),
    createData(
      t("onboarding:Info.Date of Invitation ( reminder after 3 days )"),
      dateFormatter(userTimeline?.dateOfInvitation, dateFormat)
    ),
    createData(
      t("onboarding:Info.Date of T&C Accepted"),
      dateFormatter(userTimeline?.dateOfTnCAcceptance, dateFormat)
    ),
    createData(
      t("onboarding:Info.Date of Onboarding"),
      dateFormatter(userTimeline?.dateOfOnboarding, dateFormat)
    ),
    createData(
      t("onboarding:Info.Date of Entity KYC requested"),
      dateFormatter(userTimeline?.dateOfKycRequest, dateFormat)
    ),
    createData(
      t("onboarding:Info.Date of Entity KYC start"),
      dateFormatter(userTimeline?.dateOfKycStart, dateFormat)
    ),
    createData(
      t("onboarding:Info.Date of Entity KYC complete/User Approval"),
      dateFormatter(userTimeline?.dateOfKycComplete, dateFormat)
    ),
    // createData(t('onboarding:Info.Date of Client Terms sent'), dateFormatter(userTimeline?.dateOfClientTermsSent, 'DD/MM/YYYY HH:mm')),
    // createData(t('onboarding:Info.Date of Client Terms complete'), dateFormatter(userTimeline?.dateOfClientTermsComplete, 'DD/MM/YYYY HH:mm')),
  ];

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{ className: "overflow-y-visible" }}
      >
        <DialogContent>
          <Grid container>
            <TableContainer>
              <Typography variant="h6">{t("onboarding:Info.User Information")}</Typography>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Item
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Data
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userInfoRows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row" className="w-1/2">
                        {row.label}
                      </TableCell>
                      <TableCell className="w-1/2">{row?.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
              <br />
              <Typography variant="h6">{t("onboarding:Info.User Status")}</Typography>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Item
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Data
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userStatusRows?.map((row) => (
                    <TableRow key={row?.name}>
                      <TableCell component="th" scope="row" className="w-1/2">
                        {row?.label}
                      </TableCell>
                      <TableCell className="w-1/2">{row?.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
              <br />
              <Typography variant="h6">{t("onboarding:Info.User Timeline")}</Typography>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Item
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={1} className="w-1/2">
                      <Typography color="primary" className="font-bold">
                        Data
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userTimelineRows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row" className="w-1/2">
                        {row.label}
                      </TableCell>
                      <TableCell className="w-1/2">{row?.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="flex-end" className="mx-4 mb-4">
            <Grid item xs={12} lg={3}>
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={onClose}>
                {t("onboarding:Forms.Close")}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

UserInfoModal.propTypes = {};

export default UserInfoModal;
