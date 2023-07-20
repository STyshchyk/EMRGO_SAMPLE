import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import SubscriptionAllocationTableEdit from "../SubscriptionAllocationTableEdit";

const calculateTotalSubscriptionAllocationAmount = (tableData) => {
  let result = 0;

  if (tableData.length > 0) {
    result = tableData.map((row) => row?.subAmount).reduce((total, amount) => total + amount);
  }

  return result;
};

const SubscriptionAllocation = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const { issuanceID } = useParams();
  const { t } = useTranslation(["subscription"]);

  // selectors
  const issuanceSize = useSelector(issuanceSelectors.selectIssuanceSize);
  const enabledInvestors = useSelector(issuanceSelectors.selectEnabledInvestors);
  const subscriptionData = useSelector(issuanceSelectors.selectSubscriptionData);
  const isFetchingSubscriptions = useSelector(issuanceSelectors.selectFetchingSubscriptions);
  const isFetchingInvestors = useSelector(issuanceSelectors.selectFetchingInvestors);

  // dispatchers
  const sendSubscription = (payload) =>
    dispatch(issuanceActionCreators.doSendSubscription(payload));

  const isTableEmpty = tableData.length === 0;
  const totalSubAmount = calculateTotalSubscriptionAllocationAmount(tableData);
  const isTotalSubAmountEqualToGivenIssuanceSize = totalSubAmount === issuanceSize;
  const isLoading = isFetchingSubscriptions || isFetchingInvestors;

  useEffect(() => {
    const fetchSubscription = (payload) =>
      dispatch(issuanceActionCreators.doFetchSubscription(payload));
    fetchSubscription({ sukukId: issuanceID });
  }, [dispatch, issuanceID]);

  useEffect(() => {
    const fetchInvestors = (payload) => dispatch(issuanceActionCreators.doFetchInvestors(payload));

    fetchInvestors({ sukukId: issuanceID });
  }, [dispatch, issuanceID]);

  const handleOnClick = () => {
    const requestPayload = {
      subscriptions: tableData?.map((row) => {
        const currentInvestor = enabledInvestors[parseInt(row?.investor, 10)];
        const subscriptionAmount = row?.subAmount;

        return {
          entityGroupId: currentInvestor?.entityGroupId,
          subscriptionAmount,
        };
      }),
    };

    sendSubscription({
      sukukId: issuanceID,
      requestPayload,
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <PageTitle title={t("subscription:Pre-Allocation Allocation.Pre-Allocation Allocation")} />
      <SubscriptionAllocationTableEdit tableData={tableData} setTableData={setTableData} />
      <Button
        id="send-button"
        variant="contained"
        disabled={
          isTableEmpty ||
          !isTotalSubAmountEqualToGivenIssuanceSize ||
          subscriptionData?.status === "SubscriptionConfirmations"
        }
        color="primary"
        onClick={handleOnClick}
        fullWidth
      >
        {t("subscription:Pre-Allocation Allocation.Send for Confirmation")}
      </Button>
      {!isTableEmpty && !isTotalSubAmountEqualToGivenIssuanceSize ? (
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "red",
          }}
        >
          <span>
            {t(
              "subscription:Pre-Allocation Allocation.Total Pre-Allocation Amount must be equal to the given issuance size"
            )}
          </span>
        </div>
      ) : null}
    </Fragment>
  );
};

export default SubscriptionAllocation;
