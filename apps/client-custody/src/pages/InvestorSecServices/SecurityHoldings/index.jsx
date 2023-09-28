import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SecuritiesHoldingsTable, {
  generateSecuritiesHoldingsTableRowData,
} from "../../../components/SecuritiesHoldingsTable";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";

const SecurityHoldings = () => {
  const dispatch = useDispatch();

  const [isTradeDateHolding, setIsTradeDateHolding] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
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

    fetchSecuritiesAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetSecuritiesHoldings());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <SecuritiesHoldingsTable
        data={generatedTableData}
        securitiesAccounts={securitiesAccounts}
        isTradeDateHolding={isTradeDateHolding}
        setIsTradeDateHolding={setIsTradeDateHolding}
      />
    </Fragment>
  );
};

export default SecurityHoldings;
