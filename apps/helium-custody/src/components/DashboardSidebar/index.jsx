import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";

import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import cx from "classnames";
import PropTypes from "prop-types";

import HELPDESK_SVG_ICON from "../../assets/images/helpdesk.svg";
import featureFlags from "../../constants/featureFlags";
import routes from "../../constants/routes";
// import * as kycSelectors from '../../redux/selectors/kyc';
import { useFeatureToggle } from "../../context/feature-toggle-context";
import { useTheme } from "../../context/theme-context";
import * as authSelectors from "../../redux/selectors/auth";
import * as kycSelectors from "../../redux/selectors/kyc";
import useIsProduction from "../../utils/useIsProduction";
import HelpDeskDialog from "./HelpDeskDialog";
import style from "./style.module.scss";

// TODO: REFACTOR THIS MESS (Move those routing configs to constants directory and set it up as the single source of truth for all routes)

const home = {
  acls: [],
  baseURLPattern: /^(?:\/dashboard\/)$/,
  displayName: "Home",
  homeUrl: routes.dashboard.home,
  requiredEntityTypes: [],
};

const issuance = {
  acls: [
    "CMA/Manage",
    "CMA/View",
    "Engagement/Engage",
    "Engagement/View",
    "Issuance/Create",
    "Issuance/View",
    "Signing/Edit",
    "Signing/Sign",
    "Signing/View",
    "Subscription/Allocate",
    "Subscription/Confirm",
    "Subscription/View",
    "Termsheet/Approve",
    "Termsheet/Edit",
    "Termsheet/View",
  ],
  baseURLPattern: /(?:\/dashboard\/issuances\/)(?:[\w-/]*)/,
  displayName: "Issuance",
  homeUrl: routes.dashboard.issuances.home,
  requiredEntityTypes: [
    "ARRANGER",
    "CO_ARRANGER",
    "FIDUCIARY",
    "INVESTOR",
    "ISSUER",
    "LEGAL_COUNSEL",
    "OBLIGOR",
  ],
};

const support = {
  acls: ["Support/Auth"],
  baseURLPattern: /(?:\/dashboard\/support\/)(?:[\w-/]*)/,
  displayName: "Support",
  homeUrl: routes.dashboard.support.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "operations", "finance", "relationship_manager"],
};


const custody = {
  acls: ["Account/Edit", "Account/Validate", "Account/Manage"],
  baseURLPattern: /(?:\/dashboard\/custody\/)(?:[\w-/]*)/,
  displayName: "Custody",
  homeUrl: routes.dashboard.custody.cashManagement.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "OBLIGOR", "ISSUER", "operations", "finance", "relationship_manager"],
};

const billing = {
  acls: ["Account/Edit", "Account/Validate", "Account/Manage"],
  baseURLPattern: /(?:\/dashboard\/billing\/)(?:[\w-/]*)/,
  displayName: "Billing",
  homeUrl: routes.dashboard.billing.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR"],
};


const issuerServices = {
  acls: ["Services/Issuer/View"],
  baseURLPattern: /(?:\/dashboard\/issuer-securities-services\/)(?:[\w-/]*)/,
  displayName: "Securities Services",
  homeUrl: routes.dashboard.custody.issuerSecServices.home,
  requiredEntityTypes: ["ISSUER"],
};

// const settlementAdmin = {
//   acls: ['Services/CustodyClearing/View'],
//   baseURLPattern: /(?:\/dashboard\/settlement-admin\/)(?:[\w-/]*)/,
//   displayName: 'Settlement Admin',
//   homeUrl: routes.dashboard.settlementAdmin.home,
//   requiredEntityTypes: ['EMRGO_SERVICES', 'INVESTOR'],
// };

const reconciliation = {
  acls: ["Account/Manage"],
  requiredEntityTypes: ["EMRGO_SERVICES"],
  displayName: "Reconciliation",
  baseURLPattern: /(?:\/dashboard\/reconciliation\/)(?:[\w-/]*)/,
  homeUrl: routes.dashboard.reconciliation.home,
};

const NavLinkList = ({ routingConfigs }) => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const entityType = useSelector(authSelectors.selectCurrentEntityType);
  const { t } = useTranslation(["translation"]);

  const { theme } = useTheme();
  const { locale } = theme;
  const location = useLocation();

  const filteredRoutingConfigs = Object.keys(routingConfigs).filter((key) =>
    currentListOfAcls?.some((acl) => {
      if (routingConfigs[key]) {
        const currentRoutingConfig = routingConfigs[key];

        if (!currentRoutingConfig.acls.length && !currentRoutingConfig.requiredEntityTypes.length)
          return true;

        if (currentRoutingConfig.requiredEntityTypes) {
          return (
            currentRoutingConfig.acls.includes(acl) &&
            currentRoutingConfig.requiredEntityTypes.includes(entityType)
          );
        }

        return currentRoutingConfig.acls.includes(acl);
      }
      return false;
    })
  );

  return (
    <List id="dashboard-sidebar" data-testid="dashboard-sidebar">
      {filteredRoutingConfigs.map((item) => {
        const currentDashboardRoutingConfig = routingConfigs[item];
        const { displayName, homeUrl, baseURLPattern } = currentDashboardRoutingConfig;
        const matchURL = baseURLPattern.test(location.pathname);

        return (
          <ListItem key={displayName}>
            <ButtonBase
              className={cx(
                locale.rtl ? style.drawer__link__wrapper__right : style.drawer__link__wrapper__left
              )}
              component={RouterLink}
              to={homeUrl}
            >
              <Paper
                className={cx(style.drawer__link, matchURL ? style["drawer__link--active"] : "")}
              >
                <Typography variant="body2" className={style.drawer__link__text}>
                  {t(`Sidebar.${displayName}`)}
                </Typography>
              </Paper>
            </ButtonBase>
          </ListItem>
        );
      })}
    </List>
  );
};

const DashboardSidebar = ({ open }) => {
  const { t } = useTranslation();
  const [openHelpDeskDialog, setOpenHelpDeskDialog] = useState(false);
  const inProd = useIsProduction();

  // selectors
  const kycApprovalStatus = useSelector(kycSelectors.selectKYCApprovalStatus);

  const { checkFeatureFlag } = useFeatureToggle();
  const isIntlSecTradeSettlementWorkflow = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );
  const isReconciliationFeatureEnabled = checkFeatureFlag(featureFlags.reconciliationFeature);

  const initialRoutingConfigs = {
    home,
    // administration,
  };

  const RoutingConfigs = {
    home,
    // administration,
    billing: inProd ? undefined : billing,
    issuance,
    support,
    custody,
    // settlementAdmin: isIntlSecTradeSettlementWorkflow ? settlementAdmin : undefined,
    reconciliation: isReconciliationFeatureEnabled ? reconciliation : undefined,
  };

  const handleClose = () => {
    setOpenHelpDeskDialog(false);
  };
  return (
    <Fragment>
      <Drawer
        className={style.drawer}
        variant="persistent"
        classes={{
          paper: style.drawer__paper,
        }}
        open={open}
        anchor="left"
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignContent="flex-start"
          className={style.drawer__content}
        >
          <Grid item container justifyContent="center" className={style.drawer__logo} />
          <Grid item className={style.drawer__items}>
            <Paper className={style.drawer__section}>
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                className={style.drawer__content}
              >
                {kycApprovalStatus ? (
                  <NavLinkList routingConfigs={RoutingConfigs} />
                ) : (
                  <NavLinkList routingConfigs={initialRoutingConfigs} />
                )}
                <List>
                  <Divider className={style.drawer__divider} />
                  <ListItem button key="helpdesk" onClick={() => setOpenHelpDeskDialog(true)}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        style={{
                          marginRight: "1rem",
                        }}
                        src={HELPDESK_SVG_ICON}
                        alt="helpdesk_icon"
                      />
                      <ListItemText primary={t("Sidebar.Help Desk")} />
                    </div>
                  </ListItem>
                </List>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Drawer>
      <HelpDeskDialog open={openHelpDeskDialog} handleClose={handleClose} />
    </Fragment>
  );
};

DashboardSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default DashboardSidebar;
