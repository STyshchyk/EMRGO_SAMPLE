import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { useTheme } from "../../context/theme-context";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as authSelectors from "../../redux/selectors/auth";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import LoadingIndicator from "../LoadingIndicator";
import PrimaryIssuanceDetails from "../PrimaryIssuanceDetails";
import StyledDialogHeader from "../StyledDialogHeader";

const baseSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 10,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#23389c",
  }),
};

const baseSelectProps = {
  closeMenuOnSelect: true,
  isClearable: true,
  isSearchable: true,
  menuPortalTarget: document.body,
  styles: baseSelectStyles,
};

const ViewSecuritiesRegistrationDialog = ({ sukukData, open, handleClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(["securitiesRegistration"]);

  const dispatch = useDispatch();
  const { locale } = theme;

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const isFetchingAdmissionTerms = useSelector(issuanceSelectors.selectFetchingAdmissionTerms);
  const isFetchingAdmissionTermsheetData = useSelector(
    issuanceSelectors.selectFetchingAdmissionTermsheetData
  );
  const isFetchingAdmissionStatus = useSelector(issuanceSelectors.selectIsFetchingStatus);
  const isFetchingTermsheetData = useSelector(issuanceSelectors.selectFetchingTermsheet);

  const currentEntityGroupID = currentEntityGroup?.id;
  const isLoading =
    isFetchingTermsheetData ||
    isFetchingAdmissionTermsheetData ||
    isFetchingAdmissionTerms ||
    isFetchingAdmissionStatus;

  const admissionTermsheetData = useSelector(issuanceSelectors.selectAdmissionTermsData);
  const termsheetInfoEn = useSelector(issuanceSelectors.selectTermsheetInfo);
  const termsheetInfoAr = useSelector(issuanceSelectors.selectTermsheetInfoAr);

  const termsheetInfo = locale.altLocale === "ar-sa" ? termsheetInfoAr : termsheetInfoEn;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchTermsheet = (payload) => dispatch(issuanceActionCreators.doFetchTermsheet(payload));
    const fetchAdmissionTermsheetData = (payload) =>
      dispatch(issuanceActionCreators.doFetchAdmissionTermsheetData(payload));
    const fetchSukukStatus = (payload) =>
      dispatch(issuanceActionCreators.doFetchAdmissionStatus(payload));
    const resetTermsheet = () => dispatch(issuanceActionCreators.doResetIssuanceTermsheet());

    const payload = {
      sukukId: sukukData?.id,
    };

    fetchTermsheet(payload);
    fetchAdmissionTermsheetData(payload);
    fetchSukukStatus(payload);

    return () => {
      resetTermsheet();
    };
  }, [dispatch, currentEntityGroupID, sukukData?.id]);

  if (isLoading)
    return (
      <Grid container justifyContent="center">
        <LoadingIndicator />
      </Grid>
    );

  return (
    <Dialog
      disableEscapeKeyDown
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="securities-registration-dialog-title"
    >
      <StyledDialogHeader
        title={t("securitiesRegistration:DialogTitle")}
        handleClose={handleClose}
      />
      <DialogContent>
        <Box mb={2}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Typography paragraph>{t("securitiesRegistration:InstructionText")}</Typography>
            </Grid>
            <Grid sm={6} item>
              <FormControl fullWidth margin="normal">
                <Select
                  {...baseSelectProps}
                  isDisabled
                  value={{
                    label: sukukData.csd,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <PrimaryIssuanceDetails
                termsheetInfo={termsheetInfo}
                admissionTermsheetData={admissionTermsheetData}
                disableDocumentsAccordionItem={!["ISSUER"].includes(currentEntityType)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ViewSecuritiesRegistrationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ViewSecuritiesRegistrationDialog;
