import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/clientTerms';

export const doFetchTerms = createAction(actionTypes.FETCH_TERMS_REQUESTED);
export const doFetchTermsSuccess = createAction(actionTypes.FETCH_TERMS_SUCCEEDED);
export const doFetchTermsFailure = createAction(actionTypes.FETCH_TERMS_FAILED);

export const doFetchInstructions = createAction(actionTypes.FETCH_INSTRUCTIONS_REQUESTED);
export const doFetchInstructionsSuccess = createAction(actionTypes.FETCH_INSTRUCTIONS_SUCCEEDED);
export const doFetchInstructionsFailure = createAction(actionTypes.FETCH_INSTRUCTIONS_FAILED);

export const doFetchW8Ben = createAction(actionTypes.FETCH_W8BEN_REQUESTED);
export const doFetchW8BenSuccess = createAction(actionTypes.FETCH_W8BEN_SUCCEEDED);
export const doFetchW8BenFailure = createAction(actionTypes.FETCH_W8BEN_FAILED);

export const doFetchBoardResolution = createAction(actionTypes.FETCH_BOARD_RESOLUTION_SAMPLE_REQUESTED);
export const doFetchBoardResolutionSuccess = createAction(actionTypes.FETCH_BOARD_RESOLUTION_SAMPLE_SUCCEEDED);
export const doFetchBoardResolutionFailure = createAction(actionTypes.FETCH_BOARD_RESOLUTION_SAMPLE_FAILED);

export const doSubmitTerms = createAction(actionTypes.SUBMIT_TERMS_REQUESTED);
export const doSubmitTermsSuccess = createAction(actionTypes.SUBMIT_TERMS_SUCCEEDED);
export const doSubmitTermsFailure = createAction(actionTypes.SUBMIT_TERMS_FAILED);

export const doUploadFile = createAction(actionTypes.UPLOAD_FILE_REQUESTED);
export const doUploadFileSuccess = createAction(actionTypes.UPLOAD_FILE_SUCCEEDED);
export const doUploadFileFailure = createAction(actionTypes.UPLOAD_FILE_FAILED);

export const doFetchUploadedFile = createAction(actionTypes.FETCH_UPLOADED_FILES_REQUESTED);
export const doFetchUploadedFileSuccess = createAction(actionTypes.FETCH_UPLOADED_FILES_SUCCEEDED);
export const doFetchUploadedFileFailure = createAction(actionTypes.FETCH_UPLOADED_FILES_FAILED);

export const doSubmitVerifyTerms = createAction(actionTypes.SUBMIT_VERIFY_TERMS_REQUESTED);
export const doSubmitVerifyTermsSuccess = createAction(actionTypes.SUBMIT_VERIFY_TERMS_SUCCEEDED);
export const doSubmitVerifyTermsFailure = createAction(actionTypes.SUBMIT_VERIFY_TERMS_FAILED);
