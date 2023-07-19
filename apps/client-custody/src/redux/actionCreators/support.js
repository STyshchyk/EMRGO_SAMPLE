import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/support';

export const doDropdownReadRequest = createAction(actionTypes.READ_DROPDOWN_REQUESTED);
export const doDropdownReadSuccess = createAction(actionTypes.READ_DROPDOWN_SUCCEEDED);
export const doDropdownReadFailure = createAction(actionTypes.READ_DROPDOWN_FAILED);

export const doFetchTFATickets = createAction(actionTypes.FETCH_TFA_TICKETS_REQUESTED);
export const doFetchTFATicketsSuccess = createAction(actionTypes.FETCH_TFA_TICKETS_SUCCEEDED);
export const doFetchTFATicketsFailure = createAction(actionTypes.FETCH_TFA_TICKETS_FAILED);

export const doUploadTFADocument = createAction(actionTypes.UPLOAD_TFA_VERIFICATION_DOCUMENT_REQUESTED);
export const doUploadTFADocumentSuccess = createAction(actionTypes.UPLOAD_TFA_VERIFICATION_DOCUMENT_SUCCEEDED);
export const doUploadTFADocumentFailure = createAction(actionTypes.UPLOAD_TFA_VERIFICATION_DOCUMENT_FAILED);

export const doFetchTFAVerificationDocument = createAction(actionTypes.TFA_VERIFICATION_DOCUMENT_FETCH_REQUESTED);
export const doFetchTFAVerificationDocumentSuccess = createAction(actionTypes.TFA_VERIFICATION_DOCUMENT_FETCH_SUCCEEDED);
export const doFetchTFAVerificationDocumentFailure = createAction(actionTypes.TFA_VERIFICATION_DOCUMENT_FETCH_FAILED);

export const doCreateTFATicket = createAction(actionTypes.TFA_TICKET_CREATE_REQUESTED);
export const doCreateTFATicketSuccess = createAction(actionTypes.TFA_TICKET_CREATE_SUCCEEDED);
export const doCreateTFATicketFailure = createAction(actionTypes.TFA_TICKET_CREATE_FAILED);

export const doDeleteTFATicket = createAction(actionTypes.TFA_TICKET_DELETE_REQUESTED);
export const doDeleteTFATicketSuccess = createAction(actionTypes.TFA_TICKET_DELETE_SUCCEEDED);
export const doDeleteTFATicketFailure = createAction(actionTypes.TFA_TICKET_DELETE_FAILED);

export const doApproveTFATicket = createAction(actionTypes.TFA_TICKET_APPROVE_REQUESTED);
export const doApproveTFATicketSuccess = createAction(actionTypes.TFA_TICKET_APPROVE_SUCCEEDED);
export const doApproveTFATicketFailure = createAction(actionTypes.TFA_TICKET_APPROVE_FAILED);
