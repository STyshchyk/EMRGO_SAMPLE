/* eslint-disable consistent-return */

import { toast } from "react-toastify";

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as s3Service from "../../services/s3Service";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as authActionCreator from "../actionCreators/auth";
import * as entitiesActionCreators from "../actionCreators/entities";
import * as issuanceActionCreators from "../actionCreators/issuance";
import * as kycActionCreators from "../actionCreators/kyc";
import * as kycActionTypes from "../actionTypes/kyc";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* sendEOIKit({ payload }) {
  try {
    const { body, cb } = payload;
    const response = yield call(wethaqAPIService.kycAPI.inviteEntity, body);
    const { data } = response;
    yield put(kycActionCreators.doSendEOIKitSuccess({ data }));
    cb();
    if (body.data.sukukId) {
      yield put(issuanceActionCreators.doFetchIssuanceOverview({ sukukId: body.data.sukukId }));
    } else {
      yield put(entitiesActionCreators.doFetchEntities({ params: body.params }));
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doSendEOIKitFailure(errorMessage));
  }
}

function* approveKYC({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.approveKYC, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doFetchEntities({ params: payload.params }));
    yield put(kycActionCreators.doApproveKYCSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doApproveKYCFailure(errorMessage));
  }
}

function* fetchKYCData({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.fetchKYCDetailsByEntityId, payload);
    const { data } = response;
    yield put(kycActionCreators.doFetchKYCDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchKYCDataFailure(errorMessage));
  }
}

function* submitKycData({ payload }) {
  try {
    const { entityId, requestPayload, successCallback } = payload;
    const response = yield call(wethaqAPIService.kycAPI.postKYCDocumentData, {
      entityId,
      requestPayload,
    });

    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doPostKYCDataSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doPostKYCDataFailure(errorMessage));
  }
}

function* uploadKycFile({ payload }) {
  try {
    const { name } = payload.requestPayload;
    const params = {
      entityId: payload.entityId,
      requestPayload: payload.requestPayload,
    };
    const response = yield call(wethaqAPIService.kycAPI.uploadKYCFileByEntityId, params);
    const { data } = response;

    data.name = name;
    data.keyName = payload.keyName;
    data.index = payload.index;
    data.multiple = payload.multiple;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(
      toast.success,
      `${i18n.t("messages:Uploaded")} ${payload.requestPayload.originalFileName}`
    );
    yield put(kycActionCreators.doUploadKycFileSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(
      kycActionCreators.doUploadKycFileFailure({
        message: errorMessage,
        key: payload.keyName || payload.name,
        index: payload.index,
      })
    );
  }
}

function* fetchCCDropdowns({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(kycActionCreators.doFetchClientClassificationDropdownsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchClientClassificationDropdownsFailure(errorMessage));
  }
}

function* updateSanctionsQuestionnaire({ payload }) {
  try {
    const { entityId, requestPayload, filesUploaded, successCallback } = payload;

    const listOfAppendedSanctionQuestionDocuments = [];

    // Upload sanction documents
    if (requestPayload?.sanctions?.length > 0) {
      const { sanctions } = requestPayload;
      const formData = new FormData();

      sanctions.forEach((sanctionObject, index) => {
        if (sanctionObject?.documents?.files?.length > 0) {
          const { documents, question, id } = sanctionObject;

          documents.files.forEach((file) => {
            formData.append("names", question);
            formData.append("files", file.file);
            listOfAppendedSanctionQuestionDocuments.push({
              id,
              question,
              position: index,
            });
          });
        }
      });
      if (formData.getAll("names").length > 0) {
        // const fileUploadAPIResponse = yield call(wethaqAPIService.uploadKYCFileByEntityId, {
        //   requestPayload: formData,
        //   entityId,
        // });

        const collectionOfResolvedSanctionDocumentObjects = formData
          .getAll("names")
          .map((name, index) => ({
            id: listOfAppendedSanctionQuestionDocuments[index].id,
            question: listOfAppendedSanctionQuestionDocuments[index].question,
            document: filesUploaded.documents[index].fileIdentifier,
            position: listOfAppendedSanctionQuestionDocuments[index].position,
          }));
        const uniqueSanctionIds = [
          ...new Set(collectionOfResolvedSanctionDocumentObjects.map((item) => item.id)),
        ];

        const normalizedSanctionDocuments = uniqueSanctionIds.map((sanctionID) => {
          const sanctionObjectsWithTheSameID = collectionOfResolvedSanctionDocumentObjects.filter(
            (x) => x.id === sanctionID
          );

          let position;
          let question;

          const documents = sanctionObjectsWithTheSameID.map((item) => {
            position = item.position;
            question = item.question;

            return {
              fileName: item.document,
            };
          });

          return {
            id: sanctionID,
            documents,
            position,
            question,
          };
        });
        normalizedSanctionDocuments.forEach((x) => {
          const { position } = x;

          requestPayload.sanctions[position] = Object.assign(requestPayload.sanctions[position], x);
          delete requestPayload.sanctions[position].position;
        });
      }
    }

    const documentAPIResponse = yield call(wethaqAPIService.kycAPI.postKYCDocumentData, {
      entityId,
      requestPayload,
    });

    const { data } = documentAPIResponse;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doPostKYCSanctionsDataSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(kycActionCreators.doPostKYCSanctionsDataFailure(errorMessage));
  }
}

function* updateKYCRequirement({ payload }) {
  try {
    const { entityId, requestPayload, successCallback } = payload;
    const response = yield call(wethaqAPIService.kycAPI.postKYCDocumentData, {
      entityId,
      requestPayload,
    });
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doPostKYCRequirementsDataSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(kycActionCreators.doPostKYCRequirementsDataFailure(errorMessage));
  }
}

function* updateClientClassification({ payload }) {
  try {
    const { entityId, requestPayload, logout, successCallback } = payload;
    const response = yield call(wethaqAPIService.kycAPI.postKYCDocumentData, {
      entityId,
      requestPayload,
    });
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doPostKYCClassificationDataSuccess({ data }));
    if (logout) {
      yield put(authActionCreator.doLogoutUser());
    }
    if (successCallback) {
      successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(kycActionCreators.doPostKYCClassificationDataFailure(errorMessage));
  }
}

function* fetchDropdowns({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(kycActionCreators.doFetchDropdownsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchDropdownsFailure(errorMessage));
  }
}

function* fetchPaymentAccountsSaga() {
  try {
    const response = yield call(wethaqAPIService.kycAPI.getPaymentAccounts);
    const { data } = response;
    yield put(kycActionCreators.doFetchPaymentAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchPaymentAccountsFailure(errorMessage));
  }
}

function* fetchPaymentAccountsByEntityIdSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.getPaymentAccountsByEntityID, payload);
    const { data } = response;
    yield put(kycActionCreators.doFetchPaymentAccountsByEntityIDSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchPaymentAccountsByEntityIDFailure(errorMessage));
  }
}

function* uploadSupportingDocFileForPaymentAccount({ payload }) {
  try {
    const response = yield call(wethaqAPIService.fileAPI.upload, payload.requestPayload);
    const { data } = response;

    data.name = payload.requestPayload.name;
    data.keyName = payload.keyName;

    const fileName = payload.requestPayload.originalFileName;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t("messages:Uploaded")} ${fileName}`);
    yield put(kycActionCreators.doUploadSupportingDocumentForPaymentAccountSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(
      kycActionCreators.doUploadSupportingDocumentForPaymentAccountFailure({
        message: errorMessage,
        key: payload.keyName,
      })
    );
  }
}

function* addPaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.addPaymentAccount, payload);
    const { data } = response;
    yield put(kycActionCreators.doAddPaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doAddPaymentAccountFailure(errorMessage));
  }
}

function* deletePaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.deletePaymentAccount, payload);
    const { data } = response;
    yield put(kycActionCreators.doDeletePaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doDeletePaymentAccountFailure(errorMessage));
  }
}

function* editPaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.editPaymentAccount, payload);
    const { data } = response;
    yield put(kycActionCreators.doEditPaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doEditPaymentAccountFailure(errorMessage));
  }
}

function* setPaymentAccountAsDefault({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.setPaymentAccountAsDefault, payload);
    const { data } = response;
    yield put(kycActionCreators.doSetPaymentAccountAsDefaultSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doFetchPaymentAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doSetPaymentAccountAsDefaultFailure(errorMessage));
  }
}

function* validatePaymentAccount({ payload }) {
  try {
    const response = yield call(wethaqAPIService.kycAPI.validatePaymentAccount, payload);
    const { data } = response;
    yield put(kycActionCreators.doValidatePaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doValidatePaymentAccountFailure(errorMessage));
  }
}

function* fetchUploadedSupportingDocumentFile({ payload }) {
  const key = payload.fileName;
  try {
    const response = yield call(wethaqAPIService.fileAPI.download, payload);
    const { data } = response;
    data.fileName = key;
    window.open(data.link);
    yield put(kycActionCreators.doFetchUploadedSupportingDocumentFileSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(
      kycActionCreators.doFetchUploadedSupportingDocumentFileFailure({ message: errorMessage, key })
    );
  }
}

function* fetchElmUserSaga() {
  try {
    const response = yield call(wethaqAPIService.kycAPI.fetchElmUser);
    const { data } = response;
    yield put(kycActionCreators.doFetchElmUserSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(kycActionCreators.doFetchElmUserFailure(errorMessage));
  }
}

const kycSaga = [
  takeLatest(kycActionTypes.KYC_EOI_SEND_KIT_REQUESTED, sendEOIKit),
  takeLatest(kycActionTypes.ENTITY_KYC_FETCH_REQUESTED, fetchKYCData),
  takeLatest(kycActionTypes.KYC_APPROVAL_REQUESTED, approveKYC),
  takeLatest(kycActionTypes.ENTITY_KYC_POST_REQUESTED, submitKycData),
  takeEvery(kycActionTypes.KYC_FILE_UPLOAD_REQUESTED, uploadKycFile),
  takeEvery(kycActionTypes.FETCH_CC_DROPDOWNS, fetchCCDropdowns),
  takeLatest(kycActionTypes.KYC_SANCTIONS_DATA_POST_REQUESTED, updateSanctionsQuestionnaire),
  takeLatest(kycActionTypes.KYC_REQ_DATA_POST_REQUESTED, updateKYCRequirement),
  takeLatest(kycActionTypes.KYC_CC_DATA_POST_REQUESTED, updateClientClassification),
  takeLatest(kycActionTypes.FETCH_DROPDOWNS, fetchDropdowns),
  takeLatest(kycActionTypes.PAYMENT_ACCOUNTS_FETCH_REQUESTED, fetchPaymentAccountsSaga),
  takeLatest(
    kycActionTypes.PAYMENT_ACCOUNTS_UPLOAD_SUPPORTING_DOC_FILE_REQUESTED,
    uploadSupportingDocFileForPaymentAccount
  ),
  takeLatest(kycActionTypes.PAYMENT_ACCOUNTS_ADD_REQUESTED, addPaymentAccountSaga),
  takeLatest(kycActionTypes.PAYMENT_ACCOUNTS_DELETE_REQUESTED, deletePaymentAccountSaga),
  takeLatest(kycActionTypes.PAYMENT_ACCOUNTS_SET_AS_DEFAULT_REQUESTED, setPaymentAccountAsDefault),
  takeLatest(kycActionTypes.PAYMENT_ACCOUNTS_VALIDATE_REQUESTED, validatePaymentAccount),
  takeLatest(
    kycActionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_REQUESTED,
    fetchUploadedSupportingDocumentFile
  ),
  takeLatest(
    kycActionTypes.PAYMENT_ACCOUNTS_FETCH_BY_ENTITY_ID_REQUESTED,
    fetchPaymentAccountsByEntityIdSaga
  ),
  takeLatest(kycActionTypes.ELM_USER_FETCH_REQUESTED, fetchElmUserSaga),
];

export default kycSaga;
