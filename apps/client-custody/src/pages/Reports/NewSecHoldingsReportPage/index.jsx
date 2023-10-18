import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import LoadingPage from "../../../components/LoadingPage";
import PageTitle from "../../../components/PageTitle";
import SecuritiesHoldingsTable, {
  generateSecuritiesHoldingsTableRowData,
} from "../../../components/SecuritiesHoldingsTable";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import ReportingDisclaimer from "../ReportingDisclaimer";

const NewSecuritiesHoldingsReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["reports", "blotter"]);
  const [isTradeDateHolding, setIsTradeDateHolding] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const currentEntityGroupId = useSelector(authSelectors.selectCurrentEntityGroupId);
  const settlementDatedSecuritiesHoldingsData = useSelector(
    reportsSelectors.selectSecuritiesHoldingsData
  );
  const tradeDatedSecuritiesHoldingsData = useSelector(
    reportsSelectors.selectTradeDatedSecuritiesHoldingsData
  );
  const isFetching = useSelector(reportsSelectors.selectIsFetching);
  const securitiesHoldingsData = isTradeDateHolding
    ? tradeDatedSecuritiesHoldingsData
    : settlementDatedSecuritiesHoldingsData;
  const currentEntityGroupID = currentEntityGroup?.id;
  const generatedTableData = securitiesHoldingsData
    ?.map((i) => generateSecuritiesHoldingsTableRowData(i))
    .filter((row) => row.quantity !== "--");

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchSecuritiesAccounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSecuritiesAccounts(payload));

    const fetchSafeAcounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSafeAccounts(payload));

    fetchSafeAcounts({ entityId: currentEntityGroupId });

    //fetchSecuritiesAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetSecuritiesHoldings());
    };
  }, [dispatch]);

  if (isFetching) return <LoadingPage />;

  return (
    <Fragment>
      <PageTitle title={t("Securities Holdings.Securities Holdings")} />
      {/* <RouteLeavingGuard
        when={securitiesHoldingsData?.length > 0}
        title={t("Leave Guard.Title")}
        message={t("Leave Guard.Message")}
        navigate={(path) => navigate(path)}
        shouldBlockNavigation={() => true}
      /> */}
      <SecuritiesHoldingsTable
        data={generatedTableData}
        securitiesAccounts={securitiesAccounts}
        entityUserType={currentEntityType}
        isTradeDateHolding={isTradeDateHolding}
        setIsTradeDateHolding={setIsTradeDateHolding}
      />
      <ReportingDisclaimer />
    </Fragment>
  );
};

export default NewSecuritiesHoldingsReportPage;
