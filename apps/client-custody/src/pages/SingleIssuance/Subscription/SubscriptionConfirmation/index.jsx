import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import SubscriptionsTableView from "../SubscriptionsTableView";

const SubscriptionConfirmation = () => {
  const dispatch = useDispatch();
  const { issuanceID } = useParams();
  const { t } = useTranslation(["subscription"]);

  // dispatchers
  const confirmSubscription = (payload) =>
    dispatch(issuanceActionCreators.doConfirmSubscription(payload));

  // selectors
  const subscriptions = useSelector(issuanceSelectors.selectSubscriptions);
  const subscriptionData = useSelector(issuanceSelectors.selectSubscriptionData);
  const currencyName = useSelector(issuanceSelectors.selectCurrencyName);
  const isFetchingSubscriptions = useSelector(issuanceSelectors.selectFetchingSubscriptions);

  const hasConfirmedEOI = subscriptions.reduce(
    (acc, next) => acc && next?.eoiStatus === "Confirmed",
    true
  );

  const isLoading = isFetchingSubscriptions;

  const handleOnClick = () => {
    confirmSubscription({ sukukId: issuanceID });
  };

  useEffect(() => {
    const fetchSubscription = (payload) =>
      dispatch(issuanceActionCreators.doFetchSubscription(payload));
    fetchSubscription({ sukukId: issuanceID });
  }, [dispatch, issuanceID]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <PageTitle
        title={t("subscription:Pre-Allocation Confirmation.Pre-Allocation Confirmation")}
      />
      <SubscriptionsTableView data={subscriptions} currencyName={currencyName} />
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Button
          id="confirm-button"
          disabled={subscriptionData?.status !== "SubscriptionConfirmations" || hasConfirmedEOI}
          variant="contained"
          color="primary"
          onClick={handleOnClick}
          fullWidth
        >
          {t("subscription:Pre-Allocation Confirmation.Confirm Pre-Allocation")}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionConfirmation;
