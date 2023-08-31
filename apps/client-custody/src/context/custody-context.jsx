import * as React from "react";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//!* use shared user store
import { useUser } from "@emrgo-frontend/shared-ui";
import store from "store";

import { changeDefaultEntityType } from "../helpers/user";
import * as authActionCreators from "../redux/actionCreators/auth";
import * as authSelectors from "../redux/selectors/auth";

const CustodyWrapperContext = createContext(null);

export const CustodyWrapperProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authenticatedUserObject = useSelector(authSelectors.selectAuthenticatedUserObject);

  const { permissions, user } = useUser();
  const entityType = changeDefaultEntityType(user?.role);

  const entityGroupIndex = authenticatedUserObject?.entityGroups.findIndex(
    (group) => group.entityType === entityType
  );

  useEffect(() => {
    dispatch(authActionCreators.doFetchUserProfile());
    dispatch(authActionCreators.doUpdateEntityGroupIndex({ index: entityGroupIndex }));
  }, [dispatch, permissions]);

  const state = {};

  return <CustodyWrapperContext.Provider value={state}>{children}</CustodyWrapperContext.Provider>;
};

export const useCustodyWrapperContext = () => useContext(CustodyWrapperContext);
