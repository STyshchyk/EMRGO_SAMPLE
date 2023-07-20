import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import SubscriptionsTableView from "../SubscriptionsTableView";

const SubscriptionFinalization = () => {
  const dispatch = useDispatch();
  const { issuanceID } = useParams();
  const { t } = useTranslation(["subscription"]);

  // selectors
  const currencyName = useSelector(issuanceSelectors.selectCurrencyName);
  const entityType = useSelector(authSelectors.selectCurrentEntityType);
  const subscriptionData = useSelector(issuanceSelectors.selectSubscriptionData);
  const subscriptions = useSelector(issuanceSelectors.selectSubscriptions);
  const isFetchingSubscriptions = useSelector(issuanceSelectors.selectFetchingSubscriptions);
  const isFetchingInvestors = useSelector(issuanceSelectors.selectFetchingInvestors);

  const areAllSubsConfirmed = subscriptions.reduce(
    (acc, next) => acc && next?.eoiStatus === "Confirmed",
    true
  );

  const subscriptionConfirmationsStatus = subscriptionData?.status === "SubscriptionConfirmations";

  // dispatchers
  const finaliseSubscription = (payload) =>
    dispatch(issuanceActionCreators.doFinaliseSubscription(payload));

  const isLoading = isFetchingSubscriptions || isFetchingInvestors;

  useEffect(() => {
    const fetchSubscription = (payload) =>
      dispatch(issuanceActionCreators.doFetchSubscription(payload));
    fetchSubscription({ sukukId: issuanceID });
  }, [issuanceID, dispatch]);

  useEffect(() => {
    const fetchInvestors = (payload) => dispatch(issuanceActionCreators.doFetchInvestors(payload));

    fetchInvestors({ sukukId: issuanceID });
  }, [dispatch, issuanceID]);

  const handleOnClick = () => {
    finaliseSubscription({ sukukId: issuanceID });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <PageTitle
        title={t("subscription:Pre-Allocation Finalization.Pre-Allocation Finalization")}
      />
      <SubscriptionsTableView data={subscriptions} currencyName={currencyName} />
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        {entityType !== "CO_ARRANGER" ? (
          <Button
            id="finalize-button"
            variant="contained"
            disabled={!areAllSubsConfirmed || !subscriptionConfirmationsStatus}
            color="primary"
            onClick={handleOnClick}
            fullWidth
          >
            {t("subscription:Pre-Allocation Finalization.Finalize Pre-Allocations")}
          </Button>
        ) : (
          <div className="py-4"></div>
        )}
      </div>
    </Fragment>
  );
};

export default SubscriptionFinalization;
