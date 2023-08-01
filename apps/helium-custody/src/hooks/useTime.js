import { useEffect, useReducer } from "react";

import setIntervalImmediately from "../helpers/setIntervalImmediately";

const actionTypes = {
  tick: "TICK",
};

const initialState = {
  date: new Date(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.tick:
      return {
        date: new Date(),
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const useTime = (refreshCycle = 100) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const id = setIntervalImmediately(() => {
      dispatch({ type: actionTypes.tick });
    }, refreshCycle);

    return () => clearInterval(id);
  }, [dispatch, refreshCycle]);

  return state.date;
};

export default useTime;
