import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const AgreementStatusSection = ({
  isAdmin,
  label,
  sectionSignedSigned,
  handleAcceptAgreementOpen,
}) => {
  const { t } = useTranslation(["administration"]);

  return (
    <Fragment>
      <TableRow key={label}>
        <TableCell component="th" scope="row">
          {label}
        </TableCell>
        <TableCell align="right">
          {sectionSignedSigned ? (
            <Typography variant="button" color="secondary">
              {t("administration:EntityManagement.EntityManagementTable.ENABLED")}
            </Typography>
          ) : (
            <Fragment>
              {isAdmin ? (
                <Typography variant="button" color="primary">
                  {t("administration:EntityManagement.EntityManagementTable.REQUESTED")}
                </Typography>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  endIcon={<ChevronRightIcon fontSize="small" />}
                  onClick={() => handleAcceptAgreementOpen()}
                >
                  {t("administration:EntityManagement.EntityManagementTable.ENABLE")}
                </Button>
              )}
            </Fragment>
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

AgreementStatusSection.propTypes = {};

export default AgreementStatusSection;
