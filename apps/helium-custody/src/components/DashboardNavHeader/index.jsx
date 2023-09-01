import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";

import cx from "classnames";

import featureFlags from "../../constants/featureFlags";
import routes from "../../constants/routes";
import { useFeatureToggle } from "../../context/feature-toggle-context";
import * as authSelectors from "../../redux/selectors/auth";
import * as kycSelectors from "../../redux/selectors/kyc";
import style from "./style.module.scss";
import appConfig from "../../appConfig";

const cashManagement = {
  acls: ["Account/Edit", "Account/Validate", "Account/Manage"],
  baseURLPattern: /(?:\/dashboard\/custody\/cash-management\/)(?:[\w-/]*)/,
  displayName: "Cash Management",
  homeUrl: routes.dashboard.custody.cashManagement.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "OBLIGOR", "ISSUER", "operations", "finance", "relationship_manager"],
};

const reports = {
  acls: ["Reports/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/reports\/)(?:[\w-/]*)/,
  displayName: "Reporting",
  homeUrl: routes.dashboard.custody.reports.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "ISSUER", "operations", "finance", "relationship_manager"],
};
const issuerServices = {
  acls: ["Services/Issuer/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/issuer-securities-services\/)(?:[\w-/]*)/,
  displayName: "Securities Services",
  homeUrl: routes.dashboard.custody.issuerSecServices.home,
  requiredEntityTypes: ["ISSUER"],
};

const investorServices = {
  acls: ["Services/Investor/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/investor-securities-services\/)(?:[\w-/]*)/,
  displayName: "Securities Services",
  homeUrl: routes.dashboard.custody.investorSecServices.home,
  requiredEntityTypes: ["INVESTOR"],
};

const securitiesServices = {
  acls: ["Services/Security/View", "Services/CustodyClearing/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/securities-services\/)(?:[\w-/]*)/,
  displayName: "Securities Services",
  homeUrl: routes.dashboard.custody.opsSecServices.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "operations", "finance", "relationship_manager"],
};

const securitiesAdmin = {
  acls: ["Services/Security/View", "Services/CustodyClearing/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/securities-admin\/)(?:[\w-/]*)/,
  displayName: "Securities Admin",
  homeUrl: routes.dashboard.custody.securitiesAdmin.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "operations", "finance", "relationship_manager"],
};

const NavLinkList = ({ routingConfigs }) => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);

  const entityType = useSelector(authSelectors.selectCurrentEntityType);
  const { t } = useTranslation(["translation"]);

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
  const shouldShowNav = Boolean(
    filteredRoutingConfigs
      .map((item) => routingConfigs[item])
      .find((obj) => obj.baseURLPattern.test(location.pathname))
  );

  return shouldShowNav ? (
    <div className={style.linkMenuWrapper}>
      <div className={style.linkMenuContainer}>
        {filteredRoutingConfigs.map((item, index) => {
          const currentDashboardRoutingConfig = routingConfigs[item];
          const { displayName, homeUrl, baseURLPattern } = currentDashboardRoutingConfig;
          const matchURL = baseURLPattern.test(location.pathname);

          return (
            <div className={style.linkContainer} key={index}>
              <div className={cx(matchURL ? style.selectedBorder : "")}>
                <RouterLink
                  className={cx(style.linkText, matchURL ? style.selected : "")}
                  to={homeUrl}
                >
                  {t(`Sidebar.${displayName}`)}
                </RouterLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

const DashboardNavHeader = () => {
  const kycApprovalStatus = useSelector(kycSelectors.selectKYCApprovalStatus);

  const { checkFeatureFlag } = useFeatureToggle();
  const isIntlSecTradeSettlementWorkflow = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  const initialRoutingConfigs = {
    securitiesServices,
  };

  const RoutingConfigs = {
    cashManagement,
    securitiesServices: isIntlSecTradeSettlementWorkflow ? securitiesServices : undefined,
    issuerServices: isIntlSecTradeSettlementWorkflow ? issuerServices : undefined,
    investorServices: isIntlSecTradeSettlementWorkflow ? investorServices : undefined,
    securitiesAdmin: isIntlSecTradeSettlementWorkflow ? securitiesAdmin : undefined,
    reports,
  };

  return (
    <Fragment>
      {kycApprovalStatus ? (
        <NavLinkList routingConfigs={RoutingConfigs} />
      ) : (
        <NavLinkList routingConfigs={initialRoutingConfigs} />
      )}
    </Fragment>
  );
};

export default DashboardNavHeader;
