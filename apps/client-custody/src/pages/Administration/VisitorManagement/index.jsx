import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useNavigate } from "react-router-dom";

import { reverse } from "named-urls";

// import ViewUserInfoModal from './ViewUserInfoModal';
import UserInfoModal from "../../../components/UserInfoModal";
import accessControlsList from "../../../constants/accessControlsList";
import routes from "../../../constants/routes";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as onboardingActionCreators from "../../../redux/actionCreators/onboarding";
import * as usersActionCreators from "../../../redux/actionCreators/users";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
// import * as kycActionCreators from '../../../redux/actionCreators/kyc';
import * as onboardingSelectors from "../../../redux/selectors/onboarding";
import ArchiveUserModal from "./ArchiveUserModal";
import AssignAdminModal from "./AssignAdminModal";
import AssignApproveModal from "./AssignApproveModal";
import AssignEntityModal from "./AssignEntityModal";
import AssignRMModal from "./AssignRMModal";
// import ViewUserKYCModal from './ViewUserKYCModal';
import DeactivateUserModal from "./DeactivateUserModal";
import DeassignAdminModal from "./DeassignAdminModal";
import InviteUserModal from "./InviteUserModal";
import ReactivateUserModal from "./ReactivateUserModal";
import RequestKYCModal from "./RequestKYCModal";
import VisitorsTable from "./VisitorsTable";

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [assignRMModalOpen, setAssignRMModalOpen] = useState(false);
  const [requestKYCModalOpen, setRequestKYCModalOpen] = useState(false);
  const [assignEntityModalOpen, setAssignEntityModalOpen] = useState(false);
  const [viewUserInfoModalOpen, setViewUserInfoModalOpen] = useState(false);
  const [deactivateUserModalOpen, setDeactivateUserModalOpen] = useState(false);
  const [reactivateUserModalOpen, setReactivateUserModalOpen] = useState(false);
  const [archiveUserModalOpen, setArchiveUserModalOpen] = useState(false);
  const [approveUserModalOpen, setApproveUserModalOpen] = useState(false);
  const [assignUserAdminModalOpen, setAssignUserAdminModalOpen] = useState(false);
  const [deassignUserAdminModalOpen, setDeassignUserAdminModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // const { t } = useTranslation(['administration']);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isAdmin = ["EMRGO_SERVICES"].includes(currentEntityGroup.entityType);
  const isRelationshipManager = currentEntityGroup?.accessControls?.some(
    (acl) => acl?.key === accessControlsList.RELATIONSHIP.view.key
  );
  const visitors = useSelector(onboardingSelectors.selectVisitors);
  const relationshipManagers = useSelector(onboardingSelectors.selectRelationshipManagers);
  const selectedUserInfo = useSelector(onboardingSelectors.selectUserInfo);
  const entitites = useSelector(entitiesSelectors.selectEntities);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchVisitors = (payload) =>
      dispatch(onboardingActionCreators.doFetchRMVisitorsRequest(payload));
    const fetchRMs = () => dispatch(onboardingActionCreators.doFetchRMRequest());
    const fetchEntities = () =>
      dispatch(entitiesActionCreators.doFetchEntities({ kycVerified: true }));

    fetchVisitors({ verified: false });
    fetchRMs();
    fetchEntities();
  }, [dispatch]);

  const handleInviteUserOpen = () => {
    setInviteUserModalOpen(true);
  };

  const handleInviteUserClose = () => {
    setInviteUserModalOpen(false);
    setSelectedRow(null);
  };

  const inviteUser = (payload) => {
    dispatch(
      onboardingActionCreators.doSignupRequest({ requestPayload: payload, isRelationshipManager })
    );
    setInviteUserModalOpen(false);
  };

  const handleAssignRMOpen = () => {
    setAssignRMModalOpen(true);
  };

  const handleAssignRMClose = () => {
    setAssignRMModalOpen(false);
    setSelectedRow(null);
  };

  const assignRM = (payload) => {
    dispatch(onboardingActionCreators.doProcessVisitorRequest(payload));
    setAssignRMModalOpen(false);
  };

  const handleRequestKYCOpen = () => {
    setRequestKYCModalOpen(true);
  };

  const handleRequestKYCClose = () => {
    setRequestKYCModalOpen(false);
    setSelectedRow(null);
  };

  const requestKYC = (payload) => {
    dispatch(onboardingActionCreators.doProcessVisitorRequest(payload));
    setRequestKYCModalOpen(false);
  };

  const handleAssignEntityOpen = () => {
    setAssignEntityModalOpen(true);
  };

  const handleAssignEntityClose = () => {
    setAssignEntityModalOpen(false);
    setSelectedRow(null);
  };

  const assignEntity = (payload) => {
    dispatch(onboardingActionCreators.doProcessVisitorRequest(payload));
    setAssignEntityModalOpen(false);
  };

  const handleViewUserInfoOpen = () => {
    const userId = selectedRow?.user?.id;
    dispatch(onboardingActionCreators.doFetchUserInfoRequest({ userId }));
    setViewUserInfoModalOpen(true);
  };

  const handleViewUserInfoClose = () => {
    setViewUserInfoModalOpen(false);
    setSelectedRow(null);
  };

  const handleViewUserKYCOpen = () => {
    const entityId = selectedRow?.entityId;
    history.push(
      reverse(
        `${routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}`,
        { entityId }
      )
    );
  };

  const handleViewDocumentsOpen = () => {
    const entityId = selectedRow?.entityId;
    history.push(
      reverse(`${routes.dashboard.administration.entityDetails.kyc.entities.entity.documents}`, {
        entityId,
      })
    );
  };

  const handleDeactivateUserOpen = () => {
    setDeactivateUserModalOpen(true);
  };

  const handleReactivateUserOpen = () => {
    setReactivateUserModalOpen(true);
  };

  const handleArchiveUserOpen = () => {
    setArchiveUserModalOpen(true);
  };

  const handleArchiveUserClose = () => {
    setArchiveUserModalOpen(false);
  };

  const deactivateEntity = (requestPayload, userId, entityId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
      })
    );
    setDeactivateUserModalOpen(false);
  };

  const reactivateEntity = (requestPayload, userId, entityId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
      })
    );
    setReactivateUserModalOpen(false);
  };

  const archiveUser = (requestPayload, userId, entityId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
      })
    );
    setArchiveUserModalOpen(false);
  };

  const handleDeactivateUserClose = () => {
    setDeactivateUserModalOpen(false);
    setSelectedRow(null);
  };

  const handleReactivateUserClose = () => {
    setReactivateUserModalOpen(false);
    setSelectedRow(null);
  };

  const handleApproveUserOpen = () => {
    setApproveUserModalOpen(true);
  };

  const approveEntity = (payload) => {
    dispatch(onboardingActionCreators.doApproveUserRequest(payload));
    setApproveUserModalOpen(false);
  };

  const handleApproveUserClose = () => {
    setApproveUserModalOpen(false);
    setSelectedRow(null);
  };

  const handleAssignUserAdminOpen = () => {
    setAssignUserAdminModalOpen(true);
  };

  const assignUserAdmin = (payload) => {
    dispatch(onboardingActionCreators.doAssignAdminRequest(payload));
    setAssignUserAdminModalOpen(false);
  };

  const handleAssignUserAdminClose = () => {
    setAssignUserAdminModalOpen(false);
    setSelectedRow(null);
  };

  const handleDeassignUserAdminOpen = () => {
    setDeassignUserAdminModalOpen(true);
  };

  const deassignUserAdmin = (payload) => {
    dispatch(onboardingActionCreators.doAssignAdminRequest(payload));
    setDeassignUserAdminModalOpen(false);
  };

  const handleDeassignUserAdminClose = () => {
    setDeassignUserAdminModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <Fragment>
      <Switch>
        <Route exact path={routes.dashboard.administration.entityManagement.visitors.home}>
          <VisitorsTable
            isRelationshipManager={isRelationshipManager}
            tableData={visitors}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            handleInviteUserOpen={handleInviteUserOpen}
            handleAssignRMOpen={handleAssignRMOpen}
            handleRequestKYCOpen={handleRequestKYCOpen}
            handleAssignEntityOpen={handleAssignEntityOpen}
            handleViewUserInfoOpen={handleViewUserInfoOpen}
            handleViewUserKYCOpen={handleViewUserKYCOpen}
            handleViewDocumentsOpen={handleViewDocumentsOpen}
            handleDeactivateUserOpen={handleDeactivateUserOpen}
            handleReactivateUserOpen={handleReactivateUserOpen}
            handleArchiveUserOpen={handleArchiveUserOpen}
            handleApproveUserOpen={handleApproveUserOpen}
            handleAssignUserAdminOpen={handleAssignUserAdminOpen}
            handleDeassignUserAdminOpen={handleDeassignUserAdminOpen}
          />
          <InviteUserModal
            open={inviteUserModalOpen}
            onClose={handleInviteUserClose}
            selectedRow={selectedRow}
            inviteUser={inviteUser}
          />
          <AssignRMModal
            open={assignRMModalOpen}
            onClose={handleAssignRMClose}
            selectedRow={selectedRow}
            assignRM={assignRM}
            relationshipManagers={relationshipManagers}
          />
          <RequestKYCModal
            open={requestKYCModalOpen}
            onClose={handleRequestKYCClose}
            selectedRow={selectedRow}
            requestKYC={requestKYC}
          />
          <AssignEntityModal
            open={assignEntityModalOpen}
            onClose={handleAssignEntityClose}
            selectedRow={selectedRow}
            assignEntity={assignEntity}
            entitites={entitites}
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

          {/* <ViewUserKYCModal open={viewUserKYCModalOpen} onClose={handleViewUserKYCClose} selectedRow={selectedRow} kycData={kycData} /> */}
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
          <ArchiveUserModal
            open={archiveUserModalOpen}
            onClose={handleArchiveUserClose}
            selectedRow={selectedRow}
            archiveUser={archiveUser}
          />
          <AssignApproveModal
            open={approveUserModalOpen}
            onClose={handleApproveUserClose}
            selectedRow={selectedRow}
            approveEntity={approveEntity}
            currentEntityGroupID={currentEntityGroupID}
          />
          <AssignAdminModal
            open={assignUserAdminModalOpen}
            onClose={handleAssignUserAdminClose}
            selectedRow={selectedRow}
            assignUserAdmin={assignUserAdmin}
            currentEntityGroupID={currentEntityGroupID}
          />
          <DeassignAdminModal
            open={deassignUserAdminModalOpen}
            onClose={handleDeassignUserAdminClose}
            selectedRow={selectedRow}
            deassignUserAdmin={deassignUserAdmin}
            currentEntityGroupID={currentEntityGroupID}
          />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default VisitorManagement;
