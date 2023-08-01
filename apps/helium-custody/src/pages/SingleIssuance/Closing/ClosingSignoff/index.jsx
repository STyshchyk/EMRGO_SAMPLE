import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";

import Button from "../../../../components/Button";
import InfoAlert from "../../../../components/InfoAlert";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import SignoffStatusTable from "../SignoffStatusTable";

const PostClosingSignoffInfoAlert = () => {
  const { t } = useTranslation(["closing"]);
  const entityType = useSelector(authSelectors.selectCurrentEntityType);

  const postClosingTextMessage = {
    text: "",
    disabled: false,
  };

  switch (entityType) {
    case "OBLIGOR":
    case "ISSUER": {
      postClosingTextMessage.text = t(
        "closing:Post Closing Messages.Proceed to Admission & Settlement"
      );
      break;
    }
    case "INVESTOR": {
      postClosingTextMessage.text = t(
        "closing:Post Closing Messages.Proceed to Custody & Settlement"
      );
      break;
    }
    default: {
      postClosingTextMessage.text = t("closing:Post Closing Messages.The Transaction has Closed");
      break;
    }
  }

  return <InfoAlert text={postClosingTextMessage.text} />;
};

const ClosingSignoffButton = ({ signOffStatus }) => {
  const { t } = useTranslation(["closing"]);
  const dispatch = useDispatch();
  const { issuanceID } = useParams();

  const signoffButtonState = {
    text: "",
    disabled: false,
  };

  switch (signOffStatus) {
    case "Signoff Pending": {
      signoffButtonState.text = t(
        "closing:Closing Signoff Button.Confirm Signoff to Proceed with Closing"
      );
      signoffButtonState.disabled = false;
      break;
    }
    case "Signoff Complete": {
      signoffButtonState.text = t(
        "closing:Closing Signoff Button.Pending Signoffs from other parties"
      );
      signoffButtonState.disabled = true;
      break;
    }
    default: {
      signoffButtonState.text = t(
        "closing:Closing Signoff Button.Pending Lead Arranger Counsel request to proceed with Closing"
      );
      signoffButtonState.disabled = true;
      break;
    }
  }

  return (
    <Button
      disabled={signoffButtonState.disabled}
      variant="contained"
      fullWidth
      color="primary"
      onClick={() => {
        const confirmClosing = (payload) =>
          dispatch(issuanceActionCreators.doConfirmClosing(payload));
        confirmClosing({
          sukukId: issuanceID,
        });
      }}
      data-testid="confirm-own-signoff-btn"
    >
      {signoffButtonState.text}
    </Button>
  );
};

ClosingSignoffButton.propTypes = {
  signOffStatus: PropTypes.string.isRequired,
};

const ClosingSignoff = () => {
  const { t } = useTranslation(["closing"]);
  const dispatch = useDispatch();
  const { issuanceID } = useParams();

  // selectors
  const ownClosingSignoffData = useSelector(issuanceSelectors.selectOwnClosingSignoffData);
  const isFetchingClosingData = useSelector(issuanceSelectors.selectFetchingClosingData);

  const privatePlacementIssuanceStatusObject = useSelector(
    issuanceSelectors.selectPrivatePlacementIssuanceStatusObject
  );

  useEffect(() => {
    const fetchClosingData = (payload) =>
      dispatch(issuanceActionCreators.doFetchClosingData(payload));

    fetchClosingData({
      sukukId: issuanceID,
    });
  }, [dispatch, issuanceID]);

  if (isFetchingClosingData) return <LoadingPage />;

  return (
    <Fragment>
      <PageTitle title={t("closing:Signoff - Closing")} />
      <SignoffStatusTable tableData={ownClosingSignoffData} />
      <div
        style={{
          margin: "1rem 0",
        }}
      >
        {privatePlacementIssuanceStatusObject.Closing === "completed" ? (
          <PostClosingSignoffInfoAlert />
        ) : (
          <ClosingSignoffButton signOffStatus={ownClosingSignoffData[0]?.signOffStatus ?? ""} />
        )}
      </div>
    </Fragment>
  );
};

export default ClosingSignoff;
