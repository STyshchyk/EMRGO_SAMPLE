import { Fragment, lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Switch, useParams } from "react-router-dom";

import { mdiBlockHelper } from "@mdi/js";
import { reverse } from "named-urls";

import appConfig from "../../appConfig";
import Chip from "../../components/Chip";
import ErrorBanner from "../../components/ErrorBanner";
import Flex from "../../components/Flex";
import LoadingPage from "../../components/LoadingPage";
import MinorNavigation from "../../components/MinorNavigation";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as authSelectors from "../../redux/selectors/auth";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import style from "./style.module.scss";

const Closing = lazy(() => import("./Closing"));
const CMANotification = lazy(() => import("./CMANotification"));
const Documents = lazy(() => import("./Documents"));
const Engagement = lazy(() => import("./Engagement"));
const InvestorsList = lazy(() => import("./InvestorsList"));
const Issuer = lazy(() => import("./Issuer"));
const ObligorEngagementEngage = lazy(() => import("./ObligorEngagementEngage"));
const Overview = lazy(() => import("./Overview"));
const SPEIncorporation = lazy(() => import("./SPEIncorporation"));
const Subscription = lazy(() => import("./Subscription"));
const Termsheet = lazy(() => import("./Termsheet"));

const TermsheetGenerationNotCompletedErrorBanner = () => {
  const { t } = useTranslation(["issuances"]);
  return (
    <ErrorBanner
      title={t("issuances:Errors.Termsheet generation not completed")}
      description=""
      icon={mdiBlockHelper}
    />
  );
};

const SigningNotCompletedErrorBanner = () => {
  const { t } = useTranslation(["issuances"]);
  return (
    <ErrorBanner
      title={t("issuances:Errors.Signing not completed yet")}
      description=""
      icon={mdiBlockHelper}
    />
  );
};

const ForbiddenErrorBanner = () => {
  const { t } = useTranslation(["issuances"]);
  return (
    <ErrorBanner
      title={t("issuances:Errors.Forbidden")}
      description={t(
        "issuances:Errors.You dont have permission to view this page Please contact Emrgo Customer Support"
      )}
      icon={mdiBlockHelper}
    />
  );
};

const OverviewPage = () => <Overview />;

const TermsheetPage = () => <Termsheet />;

const EngagementPage = () => <Engagement />;

const WethaqEngagementPage = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { entityType } = currentEntityGroup;
  const allowedEntityTypes = ["OBLIGOR"];

  if (!allowedEntityTypes.includes(entityType)) {
    return <ForbiddenErrorBanner />;
  }

  return <ObligorEngagementEngage />;
};

const IssuerPage = () => (
  // TODO: RBAC CHECKS
  <Issuer />
);
const InvestorsPage = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { entityType } = currentEntityGroup;
  const allowedEntityTypes = ["ARRANGER"];

  if (!allowedEntityTypes.includes(entityType)) {
    return <ForbiddenErrorBanner />;
  }

  return <InvestorsList />;
};

const SubscriptionPage = () => {
  const privatePlacementIssuanceStatusObject = useSelector(
    issuanceSelectors.selectPrivatePlacementIssuanceStatusObject
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { entityType } = currentEntityGroup;

  const allowedEntityTypes = ["ARRANGER", "INVESTOR", "CO_ARRANGER"];

  if (!allowedEntityTypes.includes(entityType)) {
    return <ForbiddenErrorBanner />;
  }

  if (privatePlacementIssuanceStatusObject.TermSheetGeneration !== "completed") {
    return <TermsheetGenerationNotCompletedErrorBanner />;
  }

  return <Subscription />;
};

const DocumentsPage = () => <Documents />;

const ClosingPage = () => {
  const privatePlacementIssuanceStatusObject = useSelector(
    issuanceSelectors.selectPrivatePlacementIssuanceStatusObject
  );

  // signing probably has been removed can make check with Subscription.Confirmations != completed but can still use Signing
  if (privatePlacementIssuanceStatusObject.Signing !== "completed") {
    return <SigningNotCompletedErrorBanner />;
  }

  return <Closing />;
};

const SingleIssuance = () => {
  const { issuanceID } = useParams();
  const { t } = useTranslation(["statuses"]);
  const overview = useSelector(issuanceSelectors.selectIssuanceOverview);
  const dispatch = useDispatch();
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;

  const { accessControls } = currentEntityGroup;
  const isFetchingOverviewData = useSelector(issuanceSelectors.selectFetchingOverview);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchIssuanceOverview = (payload) =>
      dispatch(issuanceActionCreators.doFetchIssuanceOverview(payload));
    fetchIssuanceOverview({ sukukId: issuanceID });

    return () => {
      const resetCMADocumentURLsState = () =>
        dispatch(issuanceActionCreators.doResetCMADocumentURLsState());

      resetCMADocumentURLsState();
    };
  }, [issuanceID, dispatch, currentEntityGroupID, entityType]);

  /*
    TODO:
    Implement a function to handle dynamically generating a list of issuance pill navlinks when given logged-in user's entity type and list of acls and a list of default pill route configs.
  */

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.issuances.issuance.overview,
      link: reverse(routes.dashboard.issuances.issuance.overview, { issuanceID }),
      text: "Minor Navigation.Issuance.Overview",
      disabled: false,
    },
    {
      path: routes.dashboard.issuances.issuance.wethaqEngagements,
      link: reverse(routes.dashboard.issuances.issuance.wethaqEngagements, { issuanceID }),
      text: "Minor Navigation.Issuance.Emrgo Engagement",
      disabled: entityType !== "OBLIGOR",
      acls: [
        accessControlsList.ENGAGEMENT.view.key,
        accessControlsList.ENGAGEMENT.manage.key,
        accessControlsList.ENGAGEMENT.engage.key,
      ],
    },
    {
      path: routes.dashboard.issuances.issuance.engagements,
      link: reverse(routes.dashboard.issuances.issuance.engagements, { issuanceID }),
      text: "Minor Navigation.Issuance.Engagements",
      disabled: !["LEGAL_COUNSEL", "FIDUCIARY", "ARRANGER", "OBLIGOR", "ISSUER"].includes(
        entityType
      ),
      acls: [
        accessControlsList.ENGAGEMENT.view.key,
        accessControlsList.ENGAGEMENT.manage.key,
        accessControlsList.ENGAGEMENT.engage.key,
      ],
    },
    {
      path: routes.dashboard.issuances.issuance.speIncorporation,
      link: reverse(routes.dashboard.issuances.issuance.speIncorporation, { issuanceID }),
      text: "Minor Navigation.Issuance.SPE Incorporation",
      disabled: appConfig.appRegion !== "SA" || !["OBLIGOR"].includes(entityType),
    },
    {
      path: routes.dashboard.issuances.issuance.termsheet,
      link: reverse(routes.dashboard.issuances.issuance.termsheet, { issuanceID }),
      text: "Minor Navigation.Issuance.Termsheet",
      disabled: false,
      acls: [
        accessControlsList.TERMSHEET.view.key,
        accessControlsList.TERMSHEET.edit.key,
        accessControlsList.TERMSHEET.approve.key,
      ],
    },
    {
      path: routes.dashboard.issuances.issuance.documents,
      link: reverse(routes.dashboard.issuances.issuance.documents, { issuanceID }),
      text: "Minor Navigation.Issuance.Doc Management",
      disabled: false,
      acls: [
        accessControlsList.SIGNING.view.key,
        accessControlsList.SIGNING.sign.key,
        accessControlsList.SIGNING.edit.key,
      ],
    },
    {
      path: routes.dashboard.issuances.issuance.issuer,
      link: reverse(routes.dashboard.issuances.issuance.issuer, { issuanceID }),
      text: "Minor Navigation.Issuance.Issuer",
      disabled: !(
        (["OBLIGOR"].includes(entityType) && overview?.hasObligorIssuerInvite) ||
        ["FIDUCIARY"].includes(entityType)
      ),
      acls: [accessControlsList.KYC.invite.key],
    },
    {
      path: routes.dashboard.issuances.issuance.investors,
      link: reverse(routes.dashboard.issuances.issuance.investors, { issuanceID }),
      text: "Minor Navigation.Issuance.Investors",
      disabled: false,
      acls: [accessControlsList.SUBSCRIPTION.allocate.key],
    },
    {
      path: routes.dashboard.issuances.issuance.subscription,
      link: reverse(routes.dashboard.issuances.issuance.subscription, { issuanceID }),
      text: "Minor Navigation.Issuance.Pre-Allocation",
      disabled: false,
      acls: [
        accessControlsList.SUBSCRIPTION.view.key,
        accessControlsList.SUBSCRIPTION.confirm.key,
        accessControlsList.SUBSCRIPTION.allocate.key,
      ],
    },
    {
      path: routes.dashboard.issuances.issuance.cmaNotification,
      link: reverse(routes.dashboard.issuances.issuance.cmaNotification, { issuanceID }),
      text: "Minor Navigation.Issuance.CMA Notification",
      disabled: appConfig.appRegion !== "SA" || !["ARRANGER", "CO_ARRANGER"].includes(entityType),
    },
    {
      path: routes.dashboard.issuances.issuance.closing,
      link: reverse(routes.dashboard.issuances.issuance.closing, { issuanceID }),
      text: "Minor Navigation.Issuance.Closing",
      disabled: ["FIDUCIARY", "INVESTOR"].includes(entityType), // hide closing tab for FS and INV
    },
  ];

  const sukukType = overview?.sukukTypeName?.name ?? "";
  const sukukName = overview?.name ?? "";
  const distributionMethod = overview?.distributionMethodName?.name ?? "";
  const pricingName = overview?.pricingName?.name ?? "";

  if (isFetchingOverviewData) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <MinorNavigation routes={PILL_ROUTE_CONFIGS} currentAccessList={accessControls} />

      <div>
        <h1 className={style.titleText}>{sukukName}</h1>
        <Flex>
          {sukukType !== "" ? (
            <Chip label={t(`statuses:Issuance.Sukuk Types.${sukukType}`)} />
          ) : null}
          {distributionMethod !== "" ? (
            <Chip label={t(`statuses:Issuance.Distribution Method.${distributionMethod}`)} />
          ) : null}
          {pricingName !== "" ? (
            <Chip label={t(`statuses:Issuance.Pricing Name.${pricingName}`)} />
          ) : null}
        </Flex>
      </div>
      <Switch>
        <Route exact path={routes.dashboard.issuances.issuance.home}>
          <Navigate to={reverse(routes.dashboard.issuances.issuance.overview, { issuanceID })} />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.overview}>
          <OverviewPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.wethaqEngagements}>
          <WethaqEngagementPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.engagements}>
          <EngagementPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.termsheet}>
          <TermsheetPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.engagements}>
          <EngagementPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.issuer}>
          <IssuerPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.investors}>
          <InvestorsPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.subscription}>
          <SubscriptionPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.documents}>
          <DocumentsPage />
        </Route>
        <Route exact path={routes.dashboard.issuances.issuance.closing}>
          <ClosingPage />
        </Route>
        {appConfig.appRegion !== "SA" ? null : (
          <Route exact path={routes.dashboard.issuances.issuance.cmaNotification}>
            <CMANotification />
          </Route>
        )}
        {appConfig.appRegion !== "SA" ? null : (
          <Route exact path={routes.dashboard.issuances.issuance.speIncorporation}>
            <SPEIncorporation />
          </Route>
        )}
      </Switch>
    </Fragment>
  );
};

export default SingleIssuance;
