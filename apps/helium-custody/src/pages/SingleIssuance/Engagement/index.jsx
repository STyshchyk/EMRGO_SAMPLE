import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { mdiBlockHelper } from "@mdi/js";

import ErrorBanner from "../../../components/ErrorBanner";
import * as authSelectors from "../../../redux/selectors/auth";

const EngagementEngage = lazy(() => import("./EngagementEngage"));
const EngagementManage = lazy(() => import("./EngagementManage"));

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

const Engagement = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { entityType } = currentEntityGroup;
  const allowedEntityTypes = ["LEGAL_COUNSEL", "FIDUCIARY", "ARRANGER", "OBLIGOR", "ISSUER"];

  if (!allowedEntityTypes.includes(entityType)) {
    return <ForbiddenErrorBanner />;
  }

  if (entityType === "LEGAL_COUNSEL" || entityType === "FIDUCIARY") {
    return <EngagementManage />;
  }

  return <EngagementEngage />;
};

export default Engagement;
