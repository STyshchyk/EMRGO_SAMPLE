import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingPage from "../../../components/LoadingPage";
import SecuritiesHoldingsTable, {
  generateSecuritiesHoldingsTableRowData,
} from "../../../components/SecuritiesHoldingsTable";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";

const Registrar = () => {
  const dispatch = useDispatch();

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const securitiesHoldingsData = useSelector(reportsSelectors.selectSecuritiesHoldingsData);
  const isFetching = useSelector(reportsSelectors.selectIsFetching);

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

  if (isFetching) return <LoadingPage />;

  return (
    <SecuritiesHoldingsTable
      data={generatedTableData}
      securitiesAccounts={securitiesAccounts}
      disableDateFilter
    />
  );
};

export default Registrar;
