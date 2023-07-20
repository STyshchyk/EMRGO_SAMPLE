import { Fragment, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import MaterialTable from "@material-table/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import InputIcon from "@mui/icons-material/Input";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
// import { Link } from 'react-router-dom';
import { capitalCase } from "change-case";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
// import * as dropdownSelectors from '../../../../redux/selectors/dropdown';
// import * as entitiesActionCreators from '../../../../redux/actionCreators/entities';
// import * as entitiesSelectors from '../../../../redux/selectors/entities';
// import * as authSelectors from '../../../../redux/selectors/auth';

import { useTheme } from "../../../../context/theme-context";
import { dateRenderer } from "../../../../helpers/renderers";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import tableStyles from "../../../../styles/cssInJs/materialTable";

const dropdownStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 100,
  }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
};

const VisitorsTable = ({
  isRelationshipManager,
  tableData,
  selectedRow,
  setSelectedRow,
  handleInviteUserOpen,
  handleAssignRMOpen,
  handleRequestKYCOpen,
  handleAssignEntityOpen,
  handleViewUserInfoOpen,
  handleViewUserKYCOpen,
  handleViewDocumentsOpen,
  handleDeactivateUserOpen,
  handleReactivateUserOpen,
  handleApproveUserOpen,
  handleAssignUserAdminOpen,
  handleDeassignUserAdminOpen,
  handleArchiveUserOpen,
}) => {
  const visitors = JSON.parse(JSON.stringify(tableData)).filter((visitor) =>
    isRelationshipManager ? true : visitor.kycStatus !== "--"
  );

  const { t } = useTranslation(["onboarding", "administration"]);
  const { theme } = useTheme();

  const mtableLocalization = useMaterialTableLocalization();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const animatedComponents = makeAnimated();
  // const isFetching = useSelector(entitiesSelectors.selectIsFetching);

  const actions = [
    {
      callback: handleViewUserInfoOpen,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("onboarding:Actions.View User Information"),
    },
    {
      callback: handleAssignRMOpen,
      icon: <AssignmentIndIcon fontSize="small" />,
      label: t("onboarding:Actions.Assign RM"),
      hidden: !isRelationshipManager,
    },
    {
      callback: handleAssignUserAdminOpen,
      icon: <PersonIcon fontSize="small" />,
      label: t("onboarding:Actions.Assign Admin"),
      hidden: !isRelationshipManager,
      disabled: selectedRow?.user?.isAdmin,
    },
    {
      callback: handleDeassignUserAdminOpen,
      icon: <PersonOutlineIcon fontSize="small" />,
      label: t("onboarding:Actions.Unassign Admin"),
      hidden: !isRelationshipManager,
      disabled: !selectedRow?.user?.isAdmin,
    },
    {
      callback: handleRequestKYCOpen,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("onboarding:Actions.Request User & Entity KYC"),
      disabled: selectedRow?.kycRequestType !== null || selectedRow?.userId === null,
      hidden: !isRelationshipManager,
    },
    {
      callback: handleAssignEntityOpen,
      icon: <InputIcon fontSize="small" />,
      label: t("onboarding:Actions.Assign to Entity"),
      disabled: selectedRow?.kycRequestType !== null,
      hidden: !isRelationshipManager,
    },
    {
      callback: handleViewUserKYCOpen,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("onboarding:Actions.View KYC"),
      disabled: selectedRow?.entityId === null,
    },
    {
      callback: handleViewDocumentsOpen,
      icon: <FindInPageIcon fontSize="small" />,
      label: t("onboarding:Actions.View Documents"),
      disabled: selectedRow?.entityId === null,
    },
    {
      callback: handleApproveUserOpen,
      icon: <DoneAllIcon fontSize="small" />,
      label: t("onboarding:Actions.Assign & Approve"),
      hidden: isRelationshipManager,
    },
    {
      callback: handleDeactivateUserOpen,
      icon: <LockIcon fontSize="small" />,
      label: t("onboarding:Actions.Deactive User"),
      disabled: !selectedRow?.user?.isActive,
    },
    {
      callback: handleReactivateUserOpen,
      icon: <LockOpenIcon fontSize="small" />,
      label: t("onboarding:Actions.Reactivate User"),
      disabled: selectedRow?.user?.isActive,
    },
    {
      callback: handleArchiveUserOpen,
      icon: <RemoveCircleOutlineIcon fontSize="small" />,
      label: t("onboarding:Actions.Archive User"),
      disabled: selectedRow?.user?.isActive,
    },
  ];

  let toolbarProps = {};

  const visitorJurisdictions = visitors
    .filter((visitor) => visitor.jurisdiction !== null)
    .map((visitor) => ({
      value: visitor.jurisdiction,
      label: visitor.jurisdiction,
    }));

  const jurisdictionOptions = [
    ...new Map(visitorJurisdictions.map((item) => [item.label, item])).values(),
  ];

  const visitorEntityType = visitors
    .filter((visitor) => visitor.entityUserType !== null)
    .map((visitor) => ({
      value: capitalCase(visitor.entityUserType),
      label: capitalCase(visitor.entityUserType),
    }));

  const entityTypeOptions = [
    ...new Map(visitorEntityType.map((item) => [item.label, item])).values(),
  ];

  const visitorClassification = visitors
    .filter((visitor) => visitor.selfAssessment !== null)
    .map((visitor) => ({
      value: visitor.selfAssessment,
      label: visitor.selfAssessment,
    }));

  const classificationOptions = [
    ...new Map(visitorClassification.map((item) => [item.label, item])).values(),
  ];

  const visitorRelationshipManagers = [];
  visitors.forEach((visitor) => {
    visitor.relationshipManagers.forEach((relationshipManager) => {
      const rm = {
        value: `${relationshipManager?.firstName || ""} ${relationshipManager?.middleName || ""} ${
          relationshipManager.lastName || ""
        }`,
        label: `${relationshipManager?.firstName || ""} ${relationshipManager?.middleName || ""} ${
          relationshipManager.lastName || ""
        }`,
      };

      visitorRelationshipManagers.push(rm);
    });
  });

  const relationshipManagerOptions = [
    ...new Map(visitorRelationshipManagers.map((item) => [item.value, item])).values(),
  ];

  const visitorOnboardingStatus = visitors
    .filter((visitor) => visitor.onboardingStatus !== null)
    .map((visitor) => ({
      value: visitor.onboardingStatus,
      label: visitor.onboardingStatus,
    }));

  const onboardingStatusOptions = [
    ...new Map(visitorOnboardingStatus.map((item) => [item.label, item])).values(),
  ];

  const visitorKYCStatus = visitors
    .filter((visitor) => visitor.kycStatus !== null)
    .map((visitor) => ({
      value: visitor.kycStatus,
      label: visitor.kycStatus,
    }));

  const KYCStatusOptions = [
    ...new Map(visitorKYCStatus.map((item) => [item.label, item])).values(),
  ];

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
        <Formik
          initialValues={{
            jurisdiction: [],
            entityType: [],
            classification: [],
            relationshipManager: [],
            onboardingStatus: [],
            kycStatus: [],
          }}
        >
          {({ values, setFieldValue }) => {
            const onSearchChange = (searchText) => {
              toolbarProps.dataManager.changeSearchText(searchText);
              toolbarProps.onSearchChanged(searchText);
              setFieldValue("searchText", searchText, false);
            };

            const filteredData = visitors
              .filter((row) => {
                // Jurisdiction
                let isTrue = true;
                if (values.jurisdiction.length === 0) {
                  isTrue = true;
                } else {
                  const jurisdictionKeys = values.jurisdiction.map(
                    (jurisdiction) => jurisdiction.label
                  );
                  if (row.jurisdiction) {
                    isTrue = jurisdictionKeys.includes(row.jurisdiction);
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              })
              .filter((row) => {
                // Entity Type
                let isTrue = true;
                if (values.entityType.length === 0) {
                  isTrue = true;
                } else {
                  const keys = values.entityType.map((entityType) => entityType.label);
                  if (row.entityUserType) {
                    isTrue = keys.includes(capitalCase(row.entityUserType));
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              })
              .filter((row) => {
                // Classification
                let isTrue = true;
                if (values.classification.length === 0) {
                  isTrue = true;
                } else {
                  const keys = values.classification.map((classification) => classification.label);
                  if (row.selfAssessment) {
                    isTrue = keys.includes(row.selfAssessment);
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              })
              .filter((row) => {
                // Relationship Manager
                let isTrue = true;
                if (values.relationshipManager.length === 0) {
                  isTrue = true;
                } else {
                  const keys = values.relationshipManager.map(
                    (relationshipManager) => relationshipManager.label
                  );
                  if (row.relationshipManagers) {
                    const rms = row.relationshipManagers;
                    isTrue = false;
                    rms.forEach((rm) => {
                      const name = `${rm?.firstName || ""} ${rm?.middleName || ""} ${
                        rm.lastName || ""
                      }`;
                      if (keys.includes(name)) {
                        isTrue = true;
                      }
                    });
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              })
              .filter((row) => {
                // Onboarding Status
                let isTrue = true;
                if (values.onboardingStatus.length === 0) {
                  isTrue = true;
                } else {
                  const keys = values.onboardingStatus.map(
                    (onboardingStatus) => onboardingStatus.label
                  );
                  if (row.onboardingStatus) {
                    isTrue = keys.includes(row.onboardingStatus);
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              })
              .filter((row) => {
                // Onboarding Status
                let isTrue = true;
                if (values.kycStatus.length === 0) {
                  isTrue = true;
                } else {
                  const keys = values.kycStatus.map((kycStatus) => kycStatus.label);
                  if (row.kycStatus) {
                    isTrue = keys.includes(row.kycStatus);
                  } else {
                    isTrue = false;
                  }
                }
                return isTrue;
              });

            const clearFilter = (key) => {
              switch (key) {
                case "jurisdiction":
                  setFieldValue("jurisdiction", [], false);
                  break;
                case "entityType":
                  setFieldValue("entityType", [], false);
                  break;
                case "classification":
                  setFieldValue("classification", [], false);
                  break;
                case "relationshipManager":
                  setFieldValue("relationshipManager", [], false);
                  break;
                case "onboardingStatus":
                  setFieldValue("onboardingStatus", [], false);
                  break;
                case "kycStatus":
                  setFieldValue("kycStatus", [], false);
                  break;
                default:
                // code block
              }
            };

            const calculateFilterCount = () => {
              let count = 0;
              if (values.jurisdiction.length !== 0) {
                count += 1;
              }
              if (values.entityType.length !== 0) {
                count += 1;
              }
              if (values.classification.length !== 0) {
                count += 1;
              }
              if (values.relationshipManager.length !== 0) {
                count += 1;
              }
              if (values.onboardingStatus.length !== 0) {
                count += 1;
              }
              if (values.kycStatus.length !== 0) {
                count += 1;
              }
              return count;
            };

            return (
              <Form>
                <Accordion defaultExpanded={false} className="shadow-none" elevation={0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Grid
                      container
                      spacing={2}
                      justifyContent="space-between"
                      alignContent="center"
                    >
                      <Grid item container xs={4} sm={4} md={4} lg={6} alignContent="center">
                        <FilterListIcon />
                        <Badge badgeContent={calculateFilterCount()} color="primary">
                          <Typography variant="body1" className="pr-4">
                            {t("administration:Visitors.Filters.Filters")}
                          </Typography>
                        </Badge>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        lg={2}
                        container
                        direction="column"
                        justifyContent="center"
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInviteUserOpen();
                          }}
                        >
                          Invite User
                        </Button>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Field
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          component={TextField}
                          onChange={(e) => {
                            onSearchChange(e.target.value);
                          }}
                          label={t("administration:Visitors.Search")}
                          name="searchText"
                          value={values.searchText}
                          variant="filled"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="clear search"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // clearFilter('search');
                                  }}
                                >
                                  <CloseIcon fontSize="inherit" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box p={1} className="w-full">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.Jurisdiction")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("jurisdiction")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="w-full">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                placeholder={`${t(
                                  "administration:Visitors.Filters.Jurisdiction"
                                )}...`}
                                // isDisabled={filteredCountry.length===0}
                                isSearchable
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCountrySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.jurisdiction}
                                isMulti
                                options={jurisdictionOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("jurisdiction", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.Entity Type")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("entityType")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="full-width">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                isSearchable
                                placeholder={`${t(
                                  "administration:Visitors.Filters.Entity Type"
                                )}...`}
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCurrencySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.entityType}
                                isMulti
                                options={entityTypeOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("entityType", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.Classification")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("classification")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="full-width">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                isSearchable
                                placeholder={`${t(
                                  "administration:Visitors.Filters.Classification"
                                )}...`}
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCurrencySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.classification}
                                isMulti
                                options={classificationOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("classification", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.Relationship Manager")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("relationshipManager")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="full-width">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                isSearchable
                                placeholder={`${t(
                                  "administration:Visitors.Filters.Relationship Manager"
                                )}...`}
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCurrencySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.relationshipManager}
                                isMulti
                                options={relationshipManagerOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("relationshipManager", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.Onboarding Status")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("onboardingStatus")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="full-width">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                isSearchable
                                placeholder={`${t(
                                  "administration:Visitors.Filters.Onboarding Status"
                                )}...`}
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCurrencySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.onboardingStatus}
                                isMulti
                                options={onboardingStatusOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("onboardingStatus", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} container>
                          <Grid container justifyContent="space-between">
                            <Typography variant="body1" className="bold">
                              {t("administration:Visitors.Filters.KYC Status")}
                            </Typography>
                            <ButtonBase onClick={() => clearFilter("kycStatus")}>
                              <Typography variant="caption">
                                {t("administration:Visitors.Filters.Clear")}
                              </Typography>
                            </ButtonBase>
                          </Grid>
                          <Box my={1} className="full-width">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                isSearchable
                                placeholder={`${t(
                                  "administration:Visitors.Filters.KYC Status"
                                )}...`}
                                components={{
                                  ...animatedComponents,
                                  // eslint-disable-next-line react/prop-types
                                  MultiValueContainer: ({ data }) => (
                                    <Chip
                                      // eslint-disable-next-line react/prop-types
                                      key={data.value}
                                      // eslint-disable-next-line react/prop-types
                                      label={data.value}
                                      className="my-2"
                                      // eslint-disable-next-line react/prop-types
                                      // onDelete={(e) => handleRemoveCurrencySelection(e, data.value)}
                                      color="secondary"
                                    />
                                  ),
                                }}
                                styles={dropdownStyles}
                                value={values.kycStatus}
                                isMulti
                                options={KYCStatusOptions}
                                onChange={(selectedValue) => {
                                  setFieldValue("kycStatus", selectedValue, false);
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <MaterialTable
                  size="small"
                  // components={{
                  //   Container: (props) => <Paper {...props} elevation={0} />,
                  // }}
                  components={{
                    Toolbar: (props) => {
                      toolbarProps = props;
                      return <Fragment />;
                    },
                  }}
                  columns={[
                    {
                      title: "First Name",
                      field: "user.firstName",
                    },
                    {
                      title: "Middle Name",
                      field: "user.middleName",
                    },
                    {
                      title: "Last Name",
                      field: "user.lastName",
                    },
                    {
                      title: "Entity Name",
                      field: "entityName",
                    },
                    {
                      title: "Corporate Email",
                      field: "user.email",
                    },
                    {
                      title: "Jurisdiction",
                      field: "jurisdiction",
                    },
                    {
                      title: "Entity type",
                      field: "entityUserType",
                      render: (rowData) => capitalCase(rowData.entityUserType),
                    },
                    {
                      title: "Classification",
                      field: "selfAssessment",
                    },
                    {
                      title: "Relationship Manager",
                      field: "relationshipManagers",
                      render: (rowData) => (
                        <Typography variant="body2">
                          {rowData?.relationshipManagers.map(
                            (manager, index) =>
                              `${index !== 0 ? "," : ""}${manager.firstName || ""} ${
                                manager.middleName || ""
                              } ${manager.lastName || ""}`
                          )}
                        </Typography>
                      ),
                    },
                    {
                      title: "Onboarding Status",
                      field: "onboardingStatus",
                    },
                    {
                      title: "User KYC",
                      field: "user.hasCompletedIndividualKyc",
                      render: (rowData) => (
                        <Typography variant="body2">
                          {rowData?.user?.hasCompletedIndividualKyc ? "Complete" : "Pending"}
                        </Typography>
                      ),
                    },
                    {
                      title: "User Status",
                      field: "user.isActive",
                      render: (rowData) => (
                        <Typography variant="body2">
                          {rowData?.user?.isActive ? "Active" : "Inactive"}
                        </Typography>
                      ),
                    },
                    {
                      title: "Join Date",
                      field: "onboardingDate",
                      defaultSort: "desc",
                      render: (rowData) => (
                        <Typography variant="body2">
                          {dateRenderer(rowData?.onboardingDate)}
                        </Typography>
                      ),
                    },
                  ]}
                  data={filteredData}
                  options={{
                    ...tableStyles,
                    pageSize: 20,
                    // toolbar: false,
                    // actionsColumnIndex: -1,
                    actionsColumnIndex: -1,
                  }}
                  actions={[
                    {
                      icon: "more_vert",
                      onClick: (event, rowData) => {
                        setMenuAnchorEl(event.currentTarget);
                        setSelectedRow(rowData);
                      },
                    },
                  ]}
                  localization={mtableLocalization}
                />
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={menuAnchorEl}
                  setAnchorEl={setMenuAnchorEl}
                  selectedRow={selectedRow}
                />
              </Form>
            );
          }}
        </Formik>
      </MuiPickersUtilsProvider>
    </Fragment>
  );
};

VisitorsTable.propTypes = {};

export default VisitorsTable;
