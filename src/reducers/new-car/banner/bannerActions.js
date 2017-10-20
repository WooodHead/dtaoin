import { message } from 'antd';
import { createAction } from 'redux-actions';

import api from '../../../middleware/api';

const {
  GET_NEWCAR_BANNER_REQUEST,
  GET_NEWCAR_BANNER_SUCCESS,
  GET_NEWCAR_BANNER_FAILURE,

  SET_NEWCAR_BANNER_PAGE,
} = require('../../constants').default;

export const getBannersRequest = createAction(GET_NEWCAR_BANNER_REQUEST);
export const getBannersSuccess = createAction(GET_NEWCAR_BANNER_SUCCESS);
export const getBannersFailure = createAction(GET_NEWCAR_BANNER_FAILURE);

export function getBannerList(condition) {
  return dispatch => {
    dispatch(getBannersRequest());
    api.ajax({ url: api.newCar.marketBannerList(condition) }, data => {
      dispatch(getBannersSuccess(data.res));
    }, data => {
      dispatch(getBannersFailure(data.msg));
    });
  };
}

export function editBanner(data, callback) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.editMarketBanner(),
      type: 'POST',
      data,
    }, () => {
      message.success('编辑成功！');
      dispatch(getBannerList(getState().newCarBanner));
      callback();
    }, () => {
      message.error('编辑失败！');
    });
  };
}

export function createBanner(data) {
  return () => {
    api.ajax({
      url: api.newCar.createMarketBanner(),
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

export function bannerOffLine(id) {
  return (dispatch, getState) => {
    api.ajax({
      url: api.newCar.offlineMarketBanner(),
      type: 'POST',
      data: { banner_id: id },
    }, () => {
      message.success('下线成功！');
      dispatch(getBannerList(getState().newCarBanner));
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
    dispatch(createAction(SET_NEWCAR_BANNER_PAGE)(page));
  };
}

