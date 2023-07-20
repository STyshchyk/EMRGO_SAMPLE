import { createContext, useContext, useReducer } from "react";

const THIRTY_DAYS_IN_MS = 2.592e9;

const initialState = {
  fromDate: new Date(Date.now() - THIRTY_DAYS_IN_MS),
  toDate: new Date(Date.now() + THIRTY_DAYS_IN_MS),
  holdingsOnly: false,
};

const CouponEventFiltersContext = createContext();
CouponEventFiltersContext.displayName = "CouponEventsTableFiltersContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FROM_DATE":
      return { ...state, fromDate: action.payload };
    case "SET_TO_DATE":
      return { ...state, toDate: action.payload };
    case "SET_HOLDINGS_ONLY":
      return { ...state, holdingsOnly: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CouponEventsTableFiltersProvider = ({ children }) => {
  const [couponEventFiltersState, couponEventFiltersDispatcher] = useReducer(reducer, initialState);

  const value = {
    couponEventFiltersState,
    couponEventFiltersDispatcher,
  };

  return (
    <CouponEventFiltersContext.Provider value={value}>
      {children}
    </CouponEventFiltersContext.Provider>
  );
};

export default CouponEventsTableFiltersProvider;

const useCouponEventsTableFilters = () => {
  const contextObject = useContext(CouponEventFiltersContext);

  if (contextObject === undefined) {
    throw new Error(
      "useCouponEventsTableFilters hook must be called within a CouponEventsTableFiltersContext component"
    );
  }

  return contextObject;
};

export { useCouponEventsTableFilters, CouponEventsTableFiltersProvider };
