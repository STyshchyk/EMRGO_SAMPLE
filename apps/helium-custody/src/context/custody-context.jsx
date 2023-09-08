import * as React from "react";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import * as authActionCreators from "../redux/actionCreators/auth";
import * as authSelectors from "../redux/selectors/auth";

const CustodyWrapperContext = createContext(null);

export const CustodyWrapperProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authenticatedUserObject = useSelector(authSelectors.selectAuthenticatedUserObject);

  useEffect(() => {
    const fetchUserProfile = (payload) => dispatch(authActionCreators.doFetchUserProfile(payload));

    fetchUserProfile({
      successCallback: () => {
        // updateUser(authenticatedUserObject)
      },
    });
  }, [dispatch]);

  const state = {};

  return <CustodyWrapperContext.Provider value={state}>{children}</CustodyWrapperContext.Provider>;
};

export const useCustodyWrapperContext = () => useContext(CustodyWrapperContext);
