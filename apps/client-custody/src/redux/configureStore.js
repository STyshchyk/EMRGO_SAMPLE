import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import history from './configs/history';
import persistedRootReducer from './reducers';

// TODO: FIX THIS CIRCULAR DEPENDENCY

// eslint-disable-next-line import/no-cycle
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [routerMiddleware(history), sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
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
