/* eslint-disable react/require-default-props */
import { useEffect } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import BlotterList from "../../components/BlotterList";
import LoadingPage from "../../components/LoadingPage";
import {
  doBlotterCreateRequest,
  doBlotterDeleteRequest,
  doBlotterReadRequest,
  doBlotterUpdateRequest,
  doFetchDetailsRequest,
  doTradeApprovalRequest,
  doTradeSettlementRequest,
} from "../../redux/actionCreators/paymentAndSettlement";
import { selectCurrentEntityGroup, selectUserId, selectUserRole } from "../../redux/selectors/auth";
import {
  selectBlotterFirstLoadFlag,
  selectBlotters,
  selectPaymentDetails,
  selectPaymentDetailsLoading,
} from "../../redux/selectors/paymentAndSettlement";

const BlotterContainer = ({
  fetchPaymentDetails,
  paymentDetails,
  blotters,
  readBlotter,
  updateBlotter,
  createBlotter,
  deleteBlotter,
  userID,
  userRole,
  settleTrade,
  currentEntityGroup,
  firstLoadFlag,
  approveTrade,
  isLoading,
}) => {
  const currentGroupId = currentEntityGroup?.id;

  useEffect(() => {
    // updateBlotter({blotters:[{
    //   id: 'bb9bc90f-2878-4c05-b94d-6543b40f1fea',
    //   key: JSON.stringify({ parameters: { name: 'Default Blotter', filters: {}, manualColumnMove: [] } }),
    // }]});
    readBlotter({ currentGroupId });
    fetchPaymentDetails({ currentGroupId });
    // fetchDropdowns(['country', 'currency']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroupId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <BlotterList
      fetchPaymentDetails={fetchPaymentDetails}
      paymentDetails={paymentDetails}
      userID={userID}
      userRole={userRole}
      blotters={blotters}
      updateBlotter={updateBlotter}
      createBlotter={createBlotter}
      deleteBlotter={deleteBlotter}
      settleTrade={settleTrade}
      approveTrade={approveTrade}
      currentEntityGroup={currentEntityGroup}
      firstLoadFlag={firstLoadFlag}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchPaymentDetails: (payload) => dispatch(doFetchDetailsRequest(payload)),
  readBlotter: (payload) => dispatch(doBlotterReadRequest(payload)),
  updateBlotter: (payload) => dispatch(doBlotterUpdateRequest(payload)),
  createBlotter: (payload) => dispatch(doBlotterCreateRequest(payload)),
  deleteBlotter: (payload) => dispatch(doBlotterDeleteRequest(payload)),
  settleTrade: (payload) => dispatch(doTradeSettlementRequest(payload)),
  approveTrade: (payload) => dispatch(doTradeApprovalRequest(payload)),
});

const mapStateToProps = (state) => ({
  paymentDetails: selectPaymentDetails(state),
  blotters: selectBlotters(state),
  userRole: selectUserRole(state),
  userID: selectUserId(state),
  currentEntityGroup: selectCurrentEntityGroup(state),
  firstLoadFlag: selectBlotterFirstLoadFlag(state),
  isLoading: selectPaymentDetailsLoading(state),
});

BlotterContainer.propTypes = {
  fetchPaymentDetails: PropTypes.func.isRequired,
  readBlotter: PropTypes.func.isRequired,
  updateBlotter: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  createBlotter: PropTypes.func.isRequired,
  deleteBlotter: PropTypes.func.isRequired,
  settleTrade: PropTypes.func.isRequired,
  approveTrade: PropTypes.func.isRequired,
  userID: PropTypes.string,
  paymentDetails: PropTypes.arrayOf(PropTypes.object),
  blotters: PropTypes.arrayOf(PropTypes.object),
  currentEntityGroup: PropTypes.shape({
    id: PropTypes.string,
  }),
  firstLoadFlag: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlotterContainer);
