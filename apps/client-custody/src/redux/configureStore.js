import { createRouterMiddleware } from "@lagunovsky/redux-react-router";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import { createLogger } from "redux-logger";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import history from "./configs/history";
import persistedRootReducer from "./reducers";
// TODO: FIX THIS CIRCULAR DEPENDENCY
// eslint-disable-next-line import/no-cycle
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [createRouterMiddleware(history), sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  const logger = createLogger();
  middlewares.push(logger);
}

let persistor;

const configureStore = (preloadedState = undefined) => {
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore(persistedRootReducer, preloadedState, composedEnhancers);

  persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};

export const getPersistor = () => persistor;

export default configureStore;
