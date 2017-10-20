import { message } from 'antd';
import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

const {
  GET_NEWCAR_MATERIAL_REQUEST,
  GET_NEWCAR_MATERIAL_SUCCESS,
  GET_NEWCAR_MATERIAL_FAILURE,

  SET_NEWCAR_MATERIAL_PAGE,
} = require('../../constants').default;

/**
 * ## get material list
 */
export const getMaterialRequest = createAction(GET_NEWCAR_MATERIAL_REQUEST);
export const getMaterialSuccess = createAction(GET_NEWCAR_MATERIAL_SUCCESS);
export const getMaterialFailure = createAction(GET_NEWCAR_MATERIAL_FAILURE);

export function getMaterialList(condition) {
  return dispatch => {
    dispatch(getMaterialRequest());
    api.ajax({ url: api.newCar.marketMaterialListAll(condition) }, data => {
      dispatch(getMaterialSuccess(data.res));
    }, data => {
      dispatch(getMaterialFailure(data.msg));
    });
  };
}

export function editMaterial(data, callback) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.marketMaterialEdit(),
      type: 'POST',
      data,
    }, () => {
      message.success('编辑成功！');
      dispatch(getMaterialList(getState().newCarMaterial));
      callback();
    }, () => {
      message.error('编辑失败！');
    });
  };
}

export function createMaterial(data) {
  return () => {
    api.ajax({
      url: api.newCar.marketMaterialCreate(),
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

/**
 * ## setPage
 * */
export function setPage(page) {
  return dispatch => {
    dispatch(createAction(SET_NEWCAR_MATERIAL_PAGE)(page));
  };
}

