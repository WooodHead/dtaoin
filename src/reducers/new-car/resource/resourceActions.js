import { message } from 'antd';
import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

const {
  GET_NEWCAR_RESOURCE_REQUEST,
  GET_NEWCAR_RESOURCE_SUCCESS,
  GET_NEWCAR_RESOURCE_FAILURE,

  SET_NEWCAR_RESOURCE_PAGE,

} = require('../../constants').default;

/**
 * ## get resource list
 */
export const getResourcesRequest = createAction(GET_NEWCAR_RESOURCE_REQUEST);
export const getResourcesSuccess = createAction(GET_NEWCAR_RESOURCE_SUCCESS);
export const getResourcesFailure = createAction(GET_NEWCAR_RESOURCE_FAILURE);

export function getResourceList(condition) {
  return dispatch => {
    dispatch(getResourcesRequest());
    api.ajax({ url: api.newCar.marketResourceList(condition) }, data => {
      dispatch(getResourcesSuccess(data.res));
    }, data => {
      dispatch(getResourcesFailure(data.msg));
    });
  };
}

export function editResource(data, callback) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.editMarketResource(),
      type: 'POST',
      data,
    }, () => {
      message.success('编辑成功！');
      dispatch(getResourceList(getState().newCarBanner));
      callback();
    }, () => {
      message.error('编辑失败！');
    });
  };
}

export function createResource(data, callback) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.createMarketResource(),
      type: 'POST',
      data,
    }, () => {
      message.success('创建成功！');
      dispatch(getResourceList(getState().newCarBanner));
      callback();
    }, () => {
      message.error('创建失败！');
    });
  };
}

export function resourceOffLine(id) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.offlineMarketResource(),
      type: 'POST',
      data: { resource_id: id },
    }, () => {
      message.success('下线成功！');
      dispatch(getResourceList(getState().newCarBanner));
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
    dispatch(createAction(SET_NEWCAR_RESOURCE_PAGE)(page));
  };
}

