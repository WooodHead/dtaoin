import { message } from 'antd';
import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

const {
  GET_QA_REQUEST,
  GET_QA_SUCCESS,
  GET_QA_FAILURE,

  SET_QA_PAGE,
} = require('../../constants').default;

export const getQaRequest = createAction(GET_QA_REQUEST);
export const getQaSuccess = createAction(GET_QA_SUCCESS);
export const getQaFailure = createAction(GET_QA_FAILURE);

export function getQaList(condition) {
  return dispatch => {
    dispatch(getQaRequest());
    api.ajax({ url: api.newCar.marketArticleList(condition) }, data => {
      dispatch(getQaSuccess(data.res));
    }, data => {
      dispatch(getQaFailure(data.msg));
    });
  };
}

export function editArticle(data, callback) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.editMarketArticle(),
      type: 'POST',
      data,
    }, () => {
      message.success('编辑成功！');
      dispatch(getQaList(getState().newCarQa));
      callback();
    }, () => {
      message.error('编辑失败！');
    });
  };
}

export function createArticle(data) {
  return () => {
    api.ajax({
      url: api.newCar.createMarketArticle(),
      type: 'POST',
      data,
    }, () => {
      message.success('创建成功！');
      location.reload();
    }, () => {
      message.error('创建失败！');
    });
  };
}

export function qaOffLine(id) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.offlineMarketArticle(),
      type: 'POST',
      data: { article_id: id },
    }, () => {
      message.success('下线成功！');
      dispatch(getQaList(getState().newCarQa));
    }, () => {
      message.error('下线失败！');
    });
  };
}

/**
 * ## setPage
 * */
export function setPage(page) {
  return dispatch => {
    dispatch(createAction(SET_QA_PAGE)(page));
  };
}

