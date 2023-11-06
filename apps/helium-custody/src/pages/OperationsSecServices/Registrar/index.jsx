import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import LoadingPage from "../../../components/LoadingPage";
import SecuritiesHoldingsTable, {
  generateSecuritiesHoldingsTableRowData,
} from "../../../components/SecuritiesHoldingsTable";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as safekeepingActionCreators from "../../../redux/actionCreators/safekeeping";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import * as safekeepingSelectors from "../../../redux/selectors/safekeeping";

const Registrar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["reports"]);

  const [isTradeDateHolding, setIsTradeDateHolding] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const safekeepingAccounts = useSelector(safekeepingSelectors.readAccounts);

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

    const fetchSafekeepingAccounts = (payload) =>
      dispatch(safekeepingActionCreators.doReadAccounts(payload));

    fetchSecuritiesAccounts();

    fetchSafekeepingAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetSecuritiesHoldings());
    };
  }, [dispatch]);

  if (isFetching) return <LoadingPage />;

  return (
    <SecuritiesHoldingsTable
      data={generatedTableData}
      securitiesAccounts={securitiesAccounts}
      disableDateFilter
      safekeepingAccounts={safekeepingAccounts}
      entityUserType={currentEntityType}
      isTradeDateHolding={isTradeDateHolding}
      setIsTradeDateHolding={setIsTradeDateHolding}
    />
  );
};

export default Registrar;
