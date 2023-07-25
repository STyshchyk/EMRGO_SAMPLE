import { createAction } from "redux-actions";

import APP_RESET_STATES from "../actionTypes/app";

const doResetAppStates = createAction(APP_RESET_STATES);

export default doResetAppStates;
