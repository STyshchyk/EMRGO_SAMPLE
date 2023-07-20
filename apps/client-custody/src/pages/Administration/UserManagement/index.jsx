import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useNavigate } from "react-router-dom";

import { reverse } from "named-urls";

import UserInfoModal from "../../../components/UserInfoModal";
import accessControlsList from "../../../constants/accessControlsList";
import routes from "../../../constants/routes";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as onboardingActionCreators from "../../../redux/actionCreators/onboarding";
import * as usersActionCreators from "../../../redux/actionCreators/users";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import * as onboardingSelectors from "../../../redux/selectors/onboarding";
import InviteUserModal from "../VisitorManagement/InviteUserModal";
import ViewUserInfoModal from "../VisitorManagement/ViewUserInfoModal";
// import ViewUserInfoModal from './ViewUserInfoModal';
// import ViewUserKYCModal from './ViewUserKYCModal';
import DeactivateUserModal from "./DeactivateUserModal";
import ReactivateUserModal from "./ReactivateUserModal";
import UserTable from "./UserTable";

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [viewUserInfoModalOpen, setViewUserInfoModalOpen] = useState(false);
  const [deactivateUserModalOpen, setDeactivateUserModalOpen] = useState(false);
  const [reactivateUserModalOpen, setReactivateUserModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // const { t } = useTranslation(['administration']);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const isAdmin = ["EMRGO_SERVICES"].includes(currentEntityGroup.entityType);
  const isRelationshipManager = currentEntityGroup?.accessControls?.some(
    (acl) => acl?.key === accessControlsList.RELATIONSHIP.view.key
  );
  const users = useSelector(onboardingSelectors.selectVisitors);
  const selectedUserInfo = useSelector(onboardingSelectors.selectUserInfo);
  const isMFAEnabled = selectedUserInfo?.user?.MFAEnabled;
  const entityUsers = useSelector(entitiesSelectors.selectEntityUsers);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityId = currentEntityGroup?.entity?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    if (isAdmin) {
      const fetchVisitors = (payload) =>
        dispatch(onboardingActionCreators.doFetchRMVisitorsRequest(payload));
      const fetchRMs = () => dispatch(onboardingActionCreators.doFetchRMRequest());
      const fetchEntities = () =>
        dispatch(entitiesActionCreators.doFetchEntities({ kycVerified: true }));

      fetchVisitors({ verified: true });
      fetchRMs();
      fetchEntities();
    } else {
      const fetchEntityUsers = (payload) =>
        dispatch(entitiesActionCreators.doFetchEntityUsers(payload));

      fetchEntityUsers({
        entityId,
      });
    }
  }, [dispatch, entityId, isAdmin]);

  const handleInviteUserOpen = () => {
    setInviteUserModalOpen(true);
  };

  const handleInviteUserClose = () => {
    setInviteUserModalOpen(false);
    setSelectedRow(null);
  };

  const inviteUser = (payload) => {
    dispatch(onboardingActionCreators.doSignupRequest({ requestPayload: payload }));
    setInviteUserModalOpen(false);
  };

  const handleViewUserInfoOpen = () => {
    const userId = selectedRow.user ? selectedRow.user.id : selectedRow.id;
    dispatch(onboardingActionCreators.doFetchUserInfoRequest({ userId }));
    setViewUserInfoModalOpen(true);
  };

  const handleViewUserInfoClose = () => {
    setViewUserInfoModalOpen(false);
    setSelectedRow(null);
  };

  const handleDeactivateUserOpen = () => {
    setDeactivateUserModalOpen(true);
  };

  const handleReactivateUserOpen = () => {
    setReactivateUserModalOpen(true);
  };

  const deactivateEntity = (payload, userId, currentEntityId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        payload,
        userId,
        entityId: currentEntityId,
        verified: true,
      })
    );
    setDeactivateUserModalOpen(false);
  };

  const reactivateEntity = (payload, userId, currentEntityId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload: payload,
        userId,
        entityId: currentEntityId,
        verified: true,
      })
    );
    setReactivateUserModalOpen(false);
  };

  const handleDeactivateUserClose = () => {
    setDeactivateUserModalOpen(false);
    setSelectedRow(null);
  };

  const handleReactivateUserClose = () => {
    setReactivateUserModalOpen(false);
    setSelectedRow(null);
  };

  const handleIndividualKYCOpen = () => {
    const individualId = selectedRow?.id;
    history.push(
      reverse(
        `${routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals.individual.home}`,
        { entityId, individualId }
      )
    );
  };

  const rowData = isAdmin ? users : entityUsers;

  return (
    <Fragment>
      <Switch>
        <Route exact path={routes.dashboard.administration.entityManagement.users.home}>
          <UserTable
            currentUserId={currentUserId}
            isMFAEnabled={isMFAEnabled}
            isAdmin={isAdmin}
            isRelationshipManager={isRelationshipManager}
            tableData={rowData}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            handleInviteUserOpen={handleInviteUserOpen}
            handleViewUserInfoOpen={handleViewUserInfoOpen}
            handleDeactivateUserOpen={handleDeactivateUserOpen}
            handleReactivateUserOpen={handleReactivateUserOpen}
            handleIndividualKYCOpen={handleIndividualKYCOpen}
          />
          {selectedUserInfo !== null ? (
            <UserInfoModal
              open={viewUserInfoModalOpen}
              onClose={handleViewUserInfoClose}
              selectedRow={selectedRow}
              selectedUserInfo={selectedUserInfo}
              isAdmin={isAdmin}
            />
          ) : (
            // <ViewUserInfoModal open={viewUserInfoModalOpen} onClose={handleViewUserInfoClose} selectedRow={selectedRow} selectedUserInfo={selectedUserInfo} isAdmin={isAdmin} />
            ""
          )}
          <InviteUserModal
            open={inviteUserModalOpen}
            onClose={handleInviteUserClose}
            selectedRow={selectedRow}
            inviteUser={inviteUser}
          />
          <DeactivateUserModal
            open={deactivateUserModalOpen}
            onClose={handleDeactivateUserClose}
            selectedRow={selectedRow}
            deactivateEntity={deactivateEntity}
          />
          <ReactivateUserModal
            open={reactivateUserModalOpen}
            onClose={handleReactivateUserClose}
            selectedRow={selectedRow}
            reactivateEntity={reactivateEntity}
          />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default VisitorManagement;
