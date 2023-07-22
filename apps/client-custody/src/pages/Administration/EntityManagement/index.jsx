import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import { capitalCase } from "change-case";

import routes from "../../../constants/routes";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import EditEntityPreferences from "./EditEntityPreferences";
import EntitiesTable from "./EntitiesTable";
import EntityGroupManagement from "./EntityGroupManagement";
import EntityUserAccessManagement from "./EntityUserAccessManagement";
import EntityUsersManagement from "./EntityUsersManagement";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        history.goBack();
      }}
    >
      Go Back
    </Button>
  );
};

const createEntitiesTableData = (entity) => ({
  id: entity.id,
  name: entity.corporateEntityName,
  legalIdentifier: entity.legalIdentifier,
  legalEntityIdentifier: entity.kyc?.legalEntityIdentifier,
  clientTermsStatus: capitalCase(entity.clientTerms?.status),
  tncStatus: entity.tncStatus,
  isActive: entity.isActive,
  validGroupTypes: entity?.validGroupTypes,
  groups: entity?.groups,
  parentEntityName: entity?.parentEntity?.entityParentName,
  kyc: entity?.kyc,
  onboardingRequest: entity?.onboardingRequest,
  // !!!DEV NOTE: By design, only entityPreferences.isActive sub-field determines the active status of each entity preference items in entityPreferences.preferences array sub-field so ignore isActive sub-field of preference item objects for now
  entityPreferences: entity?.entityPreferences
    .filter((entityPref) => entityPref.isActive)
    .map((activeEntityPref) => ({
      id: activeEntityPref.preferences.id,
      displayName: activeEntityPref.preferences.displayName,
    })),
  wethaqEntityId: entity.wethaqEntityId,
  agreements: entity?.agreements,
  hasSecuritySettings: Boolean(entity?.securitySettings),
  securitySettings: entity?.securitySettings,
});

const EntityManagement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isEntityTypeAdmin = useSelector(authSelectors.selectIsEntityTypeAdmin);
  const entities = useSelector(entitiesSelectors.selectEntities); // !or change here?

  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const isAdmin = entityType === "EMRGO_SERVICES";

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchEntities = () => dispatch(entitiesActionCreators.doFetchEntities());

    if (isAdmin || isEntityTypeAdmin) {
      fetchEntities();
    }
  }, [dispatch, isAdmin, currentEntityGroupID, isEntityTypeAdmin]);

  useEffect(() => {
    const fetchEntityTypesOptions = () =>
      dispatch(
        dropdownActionCreators.doFetchDropdownOptions({
          options: ["entityTypes"],
        })
      );

    fetchEntityTypesOptions();

    return () => {
      const resetDropdownState = () => dispatch(dropdownActionCreators.doResetDropdownState());

      resetDropdownState();
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchParentEntities = () => dispatch(entitiesActionCreators.doFetchParentEntities());

    if (isAdmin) {
      fetchParentEntities();
    }
  }, [dispatch, isAdmin, currentEntityGroupID]);

  useEffect(() => {
    const fetchEntityTypesOptions = () =>
      dispatch(
        dropdownActionCreators.doFetchDropdownOptions({
          options: ["entityTypes"],
        })
      );

    fetchEntityTypesOptions();

    return () => {
      const resetDropdownState = () => dispatch(dropdownActionCreators.doResetDropdownState());

      resetDropdownState();
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const fetchParentEntities = () => dispatch(entitiesActionCreators.doFetchParentEntities());

  //   if (isAdmin) {
  //     fetchParentEntities();
  //   }
  // }, [dispatch, isAdmin, currentEntityGroupID]);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={<EntitiesTable tableData={entities.map((i) => createEntitiesTableData(i))} />}
      ></Route>

      <Route
        exact
        path="/:entityId/entity-groups"
        element={
          <Fragment>
            <GoBackButton />
            <EntityGroupManagement />
          </Fragment>
        }
      ></Route>

      <Route
        exact
        path="/:entityId/entity-groups/:groupId/entity-user-access-management"
        element={
          <Fragment>
            <GoBackButton />
            <EntityUserAccessManagement />
          </Fragment>
        }
      ></Route>

      <Route
        exact
        path="/:entityId/entity-users/"
        element={
          <Fragment>
            <GoBackButton />
            <EntityUsersManagement />
          </Fragment>
        }
      ></Route>

      <Route
        exact
        path={routes.dashboard.administration.entityManagement.entities.entity.editEntityPrefs.home}
        element={
          <Fragment>
            <GoBackButton />
            <EditEntityPreferences />
          </Fragment>
        }
      ></Route>
    </Routes>
  );
};

export default EntityManagement;
