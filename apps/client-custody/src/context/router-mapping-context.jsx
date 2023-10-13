import { createContext, lazy, useContext } from "react";
import { useSelector } from "react-redux";

import { accountIdentification } from "@emrgo-frontend/constants";
import { useUser } from "@emrgo-frontend/shared-ui";

import featureFlags from "../constants/featureFlags";
import routes from "../constants/routes";
import DashboardLayout from "../layouts/DashboardLayout";
import CashManagement from "../pages/CashManagement";
import InvestorServices from "../pages/InvestorSecServices";
import Reports from "../pages/Reports";
import * as kycSelectors from "../redux/selectors/kyc";
import useIsProduction from "../utils/useIsProduction";
import { useFeatureToggle } from "./feature-toggle-context";

const AuthContainer = lazy(() => import("../containers/AuthContainer"));
const AuthFlowLayout = lazy(() => import("../layouts/AuthFlowLayout"));
// const CashManagement = lazy(() => import("../pages/CashManagement"));
const BlotterView = lazy(() => import("../containers/BlotterView"));
const Bulletin = lazy(() => import("../pages/Bulletin"));
const DashboardHome = lazy(() => import("../pages/DashboardHome"));
// const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const DocuSignSignature = lazy(() => import("../pages/DocuSignSignature"));
const DocuSignSignatureModalSuccess = lazy(() => import("../pages/DocuSignSignatureModalSuccess"));
const DocuSignSignatureSuccess = lazy(() => import("../pages/DocuSignSignatureSuccess"));
const EmptyLayout = lazy(() => import("../layouts/EmptyLayout"));
// const InvestorServices = lazy(() => import("../pages/InvestorSecServices"));
const IssuancesList = lazy(() => import("../pages/IssuancesList"));
const IssuerServices = lazy(() => import("../pages/IssuerSecServices"));
const Login = lazy(() => import("../pages/Login"));
const NoAccess = lazy(() => import("../components/NoAccess"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const OnboardingClient = lazy(() => import("../pages/OnboardingClient"));
const PublicHome = lazy(() => import("../pages/PublicHome"));
const PublicLayout = lazy(() => import("../layouts/PublicLayout"));
const Reconciliation = lazy(() => import("../pages/Reconciliation"));
// const Reports = lazy(() => import("../pages/Reports"));
const SettlementAdmin = lazy(() => import("../pages/SettlementAdmin"));
const SingleIssuance = lazy(() => import("../pages/SingleIssuance"));
const Billing = lazy(() => import("../pages/Billing"));

const RouterMappingContext = createContext();
RouterMappingContext.displayName = "RouterMappingContext";

const RouterMappingProvider = ({ children }) => {
  const { user } = useUser();
  const inProd = useIsProduction();

  const { checkFeatureFlag } = useFeatureToggle();
  const isBulletinBoardFeatureEnabled = checkFeatureFlag(featureFlags.bulletinBoardFeature);
  const isIntlSecTradeSettlementWorkflow = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );
  const isReconciliationFeatureEnabled = checkFeatureFlag(featureFlags.reconciliationFeature);
  // const kycApprovalStatus = useSelector(kycSelectors.selectKYCApprovalStatus);
  const kycApprovalStatus =
    user?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
    user?.clientKycStatus === accountIdentification.KYC_STATUS_APPROVED;

  const value = {
    publicRouteConfigs: [
      {
        component: PublicHome,
        exact: true,
        isPublic: true,
        layout: PublicLayout,
        path: routes.public.home,
      },
      {
        component: Login,
        exact: true,
        isPublic: true,
        layout: PublicLayout,
        path: routes.public.login,
      },
      {
        component: Onboarding,
        exact: true,
        isPublic: true,
        layout: PublicLayout,
        path: routes.public.onboarding,
      },
      {
        component: NoAccess,
        exact: true,
        isPublic: true,
        layout: PublicLayout,
        path: routes.public.noAccess,
      },
      {
        component: DocuSignSignature,
        exact: true,
        isPublic: true,
        layout: PublicLayout,
        path: routes.public.signing.document,
      },
      {
        component: DocuSignSignatureSuccess,
        exact: true,
        isPublic: true,
        layout: EmptyLayout,
        path: routes.public.signing.success,
      },
      {
        component: DocuSignSignatureModalSuccess,
        exact: true,
        isPublic: true,
        layout: EmptyLayout,
        path: routes.public.signing.action,
      },
    ],
    authFlowRouteConfigs: [
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.registration,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.success,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.forgotPassword,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.reset,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.resetMFAAndPassword,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.resetPasswordSuccess,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: true,
        layout: AuthFlowLayout,
        path: routes.authentication.resetMFA,
      },
      {
        component: AuthContainer,
        exact: true,
        isPublic: false,
        layout: AuthFlowLayout,
        path: routes.authentication.otp,
      },
    ],
    dashboardRouteConfigs: [
      {
        component: DashboardHome,
        exact: true,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.home}/*`,
      },
      // {
      //   component: IssuancesList,
      //   exact: true,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.issuances.home}*`,
      //   disabled: !kycApprovalStatus,
      // },
      // {
      //   component: SingleIssuance,
      //   exact: false,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.issuances.issuance.home}*`,
      //   disabled: !kycApprovalStatus,
      // },
      // {
      //   component: BlotterView,
      //   exact: true,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.blotters.home}*`,
      //   disabled: !kycApprovalStatus,
      // },
      // {
      //   component: Bulletin,
      //   exact: false,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.bulletins.home}*`,
      //   disabled: !kycApprovalStatus || !isBulletinBoardFeatureEnabled,
      // },
      {
        component: CashManagement,
        exact: false,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.custody.cashManagement.home}*`,
        disabled: !kycApprovalStatus,
      },
      {
        component: Reports,
        exact: false,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.custody.reports.home}*`,
        disabled: !kycApprovalStatus,
      },
      {
        component: OnboardingClient,
        exact: true,
        isPublic: true,
        layout: DashboardLayout,
        path: `${routes.dashboard.custody.onboarding.home}*`,
        disabled: false,
      },
      // {
      //   component: IssuerServices,
      //   exact: false,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.custody.issuerSecServices.home}*`,
      //   disabled: !kycApprovalStatus,
      // },
      {
        component: InvestorServices,
        exact: false,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.custody.investorSecServices.home}*`,
        disabled: !kycApprovalStatus,
      },
      // {
      //   component: OperationsSecServices,
      //   exact: false,
      //   isPublic: false,
      //   layout: DashboardLayout,
      //   path: `${routes.dashboard.custody.opsSecServices.home}*`,
      //   disabled: !kycApprovalStatus,
      // },
      {
        component: SettlementAdmin,
        exact: false,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.settlementAdmin.home}*`,
        disabled: !kycApprovalStatus || !isIntlSecTradeSettlementWorkflow,
      },
      {
        component: Reconciliation,
        exact: true,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.reconciliation.home}*`,
        disabled: !kycApprovalStatus || !isReconciliationFeatureEnabled,
      },
      {
        component: Billing,
        exact: false,
        isPublic: false,
        layout: DashboardLayout,
        path: `${routes.dashboard.billing.home}*`,
        disabled: inProd || !kycApprovalStatus,
      },
    ],
  };

  return <RouterMappingContext.Provider value={value}>{children}</RouterMappingContext.Provider>;
};

export default RouterMappingProvider;

const useRouterMapping = () => {
  const contextObject = useContext(RouterMappingContext);

  if (contextObject === undefined) {
    throw new Error(
      "useRouterMapping hook must be called within a RouterMappingProvider component"
    );
  }

  return contextObject;
};

export { RouterMappingProvider, useRouterMapping };
