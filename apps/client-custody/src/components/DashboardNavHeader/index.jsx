import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import cx from "classnames";
import { useDarkMode } from "usehooks-ts";

import featureFlags from "../../constants/featureFlags";
import routes from "../../constants/routes";
import { useFeatureToggle } from "../../context/feature-toggle-context";
import * as authSelectors from "../../redux/selectors/auth";
import * as kycSelectors from "../../redux/selectors/kyc";
import style from "./style.module.scss";

const cashManagement = {
  acls: ["Account/Edit", "Account/Validate", "Account/Manage"],
  baseURLPattern: /(?:\/dashboard\/custody\/cash-management\/)(?:[\w-/]*)/,
  displayName: "Cash Management",
  homeUrl: routes.dashboard.custody.cashManagement.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "OBLIGOR", "ISSUER"],
};

const reports = {
  acls: ["Reports/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/reports\/)(?:[\w-/]*)/,
  displayName: "Reporting",
  homeUrl: routes.dashboard.custody.reports.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "ISSUER"],
};
const onboarding = {
  acls: ["Reports/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/onboarding\/)(?:[\w-/]*)/,
  displayName: "Onboarding",
  homeUrl: routes.dashboard.custody.onboarding.home,
  requiredEntityTypes: ["EMRGO_SERVICES", "INVESTOR", "ISSUER"],
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
  requiredEntityTypes: ["EMRGO_SERVICES"],
};

const securitiesAdmin = {
  acls: ["Services/Security/View", "Services/CustodyClearing/View"],
  baseURLPattern: /(?:\/dashboard\/custody\/securities-admin\/)(?:[\w-/]*)/,
  displayName: "Securities Admin",
  homeUrl: routes.dashboard.custody.securitiesAdmin.home,
  requiredEntityTypes: ["EMRGO_SERVICES"],
};

const NavLinkList = ({ routingConfigs }) => {
  const { isDarkMode } = useDarkMode();
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

  const processedRoutingConfigs = filteredRoutingConfigs.map((item, index) => {
    const currentDashboardRoutingConfig = routingConfigs[item];
    const { displayName, homeUrl, baseURLPattern } = currentDashboardRoutingConfig;
    const matchURL = baseURLPattern.test(location.pathname);

    return {
      matchURL,
      displayName,
      homeUrl,
      key: item,
      notification: 0,
    };
  });

  const matchedUrl = processedRoutingConfigs.find((config) => config.matchURL === true);

  return shouldShowNav ? (
    <Tabs value={matchedUrl.key}>
      {processedRoutingConfigs.map((tab, index) => {
        return (
          <Tab value={tab.key} as={RouterLink} to={tab.homeUrl} key={tab.key}>
            {t(`Sidebar.${tab.displayName}`)}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        );
      })}
    </Tabs>
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
    onboarding,
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
