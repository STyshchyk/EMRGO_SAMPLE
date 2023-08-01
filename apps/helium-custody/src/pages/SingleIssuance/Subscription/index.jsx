import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import PropTypes from "prop-types";

import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";
import convertNumberToIntlFormat from "../../../utils/convertNumberToIntlFormat";
// import statusesList from '../../../constants/wethaqAPI/statusesList';

import style from "./style.module.scss";
import SubscriptionAllocation from "./SubscriptionAllocation";
import SubscriptionConfirmation from "./SubscriptionConfirmation";
import SubscriptionFinalization from "./SubscriptionFinalization";

const TermsheetInfoPanel = () => {
  const { t } = useTranslation(["subscription"]);
  const size = useSelector(issuanceSelectors.selectIssuanceSize);
  const rate = useSelector(issuanceSelectors.selectProfitRate);
  const denomination = useSelector(issuanceSelectors.selectDenominationValue);
  const currencyName = useSelector(issuanceSelectors.selectCurrencyName);

  const intlFormatOpts = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return (
    <div className={style.details__wrapper}>
      <span>{t("subscription:Currency")}</span>
      <span>{currencyName}</span>
      <span>{t("subscription:Size")}</span>
      <span>{convertNumberToIntlFormat(size, intlFormatOpts)}</span>
      <span>{t("subscription:Rate")}</span>
      <span>{rate}%</span>
      <span>{t("subscription:Denomination")}</span>
      <span>{convertNumberToIntlFormat(denomination, intlFormatOpts)}</span>
    </div>
  );
};

const SubscriptionWrapper = ({ children }) => (
  <Fragment>
    <TermsheetInfoPanel />
    {children}
  </Fragment>
);

SubscriptionWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const Subscription = () => {
  const { t } = useTranslation(["subscription"]);
  // selectors
  const entityType = useSelector(authSelectors.selectCurrentEntityType);
  const accessControls = useSelector(authSelectors.selectCurrentListOfAcls);
  const subscriptionData = useSelector(issuanceSelectors.selectSubscriptionData);
  const hasSubscriptionView = accessControls.some((acl) => acl === "Subscription/View");
  const hasSubscriptionAllocateACL = accessControls.some((acl) => acl === "Subscription/Allocate");
  const hasSubscriptionConfirmACL = accessControls.some((acl) => acl === "Subscription/Confirm");
  const subscriptionStatus = subscriptionData.status === "Subscription";

  if (hasSubscriptionAllocateACL && entityType === "ARRANGER") {
    if (subscriptionStatus) {
      return (
        <SubscriptionWrapper>
          <SubscriptionAllocation />
        </SubscriptionWrapper>
      );
    }

    return (
      <SubscriptionWrapper>
        <SubscriptionFinalization />
      </SubscriptionWrapper>
    );
  }

  if (hasSubscriptionView && entityType === "CO_ARRANGER") {
    return (
      <SubscriptionWrapper>
        <SubscriptionFinalization />
      </SubscriptionWrapper>
    );
  }

  if (hasSubscriptionConfirmACL && entityType === "INVESTOR") {
    return (
      <SubscriptionWrapper>
        <SubscriptionConfirmation />
      </SubscriptionWrapper>
    );
  }

  return <p>{t("subscription:You do not have access to this module!")}</p>;
};

export default Subscription;
