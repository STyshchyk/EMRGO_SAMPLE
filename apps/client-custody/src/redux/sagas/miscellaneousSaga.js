import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import * as miscellaneousActionCreators from '../actionCreators/miscellaneous';
import * as actionTypes from '../actionTypes/miscellaneous';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchDocumentLink({ payload }) {
  try {
    yield call(toast.info, i18n.t('Document will be downloaded Please Wait'), { autoClose: 2000 });
    const response = yield call(wethaqAPIService.miscellaneousAPI.fetchDocumentLink, payload);
    if (response.data.link) {
      yield put(miscellaneousActionCreators.doFetchDocumentLinkSuccess(response));
    } else {
      const errorMessage = i18n.t('File not found');
      yield call(toast.error, errorMessage);
      yield put(miscellaneousActionCreators.doFetchDocumentLinkFailure(errorMessage));
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(miscellaneousActionCreators.doFetchDocumentLinkFailure(errorMessage));
  }
}

function* fetchStaticFileLink({ payload }) {
  try {
    yield call(toast.info, i18n.t('Document will be downloaded Please Wait'), { autoClose: 2000 });
    const response = yield call(wethaqAPIService.miscellaneousAPI.fetchStaticFileLink, payload);
    if (response.data.link) {
      yield put(miscellaneousActionCreators.doFetchStaticFileSuccess(response));
    } else {
      const errorMessage = i18n.t('File not found');
      yield call(toast.error, errorMessage);
      yield put(miscellaneousActionCreators.doFetchStaticFileFailure(errorMessage));
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(miscellaneousActionCreators.doFetchStaticFileFailure(errorMessage));
  }
}

function* readTableConfig({ payload }) {
  try {
    const response = yield call(wethaqAPIService.miscellaneousAPI.readTableConfig, payload);
    const { data } = response;
    yield put(miscellaneousActionCreators.doReadTableConfigSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(miscellaneousActionCreators.doReadTableConfigFailure(errorMessage));
  }
}

function* updateTableConfig({ payload }) {
  try {
    const response = yield call(wethaqAPIService.miscellaneousAPI.updateTableConfig, payload);
    const { data } = response;
    yield put(miscellaneousActionCreators.doUpdateTableConfigSuccess({ data }));
    const tableKey = payload.settings[0].key;
    yield put(miscellaneousActionCreators.doReadTableConfigRequest({ keys: [tableKey] }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(miscellaneousActionCreators.doUpdateTableConfigFailure(errorMessage));
  }
}

const miscellaneousSaga = [
  takeLatest(actionTypes.DOCUMENT_LINK_FETCH_REQUESTED, fetchDocumentLink),
  takeLatest(actionTypes.STATIC_FILE_REQUESTED, fetchStaticFileLink),
  takeLatest(actionTypes.READ_TABLE_CONFIG_REQUESTED, readTableConfig),
  takeLatest(actionTypes.UPDATE_TABLE_CONFIG_REQUESTED, updateTableConfig),
];

export default miscellaneousSaga;
