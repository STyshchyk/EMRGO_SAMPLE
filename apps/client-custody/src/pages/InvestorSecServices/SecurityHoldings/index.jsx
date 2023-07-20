import { Fragment, useEffect } from "react";
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

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const securitiesHoldingsData = useSelector(reportsSelectors.selectSecuritiesHoldingsData);

  const generatedTableData = securitiesHoldingsData?.map((i) =>
    generateSecuritiesHoldingsTableRowData(i)
  );

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
      <SecuritiesHoldingsTable data={generatedTableData} securitiesAccounts={securitiesAccounts} />
    </Fragment>
  );
};

export default SecurityHoldings;
