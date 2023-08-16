import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CashBalancesTable, { generateTransactions } from "../../../components/CashBalancesTable";
import PageTitle from "../../../components/PageTitle";
import RouteLeavingGuard from "../../../components/RouteLeavingGuard";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import ReportingDisclaimer from "../ReportingDisclaimer";

const CashBalancesReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["reports"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const transactions = useSelector(reportsSelectors.selectCashBalances);
  const cashAccounts = useSelector(reportsSelectors.selectCashAccounts);
  console.log(cashAccounts);

  const currentEntityGroupID = currentEntityGroup?.id;

  const generatedTableData = transactions?.map((i) => generateTransactions(i));

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchAccounts = (payload) => dispatch(reportsActionCreators.doFetchCashAccounts(payload));
    fetchAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetCashBalances());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <PageTitle title={t("Cash Balances.Cash Balances")} />
      {/* <RouteLeavingGuard
        when={transactions?.length > 0}
        title={t("Leave Guard.Title")}
        message={t("Leave Guard.Message")}
        navigate={(path) => navigate(path)}
        shouldBlockNavigation={() => true}
      /> */}

      <CashBalancesTable
        data={generatedTableData}
        accounts={cashAccounts}
        entityUserType={currentEntityType}
      />

      <ReportingDisclaimer />
    </Fragment>
  );
};

export default CashBalancesReportPage;
