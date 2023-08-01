import { lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { mdiBlockHelper } from "@mdi/js";
import LoadingPage from "components/LoadingPage";

import ErrorBanner from "../../../components/ErrorBanner";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";

const TermsheetEdit = lazy(() => import("./TermsheetEdit"));
const TermsheetView = lazy(() => import("./TermsheetView"));
const LCTermsheetApprove = lazy(() => import("./LCTermsheetApprove"));

const TermsheetNotCompletedErrorBanner = () => {
  const { t } = useTranslation(["termsheet"]);
  return (
    <ErrorBanner
      title={t("termsheet:Termsheet data not available yet")}
      description=""
      icon={mdiBlockHelper}
    />
  );
};

const TermsheetNotPublishedErrorBanner = () => {
  const { t } = useTranslation(["termsheet"]);
  return (
    <ErrorBanner
      title={t("termsheet:Awaiting Arranger Publishing")}
      description=""
      icon={mdiBlockHelper}
    />
  );
};

const Termsheet = () => {
  const { issuanceID } = useParams();
  const dispatch = useDispatch();

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const issuanceOverview = useSelector(issuanceSelectors.selectIssuanceOverview);
  const isFetchingTermsheetData = useSelector(issuanceSelectors.selectFetchingTermsheet);
  const termsheetData = useSelector(issuanceSelectors.selectTermsheetData);

  const entityType = currentEntityGroup?.entityType;

  useEffect(() => {
    const fetchTermsheet = (payload) => dispatch(issuanceActionCreators.doFetchTermsheet(payload));

    fetchTermsheet({ sukukId: issuanceID });
  }, [dispatch, issuanceID]);

  if (isFetchingTermsheetData) {
    return <LoadingPage />;
  }

  // When LCA clicks on ‘Finalize’ button, Termsheet fields can’t be editible any more.(status TG to Subs)
  if (issuanceOverview?.status === "TermSheetGeneration") {
    if (entityType === "ARRANGER" && !termsheetData?.arrangerPublished) {
      return <TermsheetEdit />;
    }

    if (entityType === "LEGAL_COUNSEL") {
      if (issuanceOverview?.providers[0].status !== "CounterSigned") {
        return <TermsheetNotCompletedErrorBanner />;
      }

      if (!termsheetData?.arrangerPublished && !termsheetData?.arrangerReviewRequired) {
        return <TermsheetNotPublishedErrorBanner />;
      }

      return <LCTermsheetApprove />;
    }
  }

  return <TermsheetView />;
};

export default Termsheet;
