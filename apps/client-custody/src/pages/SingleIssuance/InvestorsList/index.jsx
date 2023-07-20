import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import InviteInvestorForm from "../../../components/InviteInvestorForm";
import LoadingPage from "../../../components/LoadingPage";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../redux/selectors/issuance";
// import cx from 'classnames';
import style from "./style.module.scss";

const InvestorsList = () => {
  const { issuanceID } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(["investors"]);
  const investors = useSelector(issuanceSelectors.selectInvestors);
  const isFetchingInvestors = useSelector(issuanceSelectors.selectFetchingInvestors);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const { accessControls } = currentEntityGroup;
  const hasIssuanceCreateACL = accessControls.some((acl) => acl?.key === "Issuance/Create");
  const hasSubscriptionAllocateACL = accessControls.some(
    (acl) => acl?.key === "Subscription/Allocate"
  );
  // Create Issuance

  useEffect(() => {
    if (hasIssuanceCreateACL && hasSubscriptionAllocateACL) {
      const fetchInvestors = (payload) =>
        dispatch(issuanceActionCreators.doFetchInvestors(payload));

      fetchInvestors({ sukukId: issuanceID });
    }
  }, [
    issuanceID,
    dispatch,
    currentEntityGroupID,
    hasIssuanceCreateACL,
    hasSubscriptionAllocateACL,
  ]);

  const handleSubmit = (values) => {
    const inviteInvestors = (payload) =>
      dispatch(issuanceActionCreators.doInviteInvestors(payload));

    inviteInvestors({ sukukId: issuanceID, requestPayload: values });
  };

  if (isFetchingInvestors) {
    return <LoadingPage />;
  }

  if (hasIssuanceCreateACL && hasSubscriptionAllocateACL) {
    return (
      <div>
        <p className={style.sectionTitle}>{t("investors:Investors")}</p>
        <InviteInvestorForm investors={investors} onSubmit={handleSubmit} />
      </div>
    );
  }

  return <p>{t("investors:You do not have access to this module!")}</p>;
};

InvestorsList.defaultProps = {};

export default InvestorsList;
